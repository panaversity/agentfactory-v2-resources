// Create the CI client for one environment (Lab 18, Task 18 for staging and Task 19 for production; F8).
//
//   npm run client:ci -- --env staging
//   npm run client:ci -- --env production --yes-production
//
// The CI client gets tokens with no person, by OAuth's client credentials grant, with the scopes the
// platform operator assigns here (ap:read, ap:vendors.read). It belongs to Conformance Test Co.: its
// company is written into the client's metadata as {"tenant": "org_conformance"}, because for a token
// with no person the sign-in server's claims function sees only that metadata (F8). So its tokens can
// only ever say org_conformance, never Brightline or Cedar Ridge. Its token requests must always send
// `resource`, or the answer is not a JWT (the conformance suite always sends it).
//
// The client's secret is written, never printed, to two files git ignores:
//   .secrets/github.env      CONFORMANCE_CLIENT_ID_<ENV> and CONFORMANCE_CLIENT_SECRET_<ENV>, for
//                            `gh secret set -f .secrets/github.env`. Other environments' lines are kept.
//   .secrets/ci.<env>.env    CONFORMANCE_CLIENT_ID and CONFORMANCE_CLIENT_SECRET, which
//                            `npm run conformance:<env>` passes to the suite with --env-file.
// Run it again to replace an environment's CI client (the old one keeps working until removed).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { adminCall, environment, signInServer } from "./lib/admin.ts";

const argv = process.argv.slice(2);
const env = environment(argv, new URL(import.meta.url).pathname);
const r = await adminCall(signInServer(env), "POST", "/admin/clients", {
  client_name: `Conformance CI (${env})`,
  grant_types: ["client_credentials"],
  client_credentials_scopes: ["ap:read", "ap:vendors.read"],
  tenant: "org_conformance",
});
if (r.status !== 201 || !r.body.client_secret) {
  console.error(`stopped: ${r.status} ${r.body.error ?? ""}${r.status === 400 ? " (add Conformance Test Co. first: npm run tenant:add -- --company org_conformance --name \"Conformance Test Co.\")" : ""}`);
  process.exit(1);
}

mkdirSync(".secrets", { recursive: true });
for (const f of [".secrets/github.env", `.secrets/ci.${env}.env`]) execFileSync("git", ["check-ignore", "-q", f]); // throws if git would track it
const ENV = env.toUpperCase();
const kept = existsSync(".secrets/github.env")
  ? readFileSync(".secrets/github.env", "utf8").split("\n").filter((l) => l && !l.startsWith(`CONFORMANCE_CLIENT_ID_${ENV}=`) && !l.startsWith(`CONFORMANCE_CLIENT_SECRET_${ENV}=`))
  : [];
writeFileSync(".secrets/github.env", [...kept, `CONFORMANCE_CLIENT_ID_${ENV}=${r.body.client_id}`, `CONFORMANCE_CLIENT_SECRET_${ENV}=${r.body.client_secret}`].join("\n") + "\n", { mode: 0o600 });
writeFileSync(`.secrets/ci.${env}.env`, `CONFORMANCE_CLIENT_ID=${r.body.client_id}\nCONFORMANCE_CLIENT_SECRET=${r.body.client_secret}\n`, { mode: 0o600 });
console.log(`CI client for ${env}: ${r.body.client_id} (company org_conformance, scopes ap:read ap:vendors.read)`);
console.log(`its secret: written to .secrets/github.env (CONFORMANCE_CLIENT_SECRET_${ENV}) and .secrets/ci.${env}.env, not printed`);
