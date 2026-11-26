// Make the keys this repository needs, straight into files git ignores. It never prints a key,
// so a coding agent can run it without the keys ever appearing in its chat or its logs.
//
//   node scripts/make-keys.ts            keys for your computer:
//                                          servers/ap-ts/.dev.vars, servers/ap-py/.dev.vars (the connector)
//                                          servers/auth/.dev.vars (the sign-in server)
//                                          .secrets/admin.local.env (the tenant scripts' admin key)
//                                          .secrets/test-signing.local.env (tests only, never deployed)
//   node scripts/make-keys.ts --deploy   also staging and production keys, in .secrets/ and .dev.vars.staging
//   node scripts/make-keys.ts --rotate-handle staging|production
//                                        replace that environment's handle key in .secrets/<env>.env: the
//                                        current one becomes AP_HANDLE_KEY_PREVIOUS (opens handles only)
//   node scripts/make-keys.ts --drop-previous staging|production
//                                        15 minutes later: remove AP_HANDLE_KEY_PREVIOUS from that file
//
// It never overwrites a file that exists. To replace a key, delete that file yourself first.
// It refuses to write anywhere git would track.
import { execFileSync } from "node:child_process";
import { generateKeyPairSync, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const key = () => randomBytes(32).toString("base64url");
// The connector's one secret. Chapter 18 removed the shared access key: AI apps sign in now.
// The connector's settings (AP_ISSUER, AP_RESOURCE) are not secrets: see .dev.vars.example.
const pair = () => `AP_HANDLE_KEY=${key()}\n`;
// The sign-in server's own two secrets. BETTER_AUTH_SECRET protects sessions and encrypts the
// private signing keys. AUTH_ADMIN_KEY is what the tenant scripts send to /admin/*.
const authSecrets = (adminKey: string) => `BETTER_AUTH_SECRET=${key()}\nAUTH_ADMIN_KEY=${adminKey}\n`;
// The test-only signing key: an Ed25519 private key, PKCS#8 DER, base64url. Tests sign tokens with
// it, and the connector trusts it only with AP_TRUST_TEST_ISSUER=1 on your computer. Never deployed.
const testSigningKey = () =>
  generateKeyPairSync("ed25519").privateKey.export({ format: "der", type: "pkcs8" }).toString("base64url");

const written: string[] = [];
const skipped: string[] = [];
// Refuse to write a key where git would track it. A tracked file is never "ignored", so it is refused too.
function ignored(path: string) {
  try { execFileSync("git", ["check-ignore", "-q", path]); return true; } catch { return false; }
}
function write(path: string, body: string) {
  if (existsSync(path)) return skipped.push(path);
  if (!ignored(path)) {
    console.error(`stopped: git does not ignore ${path}. Add it to .gitignore first. No key was written there.`);
    process.exitCode = 1;
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body, { mode: 0o600 });
  written.push(path);
}

// One local handle key, shared by both connector servers, so a page handle works on either.
// With the local settings beside it, so `npm start` works at once (they are not secrets).
// Each connector has its own address, which every token it accepts must name as its aud.
const handleKey = pair();
const local = (resource: string) => handleKey +
  `AP_ISSUER=http://127.0.0.1:8719/api/auth\nAP_RESOURCE=${resource}\nAP_TRUST_TEST_ISSUER=1\n`;
write("servers/ap-ts/.dev.vars", local("http://127.0.0.1:8717/mcp"));
write("servers/ap-py/.dev.vars", local("http://127.0.0.1:8718/mcp"));

// The sign-in server on your computer, and the admin key the tenant scripts read. The two files hold
// the same AUTH_ADMIN_KEY, so they are written only together: if either exists, neither is written.
{
  const adminKey = key();
  const files = ["servers/auth/.dev.vars", ".secrets/admin.local.env"];
  if (files.some(existsSync)) files.forEach((p) => skipped.push(p));
  else if (!files.every(ignored)) {
    console.error(`stopped: git does not ignore ${files.join(" and ")}. Add them to .gitignore first. No key was written there.`);
    process.exitCode = 1;
  } else {
    write(files[0], authSecrets(adminKey));
    write(files[1], `AUTH_ADMIN_KEY=${adminKey}\n`);
  }
}
write(".secrets/test-signing.local.env", `AP_TEST_SIGNING_KEY=${testSigningKey()}\n`);

if (process.argv.includes("--deploy")) {
  // Staging and production never share a key.
  const staging = pair();
  const production = pair();
  write(".secrets/staging.env", staging);
  write(".secrets/production.env", production);
  write("servers/ap-ts/.dev.vars.staging", staging);
  write("servers/ap-py/.dev.vars.staging", staging);
  // The sign-in server's secrets per environment, in their own files, so `wrangler secret bulk`
  // sends the sign-in server only its own two secrets and the connector only its own.
  for (const envName of ["staging", "production"]) {
    const adminKey = key();
    write(`.secrets/auth.${envName}.env`, authSecrets(adminKey));
    write(`.secrets/admin.${envName}.env`, `AUTH_ADMIN_KEY=${adminKey}\n`);
  }
  // .secrets/github.env is no longer made here: `npm run client:ci` writes the CI client's secret into it (F8).
}
// Replacing the handle key (docs/deploy.md): this script, which made the key, moves it. Nothing is printed.
for (const flag of ["--rotate-handle", "--drop-previous"]) {
  const i = process.argv.indexOf(flag);
  if (i < 0) continue;
  const envName = process.argv[i + 1];
  const file = `.secrets/${envName}.env`;
  if (!["staging", "production"].includes(envName) || !existsSync(file)) {
    console.error(`stopped: ${flag} takes staging or production, and ${file} must exist (npm run keys -- --deploy).`);
    process.exit(1);
  }
  const lines = readFileSync(file, "utf8").split("\n").filter(Boolean);
  const current = lines.find((l) => l.startsWith("AP_HANDLE_KEY="));
  const rest = lines.filter((l) => !l.startsWith("AP_HANDLE_KEY=") && !l.startsWith("AP_HANDLE_KEY_PREVIOUS="));
  const next = flag === "--rotate-handle"
    ? [`AP_HANDLE_KEY=${key()}`, `AP_HANDLE_KEY_PREVIOUS=${current?.slice("AP_HANDLE_KEY=".length) ?? ""}`, ...rest]
    : [...(current ? [current] : []), ...rest];
  writeFileSync(file, next.join("\n") + "\n", { mode: 0o600 });
  console.log(flag === "--rotate-handle"
    ? `replaced the handle key in ${file}; the old one is AP_HANDLE_KEY_PREVIOUS. Send it with npm run secrets:${envName}`
    : `removed AP_HANDLE_KEY_PREVIOUS from ${file}. Send it with npm run secrets:${envName}`);
}
for (const p of written) console.log(`wrote ${p}`);
for (const p of skipped) console.log(`kept ${p} (it exists)`);
