import { type UserConfig, defineConfig } from 'tsdown';

const baseConfig: UserConfig = {
  minify: true,
  dts: {
    sideEffects: false,
    emitJs: false,
    tsgo: true,
  },
  inputOptions: {
    experimental: {
      nativeMagicString: true,
      lazyBarrel: true,
      chunkOptimization: false,
    },
    treeshake: {
      moduleSideEffects: [{ test: /\/.*\.ts$/, sideEffects: false }],
    },
  },
  outputOptions: {
    codeSplitting: {
      groups: [
        {
          name: 'api',
          test: /\/api\/index\.ts$/,
        },
      ],
    },
  },
  inlineOnly: ['fast-content-type-parse', 'url-template', 'stable-hash'],
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
