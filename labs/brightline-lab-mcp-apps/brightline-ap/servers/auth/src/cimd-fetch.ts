// The fetcher for Client ID Metadata Documents, for Workers (field guide F3).
//
// Better Auth ships a fetcher only for Node (@better-auth/cimd/node), which resolves the name once,
// refuses private addresses and pins the connection. A Worker's fetch() cannot do the last two, so
// this fetcher does what a Worker can, and the allowlist (cimd-allowlist.ts) does the rest:
//   - https only, on an allowed host (checked again here, because this fetcher is also used for
//     a document's jwks_uri)
//   - never follows a redirect: a 3xx is returned as it is, and Better Auth refuses any status but 200
//   - 5 seconds at most
//   - 5 KB at most, the same limit Better Auth applies to documents
import { isMetadataDocumentUrlAllowed } from "./cimd-allowlist.ts";

export const CIMD_TIMEOUT_MS = 5_000;
export const CIMD_MAX_BYTES = 5 * 1024;

export async function fetchClientMetadataResource(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = input instanceof Request ? input.url : String(input);
  if (!isMetadataDocumentUrlAllowed(url)) throw new Error("client metadata address not allowed");
  const timeout = AbortSignal.timeout(CIMD_TIMEOUT_MS);
  const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  // Workers' fetch() supports "follow" and "manual" only. "manual" hands back the 3xx unfollowed.
  const response = await fetch(url, {
    method: "GET",
    headers: init?.headers,
    redirect: "manual",
    signal,
  });
  if (response.status >= 300 && response.status < 400) {
    await response.body?.cancel();
    return new Response(null, { status: response.status, headers: { "Content-Type": "text/plain" } });
  }
  const declared = Number(response.headers.get("Content-Length") ?? "0");
  if (declared > CIMD_MAX_BYTES) {
    await response.body?.cancel();
    throw new Error("client metadata document too large");
  }
  const body = await readAtMost(response, CIMD_MAX_BYTES);
  return new Response(body, { status: response.status, headers: response.headers });
}

async function readAtMost(response: Response, max: number): Promise<Uint8Array> {
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel();
      throw new Error("client metadata document too large");
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return out;
}
