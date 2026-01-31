import { defineConfig } from 'tsdown';

export default defineConfig({
  platform: 'neutral',
  entry: 'src/index.ts',
  minify: true,
  dts: {
    // oxc: true,
    // tsgo: true,
  },
  inlineOnly: [
    // 'form-urlencoded',
    // 'oas',
    // 'openapi-types',
    'fast-content-type-parse',
    'url-template',
    'stable-hash',
  ],
  external: ['valibot'],
  // outputOptions: {
  //   codeSplitting: {
  //     groups: [
  //       {
  //         name: 'openapi',
  //         test: 'openapi',
  //       },
  //     ],
  //   },
  // },
  publint: true,
  attw: true,
});
