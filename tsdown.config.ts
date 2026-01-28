import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  minify: true,
  dts: {
    tsgo: true,
  },
  inlineOnly: [
    'form-urlencoded',
    'oas',
    'openapi-types',
    'fast-content-type-parse',
  ],
  external: ['valibot'],
});
