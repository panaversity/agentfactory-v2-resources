// Sealed, self-contained page handles.
// A handle carries everything the next page needs, sealed with AES-256-GCM so nobody can
// read it or change it. Any copy of the server that holds AP_HANDLE_KEY can open it, so the
// server keeps nothing in memory between requests.

export interface PageState {
  v: 1;
  vendor_id: string | null;
  due_on_or_before: string | null;
  offset: number;
  page_size: number;
  caller: string;
  expires_at: number; // milliseconds since 1970, UTC
}

export const HANDLE_LIFETIME_MS = 15 * 60 * 1000;

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (text: string) => {
  const s = text.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(s + "=".repeat((4 - (s.length % 4)) % 4)), (c) => c.charCodeAt(0));
};

async function importKey(keyB64url: string): Promise<CryptoKey> {
  const raw = fromB64url(keyB64url);
  if (raw.length !== 32) throw new Error("AP_HANDLE_KEY must be 32 bytes, base64url");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

/** Seal a page state into an opaque handle: base64url(12-byte nonce || ciphertext and tag). */
export async function sealHandle(state: PageState, keyB64url: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = new TextEncoder().encode(JSON.stringify(state));
  const sealed = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await importKey(keyB64url), plain));
  const out = new Uint8Array(iv.length + sealed.length);
  out.set(iv);
  out.set(sealed, iv.length);
  return b64url(out);
}

export type OpenResult = { ok: true; state: PageState } | { ok: false; reason: "invalid" | "expired" };

/** Open a handle and check it belongs to this caller and has not expired. */
export async function openHandle(handle: string, keyB64url: string, caller: string, now: number): Promise<OpenResult> {
  let state: PageState;
  try {
    const bytes = fromB64url(handle);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12) }, await importKey(keyB64url), bytes.slice(12));
    state = JSON.parse(new TextDecoder().decode(plain));
  } catch {
    return { ok: false, reason: "invalid" }; // changed, forged, or sealed under another key
  }
  if (state.v !== 1 || state.caller !== caller) return { ok: false, reason: "invalid" };
  if (now >= state.expires_at) return { ok: false, reason: "expired" };
  return { ok: true, state };
}
