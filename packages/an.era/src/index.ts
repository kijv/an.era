import type { ClientRequestOptions } from 'hono';
import type { Prettify } from './types';
import { ac } from './client';
import { operations } from './operations';

export type ArenaOptions = Prettify<
  {
    baseUrl?: string;
    accessToken?: string;
  } & ClientRequestOptions
>;

// oxlint-disable-next-line no-unsafe-declaration-merging
export class Arena {
  constructor(options: ArenaOptions = {}) {
    const {
      baseUrl = 'https://api.are.na',
      accessToken,
      headers,
      ...rest
    } = options;
    const client = ac(baseUrl, {
      ...rest,
      headers:
        typeof accessToken === 'string'
          ? typeof headers === 'function'
            ? async () => {
                const resolvedHeaders = await (
                  headers as () => Promise<Record<string, string>>
                )();
                return {
                  ...resolvedHeaders,
                  Authorization: `Bearer ${accessToken}`,
                };
              }
            : {
                ...headers,
                Authorization: `Bearer ${accessToken}`,
              }
          : headers,
    });

    return operations(client) as Arena;
  }
}

//
export interface Arena extends ReturnType<typeof operations> {}
