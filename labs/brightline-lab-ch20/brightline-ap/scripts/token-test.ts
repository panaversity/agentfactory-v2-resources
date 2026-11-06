// npm run token:test -- --person ana --company org_brightline [--connector ts|py] [--out .secrets/connector.env]
//
// Lab 20, route A: a sign-in token for one test person at one company, for your Chapter 19 staging
// connector, made the way Chapter 18 makes one on staging. The test signing key is never deployed
// (Chapter 18, F8), so the person signs in through the staging sign-in server's real pages, as the
// sign-in matrix does (scripts/lib/sign-in.ts), with the password from .secrets/test-users.staging.env.
//
// It writes CONNECTOR_URL (the connector's staging address, from CONFORMANCE_URLS in
// .secrets/staging.urls.env) and CONNECTOR_TOKEN into the --out file, which git must ignore, and
// prints only the token's claims. A token lasts 10 minutes, the sign-in server's setting (Chapter 18):
// when the loop gets a 401, run this again. `npm run token:test` passes --env staging itself.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { adminCall, environment, parseArgs, passwordVar, signInServer } from "./lib/admin.ts";
import { claimsOf, signIn } from "./lib/sign-in.ts";

const PEOPLE: Record<string, string> = {
  ana: "ana@brightline.example",
  grace: "grace@audit.example",
  luis: "luis@cedarridge.example",
  priya: "priya@books.example",
};
const KNOWN = new Set(["env", "person", "company", "connector", "out"]);

const argv = process.argv.slice(2);
const args = parseArgs(argv);
for (const a of argv) {
  if (a.startsWith("--") && !KNOWN.has(a.slice(2))) {
    console.error(`stopped: unknown option ${a}. Options: --person, --company, --connector ts|py, --out.`);
    process.exit(1);
  }
}
if (args.one("env") === "production") {
  console.error("stopped: token:test makes test tokens for staging (or local), never production.");
  process.exit(1);
}
const env = environment(argv, new URL(import.meta.url).pathname);
const person = args.one("person") ?? "ana";
const email = PEOPLE[person];
const company = args.one("company") ?? "org_brightline";
const lang = args.one("connector") ?? "ts";
const out = args.one("out") ?? ".secrets/connector.env";
if (!email) {
  console.error(`stopped: no test person ${person}. Choose one of: ${Object.keys(PEOPLE).join(", ")}.`);
  process.exit(1);
}
const password = process.env[passwordVar(email)];
if (!password) {
  console.error(`stopped: no password for ${email} in .secrets/test-users.${env}.env (Lab 18 made the test people).`);
  process.exit(1);
}
const urls = Object.fromEntries((process.env.CONFORMANCE_URLS ?? "").split(",").filter(Boolean).map((pair) => pair.split("=")));
const resource = env === "local" ? (lang === "py" ? "http://127.0.0.1:8718/mcp" : "http://127.0.0.1:8717/mcp") : urls[lang];
if (!resource) {
  console.error(`stopped: no ${lang} connector address in CONFORMANCE_URLS in .secrets/${env}.urls.env (Lab 19's docs/deploy.md).`);
  process.exit(1);
}

// Git must ignore the file before a token goes into it (git check-ignore exits non-zero otherwise).
try {
  execFileSync("git", ["check-ignore", "-q", out]);
} catch {
  console.error(`stopped: git does not ignore ${out}. Write the token only under .secrets/.`);
  process.exit(1);
}

const base = signInServer(env);
const app = await adminCall(base, "POST", "/admin/clients", {
  client_name: `Lab 20 token:test ${new Date().toISOString()}`,
  redirect_uris: ["http://127.0.0.1/callback"],
});
if (app.status !== 201) {
  console.error(`stopped: the sign-in server did not register the app: ${app.status} ${app.body.error ?? ""}`);
  process.exit(1);
}
const r = await signIn(base, { clientId: app.body.client_id, email, password, company, resource, scope: "ap:read ap:vendors.read" });
if (r.status !== 200 || !r.body.access_token) {
  console.error(`stopped: ${email} could not sign in for ${company}: ${r.stoppedAt ? `at ${r.stoppedAt}, ` : ""}${r.status} ${r.body.error ?? ""}`);
  process.exit(1);
}
writeFileSync(out, `CONNECTOR_URL=${resource}\nCONNECTOR_TOKEN=${r.body.access_token}\n`, { mode: 0o600 });
const c = claimsOf(r.body.access_token);
console.log(`token for ${email} at ${company}: ${JSON.stringify({ tenant: c.tenant, scope: c.scope, aud: c.aud, exp: c.exp })}`);
console.log(`CONNECTOR_URL and CONNECTOR_TOKEN written to ${out} (the token is not printed). It lasts 10 minutes.`);
