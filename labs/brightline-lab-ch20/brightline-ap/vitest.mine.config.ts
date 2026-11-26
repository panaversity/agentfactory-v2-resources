import { defineConfig } from "vitest/config";

// Task 5b only: the recorded tests, run against your own loop (src/loop/mine.ts). npm run test:mine.
export default defineConfig({
  test: { include: ["tests/mine.spec.ts"] },
});
