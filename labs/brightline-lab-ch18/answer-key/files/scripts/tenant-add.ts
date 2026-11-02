// Add a company, its first owner and its people to the sign-in server (Lab 18, Task 8; 18.14 onboarding).
//
//   npm run tenant:add -- --company org_cedar --name "Cedar Ridge Supply" \
//     --owner "Luis Moreno <luis@cedarridge.example>" \
//     --member "Marco Diaz <marco@cedarridge.example>=member" --member "Priya Shah <priya@books.example>=member"
//
// --env local|staging|production (default local; production also needs --yes-production).
// A company that exists already is kept, and the people are added to it. A new person gets a password
// made here, written to .secrets/test-users.<env>.env and never printed. Prints only names and roles.
import { adminCall, environment, newPassword, parseArgs, parsePerson, passwordVar, signInServer } from "./lib/admin.ts";

const argv = process.argv.slice(2);
const env = environment(argv, new URL(import.meta.url).pathname);
const args = parseArgs(argv);
const base = signInServer(env);
const id = args.one("company");
const name = args.one("name");
if (!id) { console.error('usage: npm run tenant:add -- --company org_x --name "Name" [--owner "Name <email>"] [--member "Name <email>=role"]...'); process.exit(1); }

const company = await adminCall(base, "POST", "/admin/companies", { id, name: name ?? id });
if (company.status === 201) console.log(`created company ${company.body.name} (${id})`);
else if (company.status === 409) console.log(`company ${id} exists: adding people to it`);
else { console.error(`stopped: company ${id}: ${company.status} ${company.body.error ?? ""}`); process.exit(1); }

const people = [
  ...args.all("owner").map((p) => parsePerson(p, "owner")),
  ...args.all("member").map((p) => parsePerson(p)),
];
let failed = 0;
for (const p of people) {
  // First without a new password: the sign-in server adds a person it already has without one. Only
  // when it answers that a new person needs a password is one made and written to the file.
  const known = process.env[passwordVar(p.email)];
  const r = await adminCall(base, "POST", "/admin/members", { company: id, email: p.email, name: p.name, role: p.role, password: known });
  if (r.status === 400 && !known && /password/.test(String(r.body.error))) {
    // A new person: make the password now, write it to the file, and try again.
    const made = newPassword(env, p.email);
    const again = await adminCall(base, "POST", "/admin/members", { company: id, email: p.email, name: p.name, role: p.role, password: made });
    report(p, again);
  } else report(p, r);
}
function report(p: { name: string; role: string }, r: { status: number; body: any }) {
  if (r.status === 201) console.log(`  ${p.name}: ${p.role}${r.body.person === "created" ? " (new person, password in .secrets/test-users." + env + ".env)" : ""}`);
  else if (r.status === 409) console.log(`  ${p.name}: already in ${id}`);
  else { failed++; console.error(`  ${p.name}: refused, ${r.status} ${r.body.error ?? ""}`); }
}
process.exit(failed ? 1 : 0);
