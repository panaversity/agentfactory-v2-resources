// Make the keys this repository needs, straight into files git ignores. It never prints a key,
// so a coding agent can run it without the keys ever appearing in its chat or its logs.
//
//   node scripts/make-keys.ts            keys for your computer: servers/ap-ts/.dev.vars, servers/ap-py/.dev.vars
//   node scripts/make-keys.ts --deploy   also staging and production keys, in .secrets/ and .dev.vars.staging
//
// It never overwrites a file that exists. To replace a key, delete that file yourself first.
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const key = () => randomBytes(32).toString("base64url");
const pair = () => `AP_MCP_TOKEN=${key()}\nAP_HANDLE_KEY=${key()}\n`;
const written: string[] = [];
const skipped: string[] = [];
// Refuse to write a key where git would track it.
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

// One local pair, shared by both servers, so every host can use one AP_MCP_TOKEN on your computer.
const local = pair();
write("servers/ap-ts/.dev.vars", local);
write("servers/ap-py/.dev.vars", local);

if (process.argv.includes("--deploy")) {
  // Staging and production never share a key.
  const staging = pair();
  const production = pair();
  write(".secrets/staging.env", staging);
  write(".secrets/production.env", production);
  write("servers/ap-ts/.dev.vars.staging", staging);
  write("servers/ap-py/.dev.vars.staging", staging);
  const token = (body: string) => body.split("\n")[0].split("=")[1];
  write(".secrets/github.env",
    `AP_MCP_TOKEN_STAGING=${token(staging)}\nAP_MCP_TOKEN_PRODUCTION=${token(production)}\n` +
    "# Add the two Cloudflare lines yourself, after Task 18c step 1:\n# CLOUDFLARE_API_TOKEN=\n# CLOUDFLARE_ACCOUNT_ID=\n");
}
for (const p of written) console.log(`wrote ${p}`);
for (const p of skipped) console.log(`kept ${p} (it exists)`);
