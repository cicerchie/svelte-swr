import type { FSMMachineConfig } from "@cicerchie/fsm";
import { newFSM } from "@cicerchie/fsm";
import { writable } from "svelte/store";

import { cache } from "./cache";
import { decreaseFetching, increaseFetching } from "./indicator";

interface SWROptions<T> {
  enabled?: boolean;
  initialData?: () => T;
  // revalidateOnFocus?: boolean;
  // revalidateOnReconnect?: boolean;
}

interface SWRParams<T> {
  key: string;
  fn: () => Promise<T>;
  options?: SWROptions<T>;
}

interface SWRStore<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isFetching: boolean;
}

const defaultSWRStore = {
  data: undefined,
  error: undefined,
  isLoading: false,
  isFetching: false,
};

const defaultSWRParams = {
  options: {
    enabled: true,
    initialData: undefined,
    // revalidateOnFocus: true,
    // revalidateOnReconnect: true,
  },
};

const isEnabled = (_, event) => event.data.options.enabled;

const swrMachine: FSMMachineConfig = {
  initial: "init",
  on: {
    revalidate: {
      target: "revalidating",
      cond: isEnabled,
    },
  },
  states: {
    init: {},
    revalidating: {
      entry: (ctx, event) => {
        if (cache.has(event.data.key)) {
          ctx = { ...ctx, isLoading: false, data: cache.get(event.data.key) };
        } else if (event.data.options.initialData) {
          const data = event.data.options.initialData();
          if (data) {
            ctx = { ...ctx, isLoading: false, data };
          }
        }
        return {
          ...ctx,
          isLoading: !(ctx.data || ctx.error),
          isFetching: true,
        };
      },
      on: {
        revalidate: null,
      },
      invoke: {
        src: (_, event) => {
          increaseFetching();
          return event.data.fn();
        },
        onDone: {
          target: "success",
          action: (ctx, event) => {
            cache.set(event.invokeEvent.data.key, event.data);
            return { ...ctx, error: undefined, data: event.data };
          },
        },
        onError: {
          target: "failure",
          action: (ctx, event) => {
            return { ...ctx, error: event.data, data: undefined };
          },
        },
      },
      exit: (ctx) => {
        decreaseFetching();
        return { ...ctx, isLoading: false, isFetching: false };
      },
    },
    failure: {},
    success: {},
  },
};

export function newSWR<T>() {
  // const store = writable<SWRStore<T>>({ ...defaultSWRStore }, () => {
  //   fsm.setEnabled(true);
  //   return () => {
  //     fsm.destroy();
  //   };
  // });
  const store = writable<SWRStore<T>>({ ...defaultSWRStore });

  const fsm = newFSM({
    config: swrMachine,
    context: { ...defaultSWRStore },
    receiveFn: (state, ctx) => store.set({ state, ...ctx }),
  });

  function update(params: SWRParams<T>) {
    params = { ...defaultSWRParams, ...params };
    fsm.send("revalidate", params);
  }

  return {
    subscribe: store.subscribe,
    update,
  };
}
