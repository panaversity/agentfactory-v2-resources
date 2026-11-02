// Local Node entry, for tests, the conformance suite and CI. Same front door, same server,
// reading the repository's files from disk instead of Worker assets.
// Usage, from servers/ap-ts: node --env-file=.dev.vars src/node.ts [port]   (keys from `npm run keys`)
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createConnector } from "./http.ts";
import { POLICY_FILES } from "./data.ts";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const allowed = new Set(["data/vendors.csv", "data/vendor-notes.csv", "data/vendor-banking.csv", "data/invoices.csv", "data/purchase-orders.csv", ...POLICY_FILES]);

export const fileData = {
  async read(path: string) {
    if (!allowed.has(path)) throw new Error(`${path} is not a file this connector may read`);
    return readFile(repoRoot + path, "utf8");
  },
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.argv[2] ?? 8717);
  const connector = createConnector({ data: fileData, token: process.env.AP_MCP_TOKEN ?? "", handleKey: process.env.AP_HANDLE_KEY ?? "" });
  createServer(toNodeHandler(connector)).listen(port, "127.0.0.1", () => console.log(`brightline-ap (TypeScript) at http://127.0.0.1:${port}/mcp`));
}
