// Runtime function to find which key has exactly one occurrence

import type { RemoveCommonPrefix } from './declaration';

// Returns the key only if there's exactly ONE such key, otherwise returns null
export function findKeyWithSingleOccurrence<K extends PropertyKey>(
  obj: Record<string, any>,
  targetKey: K,
): string | null {
  let foundKey: string | null = null;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value !== 'object' || value === null) continue;

    let count = 0;
    for (const childKey of Object.keys(value)) {
      if (childKey === targetKey) {
        count++;
        if (count > 1) break;
      }
    }

    if (count === 1) {
      if (foundKey !== null) {
        // Multiple keys have single occurrence, return null
        return null;
      }
      foundKey = key;
    }
  }

  return foundKey;
}

// Check if object has exactly one direct key matching target key
export function hasExactlyOneOccurrence<K extends PropertyKey>(
  obj: Record<string, any>,
  targetKey: K,
): boolean {
  let count = 0;

  for (const key of Object.keys(obj)) {
    if (key === targetKey) {
      count++;
      if (count > 1) return false;
    }
  }

  return count === 1;
}

// Runtime function to remove common prefix from object keys
export function removeCommonPrefix<T extends Record<string, any>>(
  obj: T,
  defaultKey?: string,
): RemoveCommonPrefix<
  T,
  typeof defaultKey extends string ? typeof defaultKey : never
> {
  const keys = Object.keys(obj);

  if (keys.length === 0) {
    return {} as any;
  }

  // Find common prefix
  const findCommonPrefix = (strings: string[]): string => {
    if (strings.length === 0) return '';
    if (strings.length === 1) return strings[0];

    let prefix = '';
    const first = strings[0];

    for (let i = 0; i < first.length; i++) {
      const char = first[i];
      if (strings.every((s) => s[i] === char)) {
        prefix += char;
      } else {
        break;
      }
    }

    return prefix;
  };

  const commonPrefix = findCommonPrefix(keys);

  // Transform object
  const result: Record<string, any> = {};

  for (const key of keys) {
    let newKey = key.slice(commonPrefix.length);

    // Handle empty key after prefix removal
    if (newKey === '') {
      newKey = defaultKey !== undefined ? defaultKey : key;
    } else {
      // Uncapitalize first letter
      newKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);
    }

    result[newKey] = obj[key];
  }

  return result as any;
}
