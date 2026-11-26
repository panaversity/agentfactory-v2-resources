// What the tenant scripts share (Lab 18, Tasks 8 and 11): which environment, the sign-in server's
// address, and calls to its admin routes with AUTH_ADMIN_KEY.
//
// AGENTS.md: a key file is only ever an input to a command. So a script never opens
// .secrets/admin.<env>.env itself: it starts itself again as
//   node --env-file=.secrets/admin.<env>.env --env-file-if-exists=.secrets/test-users.<env>.env
//        --env-file-if-exists=.secrets/<env>.urls.env <script> <same arguments>
// and reads AUTH_ADMIN_KEY from its environment. No key or password is ever printed.
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";

export type EnvName = "local" | "staging" | "production";

/** Command-line options: --name value (repeatable ones collected), and --flag. */
export function parseArgs(argv: string[]) {
  const values = new Map<string, string[]>();
  const flags = new Set<string>();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) throw new Error(`unexpected argument: ${a}`);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) flags.add(a.slice(2));
    else { values.set(a.slice(2), [...(values.get(a.slice(2)) ?? []), next]); i++; }
  }
  return {
    one: (name: string) => values.get(name)?.at(-1),
    all: (name: string) => values.get(name) ?? [],
    flag: (name: string) => flags.has(name),
  };
}

/** The environment from --env (default local), loading its key files by starting this script again. */
export function environment(argv: string[], script: string): EnvName {
  const args = parseArgs(argv);
  const env = (args.one("env") ?? "local") as EnvName;
  if (!["local", "staging", "production"].includes(env)) throw new Error("--env must be local, staging or production");
  if (env === "production" && !args.flag("yes-production")) {
    console.error("stopped: this changes the production sign-in server. Add --yes-production if you mean it.");
    process.exit(1);
  }
  if (process.env.BRIGHTLINE_ADMIN_ENV === env) return env;
  const adminFile = `.secrets/admin.${env}.env`;
  if (!existsSync(adminFile)) {
    console.error(`stopped: ${adminFile} does not exist. Run \`npm run keys\`${env === "local" ? "" : " -- --deploy"} first.`);
    process.exit(1);
  }
  const r = spawnSync(process.execPath, [
    `--env-file=${adminFile}`,
    ...(existsSync(`.secrets/test-users.${env}.env`) ? [`--env-file=.secrets/test-users.${env}.env`] : []),
    ...(env !== "local" ? [`--env-file-if-exists=.secrets/${env}.urls.env`] : []),
    script, ...argv,
  ], { stdio: "inherit", env: { ...process.env, BRIGHTLINE_ADMIN_ENV: env } });
  process.exit(r.status ?? 1);
}

/** The sign-in server's address: 127.0.0.1:8719 locally, AUTH_URL from .secrets/<env>.urls.env online. */
export function signInServer(env: EnvName): string {
  if (env === "local") return process.env.AUTH_URL ?? "http://127.0.0.1:8719";
  const url = process.env.AUTH_URL;
  if (!url) {
    console.error(`stopped: AUTH_URL is not set. Add AUTH_URL=https://brightline-auth-${env}.<subdomain>.workers.dev to .secrets/${env}.urls.env.`);
    process.exit(1);
  }
  return url.replace(/\/$/, "");
}

/** One admin call. Returns the status and the JSON body; never prints the key. */
export async function adminCall(base: string, method: string, path: string, body?: unknown) {
  const key = process.env.AUTH_ADMIN_KEY;
  if (!key) throw new Error("AUTH_ADMIN_KEY is not set");
  const res = await fetch(new URL(path, base), {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", Accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json: any;
  try { json = JSON.parse(text); } catch { json = { error: text.slice(0, 200) }; }
  return { status: res.status, body: json };
}

/** The variable that holds a test person's password in .secrets/test-users.<env>.env. */
export const passwordVar = (email: string) => `TEST_USER_PASSWORD_${email.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;

/** A new password for a test person, appended to .secrets/test-users.<env>.env (mode 600), never printed. */
export function newPassword(env: EnvName, email: string): string {
  const password = randomBytes(24).toString("base64url");
  mkdirSync(".secrets", { recursive: true });
  appendFileSync(`.secrets/test-users.${env}.env`, `${passwordVar(email)}=${password}\n`, { mode: 0o600 });
  process.env[passwordVar(email)] = password;
  return password;
}

/** "Ana Morales <ana@brightline.example>" or "Ana Morales <ana@brightline.example>=auditor". */
export function parsePerson(text: string, defaultRole?: string) {
  const m = text.match(/^\s*(.+?)\s*<([^>]+@[^>]+)>\s*(?:=\s*(\w+))?\s*$/);
  if (!m) throw new Error(`a person is written "Name <email>" or "Name <email>=role": ${text}`);
  const role = m[3] ?? defaultRole;
  if (!role) throw new Error(`no role for ${m[1]}: write "Name <email>=role"`);
  return { name: m[1], email: m[2].toLowerCase(), role };
}
