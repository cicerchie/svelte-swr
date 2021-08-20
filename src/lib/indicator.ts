import { writable } from "svelte/store";

export const globalIsFetching = writable<number>(0);

export const increaseFetching = (): void => globalIsFetching.update((v) => ++v);

export const decreaseFetching = (): void => globalIsFetching.update((v) => --v);
