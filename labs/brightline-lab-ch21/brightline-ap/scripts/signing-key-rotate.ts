// Replace the sign-in server's signing key (docs/deploy.md).
//
//   npm run signing-key:rotate -- --env staging --reason scheduled
//   npm run signing-key:rotate -- --env production --yes-production --reason leaked
//
// scheduled: the old key stops signing now and stays published for a day, so tokens it sealed keep
//            working for the 10 minutes they live. Nobody notices.
// leaked:    the old key is deleted from the published set at once. Every token it sealed is refused as
//            soon as each connector fetches the keys again; redeploy the connectors to make that now.
// Prints only the counts and the new key's id (a key id is not a secret).
import { adminCall, environment, parseArgs, signInServer } from "./lib/admin.ts";

const argv = process.argv.slice(2);
const env = environment(argv, new URL(import.meta.url).pathname);
const reason = parseArgs(argv).one("reason");
if (reason !== "scheduled" && reason !== "leaked") { console.error("usage: npm run signing-key:rotate -- --env <env> --reason scheduled|leaked"); process.exit(1); }
const r = await adminCall(signInServer(env), "POST", "/admin/signing-keys/rotate", { reason });
if (r.status !== 200) { console.error(`stopped: ${r.status} ${r.body.error ?? ""}`); process.exit(1); }
console.log(`${env}: new signing key ${r.body.newKeyId}; ${r.body.retired} old key(s) ${reason === "leaked" ? "deleted from the published set" : "retired, still published for a day"}`);
