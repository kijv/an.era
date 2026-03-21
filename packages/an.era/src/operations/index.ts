import {
  type Operations as GeneratedOperations,
  OPERATIONS,
} from './generated';
import type { OptionalPropertyForFirstArgumentOfFunction } from './types';
import type { UnionToIntersection } from 'hono/utils/types';
import type { ac } from '../client';
import { deepAssign } from './utils';

type Client = ReturnType<typeof ac>;

export type Callback = (opts: CallbackOptions, ctx: { args: any[] }) => unknown;

interface CallbackOptions {
  path: string[];
  args: any[];
}

const createProxy = (
  callback: Callback,
  path: string[],
  ctx: { args: any[] } = { args: [] },
) => {
  const proxy: unknown = new Proxy(() => {}, {
    get(_obj, key) {
      if (typeof key !== 'string' || key === 'then') {
        return undefined;
      }
      return createProxy(callback, [...path, key], ctx);
    },
    apply(_1, _2, args) {
      return callback(
        {
          path,
          args,
        },
        ctx,
      );
    },
  });
  return proxy;
};

type Operations<
  App extends {
    [K: string]:
      | ((...args: any[]) => any)
      | Record<
          string,
          {
            param: string;
            method: (...args: any[]) => any;
          }
        >;
  },
> = {
  [K in keyof App]: App[K] extends (...args: any[]) => any
    ? App[K]
    : App[K] extends Record<
          string,
          { param: string; method: (...args: any[]) => any }
        >
      ? Operation<App[K]>
      : never;
};

type Operation<
  R extends Record<string, { param: string; method: (...args: any[]) => any }>,
> = {
  [K in R[keyof R]['param']]: (
    param: Parameters<R[keyof R]['method']>[0]['param'][K],
  ) => {
    [L in keyof R as `$${L extends string ? L : never}`]: OptionalPropertyForFirstArgumentOfFunction<
      R[keyof R]['method'],
      'param',
      K
    >;
  };
};

export const operations = (client: Client) => {
  return createProxy(function proxyCallback(opts, ctx) {
    const parts = [...opts.path];
    const lastParts = parts.slice(-3).reverse();

    // allow calling .toString() and .valueOf() on the proxy
    if (lastParts[0] === 'toString') {
      if (lastParts[1] === 'name') {
        return lastParts[2] || '';
      }
      return proxyCallback.toString();
    }

    if (lastParts[0] === 'valueOf') {
      if (lastParts[1] === 'name') {
        return lastParts[2] || '';
      }
      return proxyCallback;
    }

    let method = '';
    if (lastParts[0]?.startsWith('$')) {
      const last = parts.pop();
      if (last) {
        method = last.replace(/^\$/, '');
      }
    }

    if (!method) {
      return createProxy(proxyCallback, parts.slice(0, -1), {
        args: opts.args.length
          ? [
              deepAssign(
                {
                  param: {
                    [parts.at(-1)!]: opts.args[0],
                  },
                },
                opts.args[1],
              ),
            ]
          : [],
      });
    }

    const potentialOperationNames = new Set([
      // concatenate parts to method
      parts.reduce((acc, part) => {
        return acc + part.charAt(0).toUpperCase() + part.slice(1);
      }, method),
      // e.g. [batch, getStatus] -> getBatchStatus
      parts.reduce(
        (acc, part) => {
          return acc + part.charAt(0).toUpperCase() + part.slice(1);
        },
        method.split(/(?=[A-Z])/)[0],
      ) +
        method
          .split(/(?=[A-Z])/)
          .slice(1)
          .reduce((acc, part) => {
            return acc + part.charAt(0).toUpperCase() + part.slice(1);
          }, ''),
    ]);

    const operationName = Array.from(potentialOperationNames).find((name) =>
      OPERATIONS.has(name),
    );
    if (!operationName) return;

    const path = OPERATIONS.get(operationName)!;
    const fetch = path.reduce(
      (acc, part) => acc[part],
      client as Record<string, any>,
    ) as (...args: any[]) => unknown;

    const args = ctx.args
      .concat(opts.args[0])
      .reduce((acc, arg) => deepAssign(acc, arg), {});

    return fetch(args, opts.args[1]);
  }, []) as UnionToIntersection<Operations<GeneratedOperations>>;
};
