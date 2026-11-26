// Offboard a company (Lab 18, Task 11; 18.14 "offboarding"): stop new tokens for it, and delete its
// consent records and refresh tokens. Its people's current access tokens run out within 10 minutes.
// Its business data is not touched (Chapter 19).
//
//   npm run tenant:remove -- --company org_juniper [--env local]
import { adminCall, environment, parseArgs, signInServer } from "./lib/admin.ts";

const argv = process.argv.slice(2);
const env = environment(argv, new URL(import.meta.url).pathname);
const company = parseArgs(argv).one("company");
if (!company) { console.error("usage: npm run tenant:remove -- --company org_x [--env local]"); process.exit(1); }
const r = await adminCall(signInServer(env), "POST", `/admin/companies/${encodeURIComponent(company)}/stop-tokens`);
if (r.status !== 200) { console.error(`stopped: ${r.status} ${r.body.error ?? ""}`); process.exit(1); }
console.log(`${company}: no new tokens from now on`);
console.log(`deleted: ${r.body.deleted?.consents ?? 0} consent records, ${r.body.deleted?.refreshTokens ?? 0} refresh tokens`);
console.log("wait 10 minutes for the last access tokens to run out");
