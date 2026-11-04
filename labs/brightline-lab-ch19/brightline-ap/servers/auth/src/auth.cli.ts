// For the Better Auth CLI only (`npm run generate`). The tables depend on the plugins, not on the
// secrets, so placeholder values are enough. The CLI compares the plugins' tables with a database
// and writes the SQL for what is missing:
//   - with no AUTH_CLI_DB, an empty in-memory SQLite database: every CREATE TABLE (migration 0001)
//   - with AUTH_CLI_DB=<file>, a SQLite file with the earlier migrations applied: only the changes
// `npm run generate:next` builds that file from migrations/ first. Never imported by the Worker.
import { DatabaseSync } from "node:sqlite";
import { createAuth } from "./auth.ts";

export const auth = createAuth({
  DB: new DatabaseSync(process.env.AUTH_CLI_DB ?? ":memory:") as unknown as D1Database,
  BETTER_AUTH_SECRET: "cli-placeholder-not-a-secret-0123456789",
  AUTH_BASE_URL: "http://127.0.0.1:8719",
  MCP_RESOURCE: "http://127.0.0.1:8717/mcp",
});
