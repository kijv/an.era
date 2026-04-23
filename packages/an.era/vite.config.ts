import { defineConfig } from 'vite-plus';
import { defineConfig as definePackConfig } from 'vite-plus/pack';

const packConfig = definePackConfig({
  publint: true,
  attw: {
    profile: 'esm-only',
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
    chunkFileNames: (chunkInfo) => {
      if (chunkInfo.name === 'hono') return 'hono.js';
      return '[name]-[hash].js';
    },
  },
});

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'vp pack',
      },
      dev: {
        command: 'vp pack --watch --sourcemap',
        cache: false,
      },
      test: {
        command: 'vitest',
      },
      coverage: {
        command: 'vitest run --coverage',
      },
    },
  },
  pack: [
    {
      ...packConfig,
      entry: ['src/index.ts', 'src/client/index.ts'],
      dts: {
        oxc: true,
      },
      deps: {
        onlyBundle: ['hono'],
      },
    },
  ],
});
