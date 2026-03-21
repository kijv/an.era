import type { App as DefaultApp } from './app';
import { hc } from 'hono/client';

export type App = DefaultApp;

export { parseResponse, DetailedError } from 'hono/client';

export const ac = (
  ...args: Parameters<typeof hc<App>>
): ReturnType<typeof hc<App>> => {
  return hc<App>(...args);
};
