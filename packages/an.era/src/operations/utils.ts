type PlainObject = { [key: string]: any };

export function deepAssign<T extends PlainObject, U extends PlainObject>(
  target: T,
  ...sources: U[]
): T & U {
  for (const source of sources) {
    if (source == null) continue;

    for (const key of Object.keys(source)) {
      const srcVal = (source as PlainObject)[key];
      const tgtVal = (target as PlainObject)[key];

      const isObj =
        srcVal !== null && typeof srcVal === 'object' && !Array.isArray(srcVal);

      const isTgtObj =
        tgtVal !== null && typeof tgtVal === 'object' && !Array.isArray(tgtVal);

      if (isObj && isTgtObj) {
        // both sides plain objects → recurse
        deepAssign(tgtVal, srcVal);
      } else {
        // otherwise overwrite
        (target as PlainObject)[key] = srcVal;
      }
    }
  }

  return target as T & U;
}
