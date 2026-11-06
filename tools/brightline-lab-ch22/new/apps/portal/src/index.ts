// The AP portal: a Cloudflare Worker, brightline-portal (Lab 22). This is the skeleton the zip ships.
// Every route answers 501 until the task that builds it fills it in. The tasks name each route:
//
//   GET  /sign-in                    Task 10a  start Chapter 18's sign-in (src/sign-in.ts)
//   GET  /callback                   Task 10a  finish it, check the ID token, store the person's vault
//   POST /question                   Task 10b  start a session for the signed-in person (src/hosted/start-session.ts)
//   GET  /sessions/:id/stream        Task 10c  the session's events, for its own person only (22.12)
//   POST /sessions/:id/confirmation  Task 10c  allow or deny a waiting tool call (22.8), with the form token
//   POST /sessions/:id/interrupt     Task 10c  stop the session's current work (22.3)
//   POST /hooks/claude               Task 17   the platform's signed messages, checked and deduplicated (22.15)
//
// The security helper (src/security.ts) is off until Task 10c turns it on.
import { withSecurity } from "./security.ts";

export interface Env {
  /** The sign-in server, through a service binding: a Worker cannot fetch another of the same account by
   *  its workers.dev address (the connector's wrangler.jsonc says the same). */
  AUTH?: { fetch: (request: Request) => Promise<Response> };
  /** Settings, not secrets: see wrangler.jsonc. */
  AP_ISSUER?: string;
  AP_RESOURCE?: string;
  PORTAL_URL?: string;
  /** Worker secrets, set by you with `npx wrangler secret put <NAME> --env staging` in apps/portal/:
   *  PORTAL_CLIENT_ID and PORTAL_CLIENT_SECRET (Task 9), ANTHROPIC_API_KEY (Task 10a), WEBHOOK_SIGNING_SECRET (Task 17). */
  PORTAL_CLIENT_ID?: string;
  PORTAL_CLIENT_SECRET?: string;
  ANTHROPIC_API_KEY?: string;
  WEBHOOK_SIGNING_SECRET?: string;
}

const ROUTES: Array<{ method: string; pattern: RegExp; task: string }> = [
  { method: "GET", pattern: /^\/sign-in$/, task: "Task 10a" },
  { method: "GET", pattern: /^\/callback$/, task: "Task 10a" },
  { method: "POST", pattern: /^\/question$/, task: "Task 10b" },
  { method: "GET", pattern: /^\/sessions\/[^/]+\/stream$/, task: "Task 10c" },
  { method: "POST", pattern: /^\/sessions\/[^/]+\/confirmation$/, task: "Task 10c" },
  { method: "POST", pattern: /^\/sessions\/[^/]+\/interrupt$/, task: "Task 10c" },
  { method: "POST", pattern: /^\/hooks\/claude$/, task: "Task 17" },
];

function text(body: string, status: number): Response {
  return new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function handle(request: Request, _env: Env): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (request.method === "GET" && pathname === "/") {
    return text("Brightline's AP portal: the skeleton from the Lab 22 zip. Sign-in comes in Task 10a.\n", 200);
  }
  for (const r of ROUTES) {
    if (r.pattern.test(pathname)) {
      if (request.method !== r.method) return text("Method not allowed.\n", 405);
      return text(`Not built yet: ${r.method} ${pathname.replace(/\/sessions\/[^/]+\//, "/sessions/:id/")} comes in ${r.task}.\n`, 501);
    }
  }
  return text("Not found.\n", 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return withSecurity(await handle(request, env));
  },
};
