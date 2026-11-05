import { defineConfig } from "vitest/config";

// The loop's tests only (Lab 20). Lab 19's tests run under node --test (npm test), and the
// connector's under its own workspace (npm run test:servers).
export default defineConfig({
  test: { include: ["tests/*.spec.ts"] },
});
