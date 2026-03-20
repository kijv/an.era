import type { App } from './hono-app';
import type { ClientRequestOptions, Hono } from 'hono';
import { hc } from 'hono/client';

export type ArenaClientOptions = {
  baseUrl?: string;
};

export function arenaClient<Client extends Hono = App>(
  options: ArenaClientOptions & ClientRequestOptions = {},
): ReturnType<typeof hc> {
  const { baseUrl = 'https://api.are.na', ...clientRequestOptions } = options;

  return hc<Client>(baseUrl, clientRequestOptions);
}

export { parseResponse } from 'hono/client';
