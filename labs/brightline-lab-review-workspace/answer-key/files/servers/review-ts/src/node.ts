// Local Node entry for the review workspace connector (Lab 20b), for tests and the workspace matrix.
// Usage, from servers/review-ts: npm start  (port 8757; the Python copy is on 8758).
// Settings: REVIEW_ISSUER, REVIEW_RESOURCE, DATABASE_URL_REVIEW_WRITER, REVIEW_AS_OF (YYYY-MM-DD),
// and optionally AP_TRUST_TEST_ISSUER=1 with AP_TEST_SIGNING_KEY, as for the AP connector.
import { createServer } from "node:http";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createConnector } from "./http.ts";
import { poolConnect, reviewDatabase } from "./db.ts";
import { DEFAULT_LIMITS, memoryLimits } from "../../ap-ts/src/rate-limit.ts";

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.argv[2] ?? 8757);
  const env = process.env;
  if (!env.DATABASE_URL_REVIEW_WRITER) {
    console.error("DATABASE_URL_REVIEW_WRITER is not set. Run npm run db:migrate, then npm run db:passwords.");
    process.exit(1);
  }
  const issuer = env.REVIEW_ISSUER ?? env.AP_ISSUER ?? "";
  const connector = createConnector({
    db: reviewDatabase(poolConnect(env.DATABASE_URL_REVIEW_WRITER).connect),
    issuer,
    resource: env.REVIEW_RESOURCE ?? `http://127.0.0.1:${port}/mcp`,
    keys: { jwksUrl: `${issuer}/jwks`, testSigningKey: env.AP_TRUST_TEST_ISSUER === "1" ? env.AP_TEST_SIGNING_KEY : undefined },
    asOf: env.REVIEW_AS_OF,
    limits: memoryLimits(Number(env.AP_RATE_LIMIT_COMPANY ?? DEFAULT_LIMITS.company), Number(env.AP_RATE_LIMIT_PERSON ?? DEFAULT_LIMITS.person)),
  });
  createServer(toNodeHandler(connector)).listen(port, "127.0.0.1", () => console.log(`brightline-review (TypeScript) at http://127.0.0.1:${port}/mcp`));
}
