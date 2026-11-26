// The sign-in server's Worker entry: Brightline's sign-in server for the AP connector.
//
//   /api/auth/*                                   Better Auth: authorize, token, jwks, sign-in, organization
//   /.well-known/oauth-authorization-server/api/auth   RFC 8414, served by Better Auth (mcp plugin)
//   /.well-known/oauth-protected-resource/mcp     RFC 9728, served by Better Auth (mcp plugin)
//   /sign-in, /consent                            the lab's two pages
//   /admin/*                                      the platform operator's routes (AUTH_ADMIN_KEY)
import { createAuth, type Auth, type AuthEnv } from "./auth.ts";
import { admin } from "./admin.ts";
import { consent, signIn } from "./pages.ts";

// A new auth instance for every request. Reusing one across requests hangs on Workers: its lazy
// setup starts database work inside the first request, and a later request that awaits that work
// waits forever, because Workers ties every I/O to the request that started it (see build log).
// Being per request, it holds nothing about a company or a person between requests.
const authFor = (env: AuthEnv): Auth => createAuth(env);

export default {
  async fetch(request: Request, env: AuthEnv): Promise<Response> {
    if (!env.BETTER_AUTH_SECRET) return new Response("not ready: BETTER_AUTH_SECRET is not set", { status: 503 });
    const auth = authFor(env);
    const { pathname } = new URL(request.url);
    if (pathname === "/sign-in") return signIn(request, env, auth);
    if (pathname === "/consent") return consent(request, env, auth);
    if (pathname.startsWith("/admin/")) return admin(request, env, auth);
    return auth.handler(request);
  },
} satisfies ExportedHandler<AuthEnv>;
