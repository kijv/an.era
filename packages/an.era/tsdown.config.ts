import { type UserConfig, defineConfig } from 'tsdown';

const baseConfig: UserConfig = {
  minify: true,
  dts: {
    sideEffects: true,
  },
  inputOptions: {
    experimental: {
      // nativeMagicString: true,
      lazyBarrel: true,
    },
    // treeshake: {
    //   moduleSideEffects: [{ test: /\/.*\.ts$/, sideEffects: false }],
    // },
  },
  outputOptions: {
    codeSplitting: {
      groups: [
        {
          name: 'api',
          test: /\/api\/operations\/.*\.ts$/,
        },
        {
          name: 'operations',
          test: /\/openapi\/operation\.ts$/,
        },
      ],
    },
  },
  inlineOnly: [
    'fast-content-type-parse',
    'url-template',
    'stable-hash',
    '@types/json-schema',
    'openapi-types',
    'oas',
  ],
  external: ['valibot'],
  publint: true,
};

export default defineConfig([
  {
    ...baseConfig,
    platform: 'neutral',
    entry: ['src/index.ts'],
  },
]);
