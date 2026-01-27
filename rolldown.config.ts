import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

export default defineConfig({
  input: ['src/index.js'],
  external: ['valibot'],
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    dts({
      tsgo: true,
      // oxc: true,
    }),
  ],
});
