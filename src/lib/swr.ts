import type { Readable } from "svelte/store";
import { newFSM } from "@cicerchie/fsm";
import { writable } from "svelte/store";

import { swrMachine } from "./machine";

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

interface Context<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isFetching: boolean;
}

interface SWRStore<T> extends Readable<Context<T>> {
  update: (params: SWRParams<T>) => void;
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

export function useSWR<T>(): SWRStore<T> {
  // const store = writable<SWRStore<T>>({ ...defaultSWRStore }, () => {
  //   fsm.setEnabled(true);
  //   return () => {
  //     fsm.destroy();
  //   };
  // });
  const store = writable<Context<T>>({ ...defaultSWRStore });

  const fsm = newFSM({
    config: swrMachine,
    context: { ...defaultSWRStore },
    receiveFn: (state, ctx) => store.set({ state, ...ctx }),
  });

  function update(params: SWRParams<T>) {
    params = {
      ...defaultSWRParams,
      ...params,
      options: {
        ...defaultSWRParams.options,
        ...params.options,
      },
    };
    fsm.send("revalidate", params);
  }

  return {
    subscribe: store.subscribe,
    update,
  };
}
