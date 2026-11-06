// The portal's page rules (22.12): the security helper. It is OFF at lab22-start. Task 10c turns it on,
// by setting SECURITY_ON to true and sending every response through withSecurity().
//
// Three parts, in the words of 22.12:
// - a content security policy that lets the page run only the portal's own scripts, so a script hidden in a
//   vendor note cannot run, even if it ever reached the page as HTML;
// - the sign-in cookie's settings: HttpOnly (no script can read it), Secure (sent only over https) and
//   SameSite=Lax (not sent with a form another web site posts);
// - a form token: a one-time value the portal puts into its own page and checks when the page sends
//   something back, such as a confirmation. Another web site cannot know it.
import { randomToken, sameString } from "./sign-in.ts";

/** Off until Task 10c. */
export const SECURITY_ON = false;

export const CONTENT_SECURITY_POLICY =
  "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'";

/** The page rules' headers. */
export function securityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy": CONTENT_SECURITY_POLICY,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Cache-Control": "no-store",
  };
}

/** A response with the page rules' headers added, when the helper is on. */
export function withSecurity(res: Response, on: boolean = SECURITY_ON): Response {
  if (!on) return res;
  const h = new Headers(res.headers);
  for (const [k, v] of Object.entries(securityHeaders())) h.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

/** The Set-Cookie value for the portal's sign-in cookie. */
export function sessionCookie(name: string, value: string, maxAgeSeconds: number): string {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

/** A new form token, kept beside the person's sign-in on the server and written into the page. */
export function newFormToken(): string {
  return randomToken();
}

/** The check when a page sends something back: the token in the form must be the one the server kept. */
export function formTokenMatches(sent: string | null, kept: string | undefined): boolean {
  return Boolean(sent && kept && sameString(sent, kept));
}

/** Text from a session, made safe to put into a page: every character that means something to HTML is
 *  written out, so a script in a vendor note shows as plain text (22.12). */
export function asText(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
