// The hosts whose Client ID Metadata Documents the sign-in server will fetch (field guide F3).
//
// A Worker cannot check which computer a name resolves to before it connects, so it cannot fully
// guard against a document address that points into a private network (SSRF). The sign-in server
// therefore fetches documents only from these known app makers. An allowlist is stricter than the
// specification asks, not equivalent to it. Apps whose maker is not here are pre-registered instead.
//
// Add a host only in a reviewed change, with the app it is for.
export const CIMD_ALLOWED_HOSTS: readonly string[] = [
  // OpenAI publishes Codex's documents at https://chatgpt.com/oauth/codex/<callback_id>/client.json
  "chatgpt.com",
];

/** True only for an https address, on the default port, with no credentials, on an allowed host. */
export function isMetadataDocumentUrlAllowed(clientIdUrl: string): boolean {
  let url: URL;
  try {
    url = new URL(clientIdUrl);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.port !== "" || url.username !== "" || url.password !== "") return false;
  return CIMD_ALLOWED_HOSTS.includes(url.hostname.toLowerCase());
}
