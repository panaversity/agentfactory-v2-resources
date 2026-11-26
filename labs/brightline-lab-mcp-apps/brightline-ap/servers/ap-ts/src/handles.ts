// Sealed, self-contained page handles, version 2 (18.12 rule 4).
// A handle carries everything the next page needs, and whose place it marks: one person in one
// company. It is sealed with AES-256-GCM so nobody can read it or change it. Any copy of the server
// that holds AP_HANDLE_KEY can open it, so the server keeps nothing in memory between requests.
// While the handle key is being replaced, AP_HANDLE_KEY_PREVIOUS also opens handles (never seals).

export interface PageState {
  v: 2;
  tenant: string; // the company, from the token of the person who asked for page one
  person: string; // that person, the token's sub
  vendor_id: string | null;
  due_on_or_before: string | null;
  offset: number;
  page_size: number;
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

export type OpenResult = { ok: true; state: PageState } | { ok: false; reason: "invalid" | "expired" | "another_caller" };

/** Open a handle with the current key or the previous one, and check it is this person's, in this company, and current. */
export async function openHandle(
  handle: string, keys: readonly string[], who: { tenant: string; person: string }, now: number,
): Promise<OpenResult> {
  let state: PageState | undefined;
  for (const key of keys) {
    try {
      const bytes = fromB64url(handle);
      const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12) }, await importKey(key), bytes.slice(12));
      state = JSON.parse(new TextDecoder().decode(plain));
      break;
    } catch {
      // changed, forged, or sealed under another key: try the next key
    }
  }
  if (!state || state.v !== 2) return { ok: false, reason: "invalid" }; // older handles too
  if (state.tenant !== who.tenant || state.person !== who.person) return { ok: false, reason: "another_caller" };
  if (now >= state.expires_at) return { ok: false, reason: "expired" };
  return { ok: true, state };
}
