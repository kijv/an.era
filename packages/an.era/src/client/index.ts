import {
  type ClientResponse,
  DetailedError,
  hc,
  parseResponse as pr,
} from 'hono/client';
import { type Handler, type Input as HonoInput } from 'hono';
import type { App as DefaultApp } from './app';
// @ts-expect-error
import { Context as HonoContext } from '../../node_modules/hono/dist/context';
import type { StandardSchemaV1 } from '@standard-schema/spec';

export type App = DefaultApp;

export { DetailedError };

export const parseResponse = async <
  T extends ClientResponse<any>,
  Input extends HonoInput,
>(
  fetchRes: T | Promise<T>,
  validator?: Handler<any, any, Input>,
): Promise<
  typeof validator extends never
    ? Awaited<ReturnType<typeof pr>>
    :
        | { success: true; data: Input['out'][keyof Input['out']] }
        | { success: false; issues: StandardSchemaV1.Issue[] }
> => {
  if (validator != null) {
    const res = await fetchRes;
    const c = new HonoContext(
      new Request(res.url, res as unknown as RequestInit),
    );

    const result = await validator(c, async () => void 0);

    if (result != null) {
      try {
        await pr(result);
      } catch (e) {
        if (e instanceof DetailedError) {
          return {
            success: false,
            issues: e.detail.data.error,
          };
        }
        throw e;
      }
    } else {
      return {
        success: true,
        data: (c.req.valid('json') ??
          c.req.valid('form')) as Input['out'][keyof Input['out']],
      };
    }
  }

  return pr(fetchRes) as Awaited<ReturnType<typeof pr>>;
};

export const ac = (
  ...args: Parameters<typeof hc<App>>
): ReturnType<typeof hc<App>> => {
  return hc<App>(...args);
};
