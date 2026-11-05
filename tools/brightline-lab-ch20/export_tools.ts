// Write Lab 20's tools/ap-tools.json from our connector's own tools/list (Lab 19's end state).
//
//   cp export_tools.ts <brightline-ap>/scripts/_export_tools.ts
//   (cd <brightline-ap> && node scripts/_export_tools.ts [--raw] > tools/ap-tools.json); rm <brightline-ap>/scripts/_export_tools.ts
//
// It starts the connector in this process, with a test token and no database (tools/list never reads
// one), and lists the tools with the client the loop uses (@modelcontextprotocol/sdk), so the run also
// shows that the loop's client and our connector agree on the protocol.
// Each input schema is then written in the strict form both model APIs accept with strict: true: every
// property required, an optional one as [type, "null"], additionalProperties false, and only the
// keywords both APIs' strict modes support (type, description, pattern). The bounds the connector
// checks (lengths, 1 to 10) stay in its descriptions, word for word, and the connector still checks them.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createConnector } from "../servers/ap-ts/src/http.ts";
import { testEmbedder } from "../servers/ap-ts/src/embeddings.ts";
import { fakeJwks, ISSUER, JWKS_URL, RESOURCE, sign } from "../servers/ap-ts/test/tokens.ts";

const keys = fakeJwks();
const noDatabase = { forTenant: async () => { throw new Error("tools/list reads no database"); } };
const copy = createConnector({
  db: noDatabase as never, embedder: testEmbedder(), handleKey: "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8",
  issuer: ISSUER, resource: RESOURCE, keys: { jwksUrl: JWKS_URL, fetch: keys.fetch }, log: () => {},
});
const token = await sign();
const client = new Client({ name: "export-tools", version: "1.0.0" });
await client.connect(new StreamableHTTPClientTransport(new URL(RESOURCE), {
  requestInit: { headers: { Authorization: `Bearer ${token}` } },
  fetch: (url, init) => copy.fetch(new Request(url, init)),
}));
const { tools } = await client.listTools();
await client.close();

if (process.argv.includes("--raw")) {
  console.log(JSON.stringify({ protocolVersion: (client as any)._transport?.protocolVersion ?? null, tools }, null, 2));
  process.exit(0);
}

type Schema = { type?: string | string[]; description?: string; pattern?: string; [k: string]: unknown };
const KEEP = new Set(["type", "description", "pattern"]);
function strictProperty(s: Schema, optional: boolean): Schema {
  const out: Schema = {};
  for (const [k, v] of Object.entries(s)) {
    if (KEEP.has(k)) out[k] = v;
    else if (!["minLength", "maxLength", "minimum", "maximum", "default", "exclusiveMinimum", "exclusiveMaximum"].includes(k))
      throw new Error(`unexpected keyword ${k}: decide how to write it strictly`);
  }
  if (typeof out.type !== "string") throw new Error(`a property without one type: ${JSON.stringify(s)}`);
  if (optional) out.type = [out.type, "null"];
  // description last, as people read a schema: type, then what it means
  const { description, ...rest } = out;
  return { ...rest, ...(description ? { description } : {}) };
}
const strict = tools.map((t) => {
  const schema = t.inputSchema as { properties?: Record<string, Schema>; required?: string[] };
  const props = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const properties = Object.fromEntries(Object.entries(props).map(([k, v]) => [k, strictProperty(v, !required.has(k))]));
  return {
    name: t.name,
    description: t.description,
    input_schema: { type: "object", properties, required: Object.keys(properties), additionalProperties: false },
  };
});
console.log(JSON.stringify(strict, null, 2));
