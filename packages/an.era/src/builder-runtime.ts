/**
 * Hono-style proxy: navigation + calls are driven at runtime by user access patterns.
 * The OpenAPI grouping (tags / param groups / operationIds) exists only as types in `./builder`.
 */

import type { ac } from './client';
import type { BuilderShape } from './builder';
import { dispatchGroupedOp, dispatchRootOp, resolveTagAccess } from './builder.dispatch';

/** Merged with `class Builder` below so instances match the generated `BuilderShape`. */
export interface Builder extends BuilderShape {}

type Client = ReturnType<typeof ac>;

const noop = (): unknown => undefined;

function normalizeGroupParams(params: string[], value: unknown): Record<string, unknown> {
  if (params.length === 1) return { [params[0]!]: value };
  return value as Record<string, unknown>;
}

function createGroupProxy(client: Client, tag: string, group: string, bound: Record<string, unknown>) {
  return new Proxy(noop, {
    get(_t, opId) {
      if (typeof opId !== 'string' || opId === 'then') return undefined;
      return (...args: unknown[]) => dispatchGroupedOp(client, tag, group, opId, bound, args);
    },
  });
}

function createTagProxy(client: Client, tag: string) {
  return new Proxy(noop, {
    get(_t, key) {
      if (typeof key !== 'string' || key === 'then') return undefined;
      const access = resolveTagAccess(tag, key);
      if (!access) return undefined;
      if (access.kind === 'root-op') {
        return (...args: unknown[]) => dispatchRootOp(client, tag, key, args);
      }
      return (value: unknown) =>
        createGroupProxy(client, tag, key, normalizeGroupParams(access.params, value));
    },
  });
}

function createBuilderRoot(client: Client) {
  return new Proxy(noop, {
    get(_t, tagKey) {
      if (typeof tagKey !== 'string' || tagKey === 'then') return undefined;
      return createTagProxy(client, tagKey);
    },
  });
}

export class Builder {
  constructor(client: Client) {
    return createBuilderRoot(client) as unknown as Builder;
  }
}
