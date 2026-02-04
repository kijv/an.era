import * as v from 'valibot';
import type { MaybeValiSchema, ValiSchema } from '@/declaration';
import hash from 'stable-hash';
import { parseTemplate } from 'url-template';

export const createFetch =
  (baseUrl: URL, baseInit?: RequestInit) =>
  (
    url: string | URL,
    init: RequestInit = {},
    modifyUrl: (url: URL) => URL = (u) => u,
  ): Promise<Response> =>
    global.fetch(
      modifyUrl(new URL(url.toString(), baseUrl)),
      Object.assign({}, baseInit, init),
    );

export const parseResponseBody = (
  response: Response,
  mimeType: string,
): Promise<unknown> => {
  if (mimeType === 'application/json' || mimeType.endsWith('+json')) {
    return response.json();
  } else if (
    mimeType.startsWith('text/') ||
    mimeType === 'application/xml' ||
    mimeType === 'application/xhtml+xml' ||
    mimeType.endsWith('+xml') ||
    mimeType === 'application/javascript' ||
    mimeType === 'application/ecmascript' ||
    mimeType === 'application/x-www-form-urlencoded' ||
    mimeType === 'application/yaml'
  ) {
    return response.text();
  } else if (
    mimeType.startsWith('image/') ||
    mimeType.startsWith('audio/') ||
    mimeType.startsWith('video/') ||
    mimeType === 'application/pdf' ||
    mimeType === 'application/octet-stream'
  ) {
    return response.blob();
  } else {
    return response.text();
  }
};

export const createExpandTemplatePath = (cache = new Map<string, string>()) => {
  return (template: string, params?: unknown) => {
    const key = hash([template, params].filter(Boolean));
    if (cache.has(key)) return cache.get(key)!;

    const pathname =
      params != null && typeof params === 'object'
        ? parseTemplate(template).expand(params)
        : template;

    cache.set(key, pathname);

    return pathname;
  };
};

export const parseParameters = (
  params: Record<string, MaybeValiSchema>,
  args: unknown[],
): unknown[] => {
  const paramKeys = Object.keys(params);

  // Skip validation if no parameters are defined
  if (paramKeys.length === 0) {
    // If disableParsing is true and we have args, pass the first arg through directly
    // This handles cases where the operation expects content but has no schema
    // if (options.disableParsing && args.length > 0) {
    //   return args[0] as Record<string, unknown>;
    // }
    return [];
  }

  return paramKeys.map((key, i) => {
    const schema = params[key];
    if (schema) {
      const result = v.safeParse(schema as ValiSchema, args[i], {
        abortEarly: true,
      });
      if (result.success) {
        return result.output;
      } else {
        throw new Error(v.summarize(result.issues));
      }
    } else {
      throw new Error(
        `Parameter "${key}" in argument ${i} is missing a schema.`,
      );
    }
  });
};
