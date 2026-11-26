import { configDefaults, defineConfig } from "vitest/config";

// The loop's tests only (Lab 21). Lab 19's tests run under node --test (npm test), and the
// connector's under its own workspace (npm run test:servers). Task 5b's tests, for the loop you
// write yourself, run on their own: npm run test:mine (vitest.mine.config.ts).
export default defineConfig({
  test: { include: ["tests/*.spec.ts"], exclude: [...configDefaults.exclude, "tests/mine.spec.ts"] },
});
