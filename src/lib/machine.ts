import type { FSMMachineConfig } from "@cicerchie/fsm";

import { cache } from "./cache";
import { decreaseFetching, increaseFetching } from "./indicator";

const isEnabled = (_, event): boolean => event.data.options.enabled;

export const swrMachine: FSMMachineConfig = {
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
