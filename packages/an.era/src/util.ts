export function createCachedImport<T>(
  imp: () => Promise<T>,
): () => T | Promise<T> {
  let cached: T | Promise<T>;
  return () => {
    if (!cached) {
      cached = imp().then((module) => {
        cached = module;
        return module;
      });
    }
    return cached;
  };
}

export const getDefaultOperations = createCachedImport(() =>
  import('@/openapi/operations').then((m) => m.operations),
);

export const getValibot = createCachedImport(() => import('valibot'));