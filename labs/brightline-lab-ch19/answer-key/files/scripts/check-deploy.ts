// The deploy settings check (Lab 18, Task 18; field guide F8), run by `npm run check:deploy` before the
// dry runs, by CI on every pull request, and by every deploy script with --ready <env>.
//
//   node scripts/check-deploy.ts                  check both environments; list what is still a placeholder
//   node scripts/check-deploy.ts --ready staging  also refuse if staging still holds a placeholder
//
// It reads servers/auth/wrangler.jsonc, servers/ap-ts/wrangler.jsonc and servers/ap-py/wrangler.jsonc and fails if:
//   - AP_TRUST_TEST_ISSUER or AP_TEST_SIGNING_KEY appears anywhere in them (the test key is never deployed);
//   - an environment's sign-in server and connector do not name each other: the connector's AP_ISSUER must
//     be that environment's AUTH_BASE_URL + /api/auth, its AP_RESOURCE the sign-in server's MCP_RESOURCE,
//     and its AUTH service binding that environment's sign-in Worker;
//   - an address is not https, or a connector address does not end in /mcp;
//   - an environment's database is not its own (brightline-auth-staging, brightline-auth).
//   - Chapter 19: the connector has no HYPERDRIVE or AI binding, no nodejs_compat, ships data as assets, or
//     staging and production share one Hyperdrive configuration (each environment its own database).
// Settings only: it reads no secret file.
import { readFileSync } from "node:fs";

/** JSON with comments, as wrangler reads it: strip // and /* *\/ comments outside strings, and trailing commas. */
export function parseJsonc(text: string): any {
  let out = "", inString = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inString) { out += c; if (c === "\\") { out += n; i++; } else if (c === '"') inString = false; continue; }
    if (c === '"') { inString = true; out += c; continue; }
    if (c === "/" && n === "/") { while (i < text.length && text[i] !== "\n") i++; out += "\n"; continue; }
    if (c === "/" && n === "*") { i += 2; while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++; i++; continue; }
    out += c;
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
}

// Paths from the repository's top folder, wherever the command runs (the deploy scripts run in their workspace).
const read = (path: string) => {
  const text = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  return { path, text, json: parseJsonc(text) };
};
const auth = read("servers/auth/wrangler.jsonc");
const ts = read("servers/ap-ts/wrangler.jsonc");
const py = read("servers/ap-py/wrangler.jsonc");

const problems: string[] = [];
let passed = 0;
const check = (ok: boolean, what: string) => (ok ? passed++ : problems.push(what));
const PLACEHOLDER = /your-subdomain|REPLACE-WITH|<made by/;

// 1. The test key and its switch are never in a deploy setting, in any environment.
for (const f of [auth, ts, py]) {
  check(!/AP_TRUST_TEST_ISSUER|AP_TEST_SIGNING_KEY/.test(JSON.stringify(f.json)), `${f.path}: AP_TRUST_TEST_ISSUER or AP_TEST_SIGNING_KEY is set (never deployed, F8)`);
}

// 2. Each environment: the sign-in server and the connector name each other.
const envs = {
  staging: { auth: auth.json.env?.staging, ts: ts.json.env?.staging, authWorker: "brightline-auth-staging", database: "brightline-auth-staging" },
  production: { auth: auth.json.env?.production, ts: ts.json, authWorker: "brightline-auth", database: "brightline-auth" },
};
const placeholders: Record<string, string[]> = { staging: [], production: [] };
const https = (u: unknown) => typeof u === "string" && u.startsWith("https://");
for (const [name, e] of Object.entries(envs)) {
  if (!e.auth) { problems.push(`servers/auth/wrangler.jsonc: no env.${name}`); continue; }
  const a = e.auth.vars ?? {}, t = e.ts.vars ?? {};
  check((e.auth.name ?? `brightline-auth-${name}`) === e.authWorker, `${name}: the sign-in Worker must be named ${e.authWorker}`);
  const db = (e.auth.d1_databases ?? []).find((d: any) => d.binding === "DB");
  check(db?.database_name === e.database, `${name}: the sign-in server's DB must be ${e.database}`);
  check(https(a.AUTH_BASE_URL), `${name}: AUTH_BASE_URL must be https`);
  check(https(a.MCP_RESOURCE) && a.MCP_RESOURCE.endsWith("/mcp"), `${name}: MCP_RESOURCE must be https and end in /mcp`);
  check(t.AP_ISSUER === `${a.AUTH_BASE_URL}/api/auth`, `${name}: the connector's AP_ISSUER (${t.AP_ISSUER}) must be the sign-in server's issuer (${a.AUTH_BASE_URL}/api/auth)`);
  check(t.AP_RESOURCE === a.MCP_RESOURCE, `${name}: the connector's AP_RESOURCE (${t.AP_RESOURCE}) must be the sign-in server's MCP_RESOURCE (${a.MCP_RESOURCE})`);
  const binding = (e.ts.services ?? []).find((s: any) => s.binding === "AUTH");
  check(binding?.service === e.authWorker, `${name}: the connector's AUTH service binding must point at ${e.authWorker}`);
  // Chapter 19: the business database through Hyperdrive, embeddings through Workers AI, no data assets.
  const hd = (e.ts.hyperdrive ?? []).find((h: any) => h.binding === "HYPERDRIVE");
  check(Boolean(hd?.id), `${name}: the connector needs a HYPERDRIVE binding (F3)`);
  check(e.ts.ai?.binding === "AI", `${name}: the connector needs the AI binding (F4)`);
  check(!e.ts.assets, `${name}: the connector must not ship data as assets (Chapter 19)`);
  check((ts.json.compatibility_flags ?? []).includes("nodejs_compat"), "the connector needs the nodejs_compat flag for pg");
  for (const [k, v] of Object.entries({ ...a, ...t, database_id: db?.database_id ?? "", hyperdrive_id: hd?.id ?? "" })) {
    if (PLACEHOLDER.test(String(v))) placeholders[name].push(k);
  }
}

const ready = process.argv.includes("--ready") ? process.argv[process.argv.indexOf("--ready") + 1] : undefined;
if (ready && !(ready in placeholders)) problems.push(`--ready takes staging or production, not ${ready}`);
if (ready && placeholders[ready]?.length) {
  problems.push(`${ready} still holds placeholders, so it cannot be deployed: ${placeholders[ready].join(", ")}. Fill in your workers.dev subdomain, the database_id from \`npx wrangler d1 create\` (Chapter 18, F8) and the Hyperdrive id from \`npx wrangler hyperdrive create\` (F6).`);
}
for (const [name, list] of Object.entries(placeholders)) {
  if (list.length && name !== ready) console.log(`check:deploy: ${name} placeholders to fill before deploying: ${[...new Set(list)].join(", ")}`);
}
if (problems.length) {
  console.error(problems.map((p) => `check:deploy: ${p}`).join("\n"));
  console.error(`check:deploy: ${passed} passed, ${problems.length} failed`);
  process.exit(1);
}
const ids = [ts.json.hyperdrive?.[0]?.id, ts.json.env?.staging?.hyperdrive?.[0]?.id];
if (ids.every((id) => id && !PLACEHOLDER.test(id))) check(ids[0] !== ids[1], "staging and production must each have their own Hyperdrive configuration");
if (problems.length) {
  console.error(problems.map((p) => `check:deploy: ${p}`).join("\n"));
  process.exit(1);
}
console.log(`check:deploy: ${passed} settings checks passed, 0 failed`);
