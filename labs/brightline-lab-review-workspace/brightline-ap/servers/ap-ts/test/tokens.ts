// Test tokens, signed the way the sign-in server signs them (Ed25519, header typ "at+jwt"), with the
// test signing key from `npm run keys` (AP_TEST_SIGNING_KEY, which `npm test` reads from
// .secrets/test-signing.local.env with --env-file-if-exists). When that file does not exist (a fresh clone, CI), a key made for this run is used instead.
// No key or token is ever printed.
import { createPrivateKey, createPublicKey, generateKeyPairSync, randomUUID, type KeyObject } from "node:crypto";
import { calculateJwkThumbprint, SignJWT, type JWK } from "jose";

export const ISSUER = "http://127.0.0.1:8719/api/auth";
export const RESOURCE = "http://127.0.0.1:8717/mcp";
export const JWKS_URL = `${ISSUER}/jwks`;
export const PRM_URL = "http://127.0.0.1:8717/.well-known/oauth-protected-resource/mcp";
/** Another connector that trusts the same sign-in server (18.6): its tokens must be refused here. */
export const OTHER_RESOURCE = "http://127.0.0.1:8737/mcp";

export interface SigningKey { privateKey: KeyObject; publicJwk: JWK; kid: string }

async function describe(privateKey: KeyObject): Promise<SigningKey> {
  const { kty, crv, x } = createPublicKey(privateKey).export({ format: "jwk" });
  const bare = { kty, crv, x } as JWK;
  const kid = await calculateJwkThumbprint(bare);
  return { privateKey, publicJwk: { ...bare, alg: "EdDSA", use: "sig", kid }, kid };
}

// AGENTS.md: key files are only inputs to commands. `npm test` passes the file with --env-file-if-exists.
const stored = process.env.AP_TEST_SIGNING_KEY || undefined;
/** Where the test key came from, for a log line: never the key itself. */
export const TEST_KEY_SOURCE = stored ? "AP_TEST_SIGNING_KEY" : "made for this run";
/** The base64url PKCS#8 form, as the connector reads AP_TEST_SIGNING_KEY. */
export const TEST_SIGNING_KEY_B64 = stored ??
  generateKeyPairSync("ed25519").privateKey.export({ format: "der", type: "pkcs8" }).toString("base64url");
export const TEST_KEY = await describe(createPrivateKey({ key: Buffer.from(TEST_SIGNING_KEY_B64, "base64url"), format: "der", type: "pkcs8" }));
/** A key nobody publishes: its tokens are forgeries. */
export const STRANGER_KEY = await describe(generateKeyPairSync("ed25519").privateKey);
/** A new key the sign-in server starts using after a rotation (18.15). */
export const ROTATED_KEY = await describe(generateKeyPairSync("ed25519").privateKey);

export interface Claims {
  iss: string; aud: string; sub: string; client_id: string; azp: string; scope: string;
  tenant: string; sid: string; iat: number; exp: number; jti: string;
}

/** A token like the sign-in server's. `omit` drops claims, `key`/`kid`/`typ` change the header. */
export async function sign(
  over: Partial<Claims> = {},
  opts: { omit?: (keyof Claims)[]; key?: SigningKey; kid?: string; typ?: string } = {},
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const claims: Record<string, unknown> = {
    iss: ISSUER, aud: RESOURCE, sub: "u_test_ana", client_id: "app_test_client", azp: "app_test_client",
    scope: "ap:read ap:vendors.read", tenant: "org_brightline", sid: "s_test", iat: now, exp: now + 600, jti: randomUUID(),
    ...over,
  };
  for (const k of opts.omit ?? []) delete claims[k];
  const key = opts.key ?? TEST_KEY;
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "EdDSA", typ: opts.typ ?? "at+jwt", kid: opts.kid ?? key.kid })
    .sign(key.privateKey);
}

/** A stand-in for the sign-in server's /api/auth/jwks, counting how often it is fetched. */
export function fakeJwks(keys: JWK[] = [TEST_KEY.publicJwk]) {
  const state = { keys, fetches: 0 };
  const fetch = async (url: string | URL | Request) => {
    state.fetches++;
    // Tests give each copy its own key address with a ?query, so each starts with no keys held.
    const asked = new URL(String(url instanceof Request ? url.url : url));
    if (asked.origin + asked.pathname !== JWKS_URL) return new Response("not found", { status: 404 });
    return Response.json({ keys: state.keys });
  };
  return { state, fetch };
}
