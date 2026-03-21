import { describe, expect, it } from 'vitest';
import { Arena } from '../src';
import { OPERATIONS } from '../src/operations/generated';

const a = new Arena({
  fetch: () => {
    return new Response(
      JSON.stringify({
        foo: 'bar',
      }),
      {
        status: 200,
      },
    );
  },
});

describe('every operation name is defined during runtime', () => {
  for (const [opName, parts] of OPERATIONS) {
    // This has to be checked because technically passing $someValidOperationName
    // will actaully call the operation properly
    const hasPathParam = parts.some((part) => part.startsWith(':'));

    let fn = a[`$${opName}` as keyof typeof a] as () => Promise<Response>;
    it(`"$${opName}" is defined`, async () => {
      expect(fn).not.toThrow();
      expect(await fn().then((res) => res.json())).toStrictEqual({
        foo: 'bar',
      });
    });

    if (hasPathParam) {
      let [method, key, ...rest] = opName.split(/(?=[A-Z])/) as [
        string,
        string,
        ...string[],
      ];
      key = key.at(0)!.toLowerCase() + key.slice(1);
      method = method.toLowerCase() + rest.join('');

      const pathParam = parts
        .find((part) => part.startsWith(':'))
        ?.replace(':', '');

      const obj = a[key as keyof typeof a];
      const paramObj = (
        obj[pathParam as keyof typeof obj] as () => Record<
          string,
          () => Promise<Response>
        >
      )();
      const fn = paramObj[
        `$${method}` as keyof typeof paramObj
      ] as () => Promise<Response>;

      it(`"${key}.${pathParam}().$${method}" is defined`, async () => {
        expect(fn).not.toThrow();
        expect(await fn().then((res) => res.json())).toStrictEqual({
          foo: 'bar',
        });
      });
    }
  }
});
