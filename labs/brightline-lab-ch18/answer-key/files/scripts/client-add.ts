// Pre-register a public app (no secret) with the sign-in server (Lab 18, Task 8).
//
//   npm run client:add -- --name "Claude Code" --redirect http://127.0.0.1/callback [--env local] [--client-id <id>]
//
// --redirect may be given more than once. --client-id chooses the ID (8 to 64 letters, digits, dots,
// dashes or underscores), so the same app has the same ID in every environment and in the repository's
// .mcp.json, .codex/config.toml and opencode.jsonc. Without it, the sign-in server makes one up.
//
// Prints only the client ID and the connectors it may get tokens for. A public app has no secret.
import { adminCall, environment, parseArgs, signInServer } from "./lib/admin.ts";

const argv = process.argv.slice(2);
const env = environment(argv, new URL(import.meta.url).pathname);
const args = parseArgs(argv);
const name = args.one("name");
const redirects = args.all("redirect");
if (!name || !redirects.length) { console.error('usage: npm run client:add -- --name "App" --redirect http://127.0.0.1/callback [--env local]'); process.exit(1); }
const clientId = args.one("client-id");
const r = await adminCall(signInServer(env), "POST", "/admin/clients", { client_name: name, redirect_uris: redirects, ...(clientId ? { client_id: clientId } : {}) });
if (r.status !== 201) { console.error(`stopped: ${r.status} ${r.body.error ?? ""}`); process.exit(1); }
console.log(`client ID: ${r.body.client_id}`);
console.log(`connectors: ${(r.body.resources ?? [r.body.resource]).join(", ")}`);
