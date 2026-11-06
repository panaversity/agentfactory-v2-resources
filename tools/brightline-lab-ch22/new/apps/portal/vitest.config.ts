import { defineConfig } from "vitest/config";

// The portal's own offline tests: npm run test:portal at the top of the repository.
export default defineConfig({
  test: { include: ["test/*.spec.ts"] },
});
