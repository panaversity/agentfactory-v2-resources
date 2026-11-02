// Test helpers: run the connector in-process, with no network and no ports.
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createConnector } from "../src/http.ts";
import { fileData } from "../src/node.ts";

export const TOKEN = "test-token-0123456789abcdef";
export const OTHER_TOKEN = "other-token-0123456789abcdef";
export const HANDLE_KEY = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8"; // 32 test bytes, never used outside tests

export function makeCopy(clock: { now: number } = { now: Date.parse("2026-11-09T14:00:00Z") }) {
  return createConnector({ data: fileData, token: TOKEN, handleKey: HANDLE_KEY, now: () => clock.now });
}

/** A client pinned to revision 2026-07-28, talking to one in-process copy of the server. */
export async function connect(copy: ReturnType<typeof makeCopy>, token = TOKEN) {
  const client = new Client({ name: "brightline-tests", version: "1.0.0" }, { versionNegotiation: { mode: { pin: "2026-07-28" } } });
  const transport = new StreamableHTTPClientTransport(new URL("http://127.0.0.1/mcp"), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
    fetch: (url, init) => copy.fetch(new Request(url, init)),
  });
  await client.connect(transport);
  return client;
}

export type Structured = Record<string, any>;
export const textOf = (r: { content?: unknown }) => (r.content as { text: string }[])[0].text;
