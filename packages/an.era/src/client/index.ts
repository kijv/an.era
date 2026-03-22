import { DetailedError, hc, parseResponse as pr } from 'hono/client';
import type { App as DefaultApp } from './app';

export { DetailedError, parseResponse } from 'hono/client';

export type App = DefaultApp;

export const ac = (
  ...args: Parameters<typeof hc<App>>
): ReturnType<typeof hc<App>> => {
  return hc<App>(...args);
};
