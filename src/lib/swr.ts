import type { Readable } from "svelte/store";
import { newFSM } from "@cicerchie/fsm";
import { writable } from "svelte/store";

import { swrMachine } from "./machine";
import { getClient } from "./context";

interface Options<T> {
  enabled?: boolean;
  initialData?: () => T;
  // revalidateOnFocus?: boolean;
  // revalidateOnReconnect?: boolean;
}

interface Params<T> {
  key: string;
  fn: () => Promise<T>;
  options?: Options<T>;
}

interface Context<T> {
  data?: T;
  error?: Error;
  isLoading: boolean;
  isFetching: boolean;
}

interface SWRStore<T> extends Readable<Context<T>> {
  update: (params: Params<T>) => void;
}

const defaultContext = {
  isLoading: false,
  isFetching: false,
};

const defaultOptions = {
  enabled: true,
  // revalidateOnFocus: true,
  // revalidateOnReconnect: true,
};

export function useSWR<T>(): SWRStore<T> {
  const client = getClient();

  const context = { ...defaultContext };

  const store = writable<Context<T>>(context);

  const fsm = newFSM({
    config: swrMachine,
    context,
    receiveFn: (state, ctx) => {
      store.set({ state, ...ctx });

      if (client.options.onError && ctx.error) {
        client.options.onError(ctx.error);
      }
    },
  });

  function update(params: Params<T>) {
    params.options = { ...defaultOptions, ...params.options };

    fsm.send("revalidate", params);
  }

  return {
    subscribe: store.subscribe,
    update,
  };
}
