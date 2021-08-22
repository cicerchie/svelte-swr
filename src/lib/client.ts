export interface GlobalOptions {
  onError?: (error: Error) => void;
}

export interface Client {
  options: GlobalOptions;
}

const defaultGlobalOptions: GlobalOptions = {};

export const newClient = (options: GlobalOptions): Client => {
  options = { ...defaultGlobalOptions, ...options };

  return { options };
};
