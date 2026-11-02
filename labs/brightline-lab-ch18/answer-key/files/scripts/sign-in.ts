// Sign a test person in through the real pages, as the sign-in matrix does (Lab 18, Task 11), and show
// what came back: the companies offered, and the token's claims. Never a token itself.
//
//   npm run sign-in -- --client <id> --email marco@cedarridge.example --company org_cedar
//   npm run sign-in -- --client <id> --email jordan@brightline.example --company org_brightline \
//       --offline --save-refresh .secrets/jordan-refresh.local
//   npm run sign-in -- --client <id> --refresh-from .secrets/jordan-refresh.local
//
// Passwords come from .secrets/test-users.<env>.env, a refresh token from the --refresh-from file: both
// are given to this script by node --env-file (scripts/lib/admin.ts starts it again), never opened here.
// --connector ts|py picks the connector the token is for (default ts); --resource <address> names any
// other connector address (staging). --redirect <address> plays an app's own return address, such as
// Claude Code's http://localhost:8790/callback (default http://127.0.0.1:43123/callback).
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { environment, parseArgs, passwordVar, signInServer } from "./lib/admin.ts";
import { claimsOf, signIn, token } from "./lib/sign-in.ts";

const argv = process.argv.slice(2);
const args = parseArgs(argv);
const refreshFile = args.one("refresh-from");
// The refresh token file is an input to the command, like a key file: start again with it.
if (refreshFile && !process.env.REFRESH_TOKEN) {
  if (!existsSync(refreshFile)) { console.error(`stopped: ${refreshFile} does not exist`); process.exit(1); }
  const r = spawnSync(process.execPath, [`--env-file=${refreshFile}`, new URL(import.meta.url).pathname, ...argv], { stdio: "inherit" });
  process.exit(r.status ?? 1);
}
const env = environment(argv, new URL(import.meta.url).pathname);
const base = signInServer(env);
const clientId = args.one("client");
const resource = args.one("resource") ?? (args.one("connector") === "py" ? "http://127.0.0.1:8718/mcp" : "http://127.0.0.1:8717/mcp");
const redirectUri = args.one("redirect");
if (!clientId) { console.error("usage: npm run sign-in -- --client <id> (--email … --company … | --refresh-from <file>)"); process.exit(1); }
const showClaims = (jwt: string) => {
  const c = claimsOf(jwt);
  return JSON.stringify({ tenant: c.tenant, scope: c.scope, aud: c.aud, client_id: c.client_id, exp: c.exp });
};

if (refreshFile) {
  const r = await token(base, { grant_type: "refresh_token", refresh_token: process.env.REFRESH_TOKEN!, client_id: clientId, resource });
  console.log(r.status === 200 ? `fresh token: 200 ${showClaims(r.body.access_token)}` : `fresh token refused: ${r.status} ${JSON.stringify({ error: r.body.error, error_description: r.body.error_description })}`);
  process.exit(0);
}
const email = args.one("email"), company = args.one("company");
if (!email || !company) { console.error("--email and --company are needed"); process.exit(1); }
const password = process.env[passwordVar(email)];
if (!password) { console.error(`no password for ${email} in .secrets/test-users.${env}.env`); process.exit(1); }
const scope = args.flag("offline") ? "ap:read ap:vendors.read offline_access" : "ap:read ap:vendors.read";
const r = await signIn(base, { clientId, email, password, company, resource, scope, ...(redirectUri ? { redirectUri } : {}) });
console.log(`picker offered: ${r.choices.length ? r.choices.map(([, n]) => n).join(", ") : "nothing"}`);
if (r.status !== 200 || !r.body.access_token) {
  console.log(`sign-in refused: ${r.stoppedAt ? `at ${r.stoppedAt}, ` : ""}${r.status} ${r.body.error ?? ""}`);
  process.exit(0);
}
console.log(`token: ${showClaims(r.body.access_token)}; refresh token: ${r.body.refresh_token ? "present" : "absent"}`);
const save = args.one("save-refresh");
if (save && r.body.refresh_token) {
  execFileSync("git", ["check-ignore", "-q", save]); // throws if git would track it
  writeFileSync(save, `REFRESH_TOKEN=${r.body.refresh_token}\n`, { mode: 0o600 });
  console.log(`refresh token saved to ${save} (not printed)`);
}
