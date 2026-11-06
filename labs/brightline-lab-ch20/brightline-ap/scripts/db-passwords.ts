// Give the loader and reader roles a password, let them log in, and write their connection strings
// to .secrets/db.<env>.env (field guide F2). Nothing is printed. Run after the first db:migrate.
//   npm run db:passwords -- --env dev|ci|staging|production [--rotate] [--github]
// --github (staging and production) also writes .secrets/github-db.<env>.env, for deploy.yml:
//   gh secret set -f .secrets/github-db.<env>.env
// The passwords are made here, never typed or pasted. --rotate replaces them.
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "./lib/admin.ts";
import { connectAs, dbEnvironment } from "./lib/db.ts";

const argv = process.argv.slice(2);
const env = dbEnvironment(argv);
const rotate = parseArgs(argv).flag("rotate");
const file = `.secrets/db.${env}.env`;
const owner = new URL(process.env.DATABASE_URL_OWNER!);
const db = await connectAs("OWNER");
const lines: Record<string, string> = {};
for (const role of ["ap_loader", "ap_reader"] as const) {
  const name = role === "ap_loader" ? "LOADER" : "READER";
  let password = process.env[`AP_${name}_PASSWORD`];
  if (!password || rotate) password = randomBytes(24).toString("base64url");
  // ALTER ROLE takes no parameters, so the value is quoted by the driver's own escaping.
  await db.query(`ALTER ROLE ${role} WITH LOGIN PASSWORD ${db.escapeLiteral(password)}`);
  const url = new URL(owner.toString());
  url.username = role;
  url.password = password;
  lines[`AP_${name}_PASSWORD`] = password;
  lines[`DATABASE_URL_${name}`] = url.toString();
}
await db.end();
if (!existsSync(file)) writeFileSync(file, "", { mode: 0o600 });
const kept = readFileSync(file, "utf8").split("\n").filter((l) => l && !Object.keys(lines).some((k) => l.startsWith(`${k}=`)));
writeFileSync(file, [...kept, ...Object.entries(lines).map(([k, v]) => `${k}=${v}`)].join("\n") + "\n", { mode: 0o600 });
console.log(`${env}: ap_loader and ap_reader can log in. Their connection strings are in ${file} (not printed).`);
if (parseArgs(argv).flag("github")) {
  if (env !== "staging" && env !== "production") { console.error("--github is for staging and production"); process.exit(1); }
  const E = env.toUpperCase();
  writeFileSync(`.secrets/github-db.${env}.env`,
    `DATABASE_URL_OWNER_${E}=${process.env.DATABASE_URL_OWNER}\nDATABASE_URL_READER_${E}=${lines.DATABASE_URL_READER}\n`, { mode: 0o600 });
  console.log(`${env}: wrote .secrets/github-db.${env}.env. Send it with: gh secret set -f .secrets/github-db.${env}.env`);
}
