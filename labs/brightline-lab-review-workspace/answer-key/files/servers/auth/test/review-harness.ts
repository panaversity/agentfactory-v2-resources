// Lab 20b: the sign-in server with the review workspace's two addresses bound as well. The same start-up
// as harness.ts (which this file leaves unchanged, so Lab 18's tests run exactly as before), plus
// MCP_RESOURCE_REVIEW and MCP_RESOURCE_REVIEW_PY. No fake internet: these tests fetch nothing.
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { ADMIN_KEY, BASE, RESOURCE, RESOURCE_PY, ROOT, type Server } from "./harness.ts";

export const RESOURCE_REVIEW = "http://127.0.0.1:8757/mcp";
export const RESOURCE_REVIEW_PY = "http://127.0.0.1:8758/mcp";

export async function startReviewServer(): Promise<Server> {
  const work = mkdtempSync(join(tmpdir(), "brightline-auth-review-test-"));
  const wrangler = (...args: string[]) =>
    execFileSync("npx", ["wrangler", ...args], { cwd: ROOT, stdio: "pipe", env: { ...process.env, CI: "1", WRANGLER_SEND_METRICS: "false" } });
  wrangler("deploy", "--dry-run", "--outdir", join(work, "build"));
  wrangler("d1", "migrations", "apply", "brightline-auth", "--local", "--persist-to", join(work, "state"));
  const options = convertV4MiniflareOptions({
    modules: [{ type: "ESModule", path: join(work, "build", "worker.js") }],
    modulesRoot: join(work, "build"),
    compatibilityDate: "2026-10-01",
    compatibilityFlags: ["nodejs_compat"],
    d1Databases: { DB: "local-only" },
    bindings: {
      AUTH_BASE_URL: BASE,
      MCP_RESOURCE: RESOURCE,
      MCP_RESOURCE_PY: RESOURCE_PY,
      MCP_RESOURCE_REVIEW: RESOURCE_REVIEW,
      MCP_RESOURCE_REVIEW_PY: RESOURCE_REVIEW_PY,
      BETTER_AUTH_SECRET: randomBytes(32).toString("base64url"),
      AUTH_ADMIN_KEY: ADMIN_KEY,
    },
    outboundService: () => new Response("not found", { status: 404 }),
    cf: false,
    telemetry: { enabled: false },
  });
  options.resourcePersistencePath = join(work, "state", "v3");
  const mf = new Miniflare(options);
  await mf.ready;
  return {
    mf,
    async fetch(path, init) {
      const res = (await mf.dispatchFetch(new URL(path, BASE), { redirect: "manual", ...init } as never)) as unknown as Response;
      const body = [101, 204, 205, 304].includes(res.status) ? null : await res.arrayBuffer();
      return new Response(body, { status: res.status, headers: res.headers });
    },
    async stop() {
      await mf.dispose();
      rmSync(work, { recursive: true, force: true });
    },
  };
}
