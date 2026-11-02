// The practice sign-in for Lab 18, Task 1: `npm run hello-auth` from the repository's top folder.
// Starts the practice sign-in server on 127.0.0.1:8739 and the practice connector on 127.0.0.1:8736,
// both on this computer only. Ctrl+C stops both, and the in-memory database is gone.
import { createServer, type Server } from "node:http";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createSignInServer, BASE, RESOURCE, SIGN_IN_PORT, CONNECTOR_PORT } from "./sign-in.ts";
import { createConnector } from "./connector.ts";

export async function start(): Promise<{ stop: () => Promise<void> }> {
  const signIn = await createSignInServer();
  const listen = (handler: { fetch(r: Request): Promise<Response> }, port: number) =>
    new Promise<Server>((resolve, reject) => {
      const s = createServer(toNodeHandler(handler));
      s.once("error", reject);
      s.listen(port, "127.0.0.1", () => resolve(s));
    });
  const servers = [await listen(signIn, SIGN_IN_PORT), await listen(createConnector(), CONNECTOR_PORT)];
  return { stop: async () => { await Promise.all(servers.map((s) => new Promise((r) => s.close(r)))); } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await start();
  console.log(`practice sign-in server: ${BASE} (issuer ${BASE}/api/auth)`);
  console.log(`practice connector:      ${RESOURCE}`);
  console.log("sign in as hello@example.test with the practice password from LAB.md, Task 1");
}
