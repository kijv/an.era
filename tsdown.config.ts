import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  dts: {
    tsgo: true,
  },
  inlineOnly: ['form-urlencoded'],
  external: ['valibot', 'oas', 'oas-normalize'],
});
