// Local Node entry, for tests, the conformance suite and CI. Same front door, same server, reaching
// the business database through a small pool as the reader role (DATABASE_URL_READER, never printed).
// Usage, from servers/ap-ts: npm start  (keys from `npm run keys`, the database from `npm run db:passwords`).
// Settings: AP_HANDLE_KEY, AP_ISSUER, AP_RESOURCE, DATABASE_URL_READER, AP_EMBEDDINGS (test or workers-ai),
// and optionally AP_TRUST_TEST_ISSUER=1 with AP_TEST_SIGNING_KEY.
import { createServer } from "node:http";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createConnector } from "./http.ts";
import { apDatabase, poolConnect } from "./db.ts";
import { embedderFromEnv } from "./embeddings.ts";
import { DEFAULT_LIMITS, memoryLimits } from "./rate-limit.ts";

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.argv[2] ?? 8717);
  const env = process.env;
  const issuer = env.AP_ISSUER ?? "";
  if (!env.DATABASE_URL_READER) {
    console.error("DATABASE_URL_READER is not set. Run npm run db:passwords (field guide F2).");
    process.exit(1);
  }
  const pool = poolConnect(env.DATABASE_URL_READER);
  const connector = createConnector({
    db: apDatabase(pool.connect),
    embedder: embedderFromEnv(env),
    handleKey: env.AP_HANDLE_KEY ?? "",
    issuer,
    resource: env.AP_RESOURCE ?? "",
    // On your computer the public keys come straight from the sign-in server (the service binding is
    // only for staging and production). With AP_TRUST_TEST_ISSUER=1 the test key is trusted as well.
    keys: { jwksUrl: `${issuer}/jwks`, testSigningKey: env.AP_TRUST_TEST_ISSUER === "1" ? env.AP_TEST_SIGNING_KEY : undefined },
    handleKeyPrevious: env.AP_HANDLE_KEY_PREVIOUS || undefined,
    // Rule 5 on your computer: counted in this copy only. AP_RATE_LIMIT_COMPANY and AP_RATE_LIMIT_PERSON
    // (calls a minute) change the limits, as the sign-in matrix does for its 200 calls at once.
    limits: memoryLimits(Number(env.AP_RATE_LIMIT_COMPANY ?? DEFAULT_LIMITS.company), Number(env.AP_RATE_LIMIT_PERSON ?? DEFAULT_LIMITS.person)),
  });
  createServer(toNodeHandler(connector)).listen(port, "127.0.0.1", () => console.log(`brightline-ap (TypeScript) at http://127.0.0.1:${port}/mcp`));
}
