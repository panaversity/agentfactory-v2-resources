// Shared by every database script (field guide F2, F6). Connection strings and passwords live only in
// .secrets/db.<env>.env, which git ignores. Scripts read that file themselves and never print it.
//
//   DATABASE_URL_OWNER    the project's owner role: runs migrations and makes roles, never serves a request
//   DATABASE_URL_LOADER   ap_loader: writes one company's rows at a time (onboarding, deletion)
//   DATABASE_URL_READER   ap_reader: what the connector uses, read-only
import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import pg from "pg";
import { parseArgs } from "./admin.ts";

export type DbEnv = "dev" | "ci" | "staging" | "production";
export const DB_ENVS: DbEnv[] = ["dev", "ci", "staging", "production"];

/** Read --env (default dev), load .secrets/db.<env>.env (and .secrets/embeddings.env) into process.env. */
export function dbEnvironment(argv: string[]): DbEnv {
  const args = parseArgs(argv);
  const env = (args.one("env") ?? "dev") as DbEnv;
  if (!DB_ENVS.includes(env)) throw new Error("--env must be dev, ci, staging or production");
  if (env === "production" && !args.flag("yes-production")) {
    console.error("stopped: this touches the production database. Add --yes-production if you mean it.");
    process.exit(1);
  }
  const file = `.secrets/db.${env}.env`;
  // The file's values always win over anything already set, so --env staging can never quietly use
  // dev's connection strings. (process.loadEnvFile keeps values already set, so it is not used here.)
  if (existsSync(file)) {
    for (const name of ["DATABASE_URL_OWNER", "DATABASE_URL_LOADER", "DATABASE_URL_READER", "AP_LOADER_PASSWORD", "AP_READER_PASSWORD"]) delete process.env[name];
    Object.assign(process.env, parseEnv(readFileSync(file, "utf8")));
  } else if (!(process.env.GITHUB_ACTIONS && process.env.DATABASE_URL_OWNER && (env === "ci" || process.env.GITHUB_ACTIONS_DB === env))) {
    // In GitHub Actions the workflow passes the connection strings in the environment instead: the ci
    // branch's owner for pull requests, and for a deploy, GITHUB_ACTIONS_DB names the one environment meant.
    console.error(`stopped: ${file} does not exist. Task 0 makes it (field guide F2).`);
    process.exit(1);
  }
  if (existsSync(".secrets/embeddings.env")) Object.assign(process.env, parseEnv(readFileSync(".secrets/embeddings.env", "utf8")));
  return env;
}

export type Role = "OWNER" | "LOADER" | "READER";
/** One client as one role. The connection string is never printed, even in an error. */
export async function connectAs(role: Role): Promise<pg.Client> {
  const url = process.env[`DATABASE_URL_${role}`];
  if (!url) {
    console.error(`stopped: DATABASE_URL_${role} is not set.${role === "OWNER" ? "" : " Run npm run db:passwords first."}`);
    process.exit(1);
  }
  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 15_000 });
  try {
    await client.connect();
  } catch (err) {
    console.error(`stopped: could not connect as the ${role.toLowerCase()} role (${(err as { code?: string }).code ?? "no code"}).`);
    process.exit(1);
  }
  return client;
}

/** Run work for one company in one transaction, the same way the connector does (19.9). */
export async function inTenant<T>(client: pg.Client, tenant: string, work: () => Promise<T>): Promise<T> {
  if (!/^org_[a-z0-9_]+$/.test(tenant)) throw new Error(`${tenant} is not a company id like org_cedar`);
  await client.query("BEGIN");
  try {
    await client.query("SELECT set_config('app.tenant_id', $1, true)", [tenant]);
    const result = await work();
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw err;
  }
}

/** Every table that holds company data, children last, so deletion runs in reverse. */
export const COMPANY_TABLES = [
  "tenants", "tenant_settings", "vendors", "vendor_notes", "vendor_banking", "invoices", "purchase_orders",
  "policy_documents", "policy_passages",
] as const;
export const tenantColumn = (table: string) => (table === "tenants" ? "id" : "tenant_id");
