import { DetailedError, hc, parseResponse as pr } from 'hono/client';
import type { App as DefaultApp } from './app';

export { DetailedError, parseResponse } from 'hono/client';

<<<<<<< HEAD
export type App = DefaultApp;
=======
export { DetailedError };

export const parseResponse = (
  ...args: Parameters<typeof pr>
): ReturnType<typeof pr> => pr(...args);
>>>>>>> main

export const ac = (
  ...args: Parameters<typeof hc<App>>
): ReturnType<typeof hc<App>> => {
  return hc<App>(...args);
};
