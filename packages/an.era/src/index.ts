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

    Object.assign(this, operations(client))
  }
}

// Augment the instance type with the fully-typed proxy returned by `operations(client)`.
export interface Arena extends ReturnType<typeof operations> {}
