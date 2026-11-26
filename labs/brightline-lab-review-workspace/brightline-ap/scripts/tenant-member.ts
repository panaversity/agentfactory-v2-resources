// Change a person's role in a company, or remove them from it (Lab 18, Task 11; 18.14 "changes").
//
//   npm run tenant:member -- --company org_cedar --email marco@cedarridge.example --role auditor
//   npm run tenant:member -- --company org_brightline --email jordan@brightline.example --remove
//
// --env local|staging|production (default local; production also needs --yes-production).
// Both also delete the person's consent records and refresh tokens for that company, so their next
// fresh token is refused and their next sign-in asks again. Their current access token works until it
// runs out (10 minutes at most).
import { adminCall, environment, parseArgs, signInServer } from "./lib/admin.ts";

const argv = process.argv.slice(2);
const env = environment(argv, new URL(import.meta.url).pathname);
const args = parseArgs(argv);
const company = args.one("company"), email = args.one("email"), role = args.one("role");
if (!company || !email || (!role && !args.flag("remove")) || (role && args.flag("remove"))) {
  console.error("usage: npm run tenant:member -- --company org_x --email person@example --role auditor|member|admin|owner, or --remove");
  process.exit(1);
}
const r = role
  ? await adminCall(signInServer(env), "PATCH", "/admin/members", { company, email, role })
  : await adminCall(signInServer(env), "DELETE", "/admin/members", { company, email });
if (r.status !== 200) { console.error(`stopped: ${r.status} ${r.body.error ?? ""}`); process.exit(1); }
const d = r.body.deleted ?? {};
console.log(role ? `${email} in ${company}: ${r.body.from} -> ${r.body.to}` : `${email} removed from ${company}`);
console.log(`deleted: ${d.consents ?? 0} consent records, ${d.refreshTokens ?? 0} refresh tokens`);
