import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  dts: {
    tsgo: true,
  },
  inlineOnly: ['form-urlencoded', 'oas', 'openapi-types'],
  external: ['valibot'],
});
