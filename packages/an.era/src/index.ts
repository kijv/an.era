import type { ClientRequestOptions } from 'hono';
import { Builder } from './builder';
import { ac } from './client';

export type { BuilderShape } from './builder';
export { Builder };

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type ArenaOptions = Prettify<
  {
    baseUrl?: string;
    accessToken?: string;
  } & ClientRequestOptions
>;

export class Arena extends Builder {
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

    super(client);
  }
}
