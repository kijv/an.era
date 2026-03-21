import type { App as DefaultApp } from './app';
import { hc, parseResponse as pr } from 'hono/client';

export type App = DefaultApp;

export { DetailedError } from 'hono/client';

export const parseResponse = (...args: Parameters<typeof pr>) => pr(...args);

export const ac = (
  ...args: Parameters<typeof hc<App>>
): ReturnType<typeof hc<App>> => {
  return hc<App>(...args);
};
