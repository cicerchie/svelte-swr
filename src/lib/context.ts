import { setContext, getContext } from "svelte";

import type { Client, GlobalOptions } from "./client";
import { newClient } from "./client";

const key = "@cicerchie_svelte-swr";

export const getClient = (): Client => getContext(key);

export const setClient = (client: Client): void => setContext(key, client);

export const initClient = (options: GlobalOptions): Client => {
  const client = newClient(options);
  setClient(client);
  return client;
};
