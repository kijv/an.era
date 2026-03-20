import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'vp pack --minify',
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
  pack: {
    publint: true,
    attw: {
      profile: 'esm-only',
    },
    dts: {
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
    deps: {
      onlyBundle: ['hono'],
    },
  },
});
