import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    pool: 'forks',
    teardownTimeout: 5000,
    include: ['test/**/*.test.{ts,tsx}'],
  },
});
