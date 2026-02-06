import { type UserConfig, defineConfig } from 'tsdown';

const baseConfig: UserConfig = {
  minify: true,
  dts: {
    sideEffects: false,
  },
  inlineOnly: ['fast-content-type-parse', 'url-template', 'stable-hash'],
  external: ['valibot'],
  inputOptions: {
    experimental: {
      lazyBarrel: true,
    },
    treeshake: {
      moduleSideEffects: [{ test: /\/.*\.ts$/, sideEffects: false }],
    },
  },
  publint: true,
};

export default defineConfig([
  {
    ...baseConfig,
    platform: 'neutral',
    entry: ['src/index.ts'],
  },
]);
