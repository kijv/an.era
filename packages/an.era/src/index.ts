import type { ClientRequestOptions, Hono } from 'hono';
import type { App as DefaultApp } from './hono-app';
import { hc } from 'hono/client';

export type ArenaClientOptions = {
  baseUrl?: string;
};

export function arenaClient<Client extends Hono = DefaultApp>(
  options: ArenaClientOptions & ClientRequestOptions = {},
): ReturnType<typeof hc<Client>> {
  const { baseUrl = 'https://api.are.na', ...clientRequestOptions } = options;

  return hc<Client>(baseUrl, clientRequestOptions);
}

export { parseResponse, DetailedError } from 'hono/client';
