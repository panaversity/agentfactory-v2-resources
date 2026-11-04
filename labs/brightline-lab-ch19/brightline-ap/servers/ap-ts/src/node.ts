// Local Node entry, for tests, the conformance suite and CI. Same front door, same server,
// reading the repository's files from disk instead of Worker assets.
// Usage, from servers/ap-ts: npm start  (node --env-file=.dev.vars src/node.ts [port]; keys from `npm run keys`).
// Settings: AP_HANDLE_KEY, AP_ISSUER, AP_RESOURCE, and optionally AP_TRUST_TEST_ISSUER=1 with AP_TEST_SIGNING_KEY.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createConnector } from "./http.ts";
import { POLICY_FILES } from "./data.ts";
import { DEFAULT_LIMITS, memoryLimits } from "./rate-limit.ts";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const DATA_FILES = ["vendors.csv", "vendor-notes.csv", "vendor-banking.csv", "invoices.csv", "purchase-orders.csv"];
// Each company's data folder (AP_DATA_TENANTS) and the shared policies. Nothing else is ever read.
const allowed = new Set([...["data", "data-conformance"].flatMap((d) => DATA_FILES.map((f) => `${d}/${f}`)), ...POLICY_FILES]);

export const fileData = {
  async read(path: string) {
    if (!allowed.has(path)) throw new Error(`${path} is not a file this connector may read`);
    return readFile(repoRoot + path, "utf8");
  },
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.argv[2] ?? 8717);
  const env = process.env;
  const issuer = env.AP_ISSUER ?? "";
  const connector = createConnector({
    data: fileData,
    handleKey: env.AP_HANDLE_KEY ?? "",
    issuer,
    resource: env.AP_RESOURCE ?? "",
    // On your computer the public keys come straight from the sign-in server (the service binding is
    // only for staging and production). With AP_TRUST_TEST_ISSUER=1 the test key is trusted as well.
    keys: { jwksUrl: `${issuer}/jwks`, testSigningKey: env.AP_TRUST_TEST_ISSUER === "1" ? env.AP_TEST_SIGNING_KEY : undefined },
    dataTenants: env.AP_DATA_TENANTS, // unset: the chapter's mapping
    handleKeyPrevious: env.AP_HANDLE_KEY_PREVIOUS || undefined,
    // Rule 5 on your computer: counted in this copy only. AP_RATE_LIMIT_COMPANY and AP_RATE_LIMIT_PERSON
    // (calls a minute) change the limits, as the sign-in matrix does for its 200 calls at once.
    limits: memoryLimits(Number(env.AP_RATE_LIMIT_COMPANY ?? DEFAULT_LIMITS.company), Number(env.AP_RATE_LIMIT_PERSON ?? DEFAULT_LIMITS.person)),
  });
  createServer(toNodeHandler(connector)).listen(port, "127.0.0.1", () => console.log(`brightline-ap (TypeScript) at http://127.0.0.1:${port}/mcp`));
}
