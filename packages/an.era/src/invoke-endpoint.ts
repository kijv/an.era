/**
 * Shared request helper for the typed builder proxy (merges bound path params into hono client args).
 */

export type Fn = (...args: any[]) => any;

export function invokeEndpoint(endpoint: Fn, boundParam: Record<string, unknown>, args: unknown[]) {
  if (!boundParam || Object.keys(boundParam).length === 0) return endpoint(...(args as any[]));
  if (args.length > 0 && typeof args[0] === 'object' && args[0] !== null) {
    const first = args[0] as Record<string, unknown>;
    const merged = { ...first, param: { ...(first.param as object | undefined), ...boundParam } };
    return endpoint(merged, ...(args.slice(1) as any[]));
  }
  return endpoint({ param: boundParam }, ...(args as any[]));
}
