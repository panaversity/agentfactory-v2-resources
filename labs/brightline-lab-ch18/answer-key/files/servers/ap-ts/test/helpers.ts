// Test helpers: run the connector in-process, with no network and no ports.
// Chapter 18: requests carry test tokens (test/tokens.ts) instead of the Chapter 17 shared key, and
// the connector reads the sign-in server's public keys from a fake JWKS, in process.
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createConnector, type ConnectorConfig } from "../src/http.ts";
import { fileData } from "../src/node.ts";
import { fakeJwks, ISSUER, JWKS_URL, RESOURCE, sign } from "./tokens.ts";

export const HANDLE_KEY = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8"; // 32 test bytes, never used outside tests
/** Ana at Brightline, with both scopes. */
export const TOKEN = await sign();
/** Another person, Priya, at Brightline: a different caller for page handles. */
export const OTHER_TOKEN = await sign({ sub: "u_test_priya" });

const keys = fakeJwks();

export function makeCopy(
  clock: { now: number } = { now: Date.parse("2026-11-09T14:00:00Z") },
  extra: Partial<ConnectorConfig> = {},
) {
  return createConnector({
    data: fileData, handleKey: HANDLE_KEY, now: () => clock.now,
    issuer: ISSUER, resource: RESOURCE, keys: { jwksUrl: JWKS_URL, fetch: keys.fetch },
    ...extra,
  });
}

/** A client pinned to revision 2026-07-28, talking to one in-process copy of the server. */
export async function connect(copy: ReturnType<typeof makeCopy>, token = TOKEN, headers: Record<string, string> = {}) {
  const client = new Client({ name: "brightline-tests", version: "1.0.0" }, { versionNegotiation: { mode: { pin: "2026-07-28" } } });
  const transport = new StreamableHTTPClientTransport(new URL("http://127.0.0.1/mcp"), {
    requestInit: { headers: { Authorization: `Bearer ${token}`, ...headers } },
    fetch: (url, init) => copy.fetch(new Request(url, init)),
  });
  await client.connect(transport);
  return client;
}

export type Structured = Record<string, any>;
export const textOf = (r: { content?: unknown }) => (r.content as { text: string }[])[0].text;
