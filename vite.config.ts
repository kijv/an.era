import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      version: {
        command: 'vp exec changeset version && vp i --lockfile-only',
        cache: false,
      },
      release: {
        command:
          'vp run --filter "./packages/*" build && vp exec changeset publish',
        cache: false,
      },
    },
    cache: true,
  },
});
