// The token check (18.6, F4): the OAuthTokenVerifier the SDK's requireBearerAuth calls.
// A token is accepted only if its signature checks out against the sign-in server's public keys,
// its header says it is an access token (typ "at+jwt", alg EdDSA), its issuer is AP_ISSUER, its
// audience is exactly AP_RESOURCE, it has not expired, and it names a company (`tenant`).
// Nothing is asked of the sign-in server per request: the public keys are fetched once and kept.
import { OAuthError, OAuthErrorCode, type AuthInfo, type OAuthTokenVerifier } from "@modelcontextprotocol/server";
import { calculateJwkThumbprint, createLocalJWKSet, createRemoteJWKSet, customFetch, errors, jwtVerify, type JWK, type JWTVerifyGetKey } from "jose";

export const SIGN_IN = "Sign in to use the Brightline AP connector.";

export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface KeySource {
  /** The sign-in server's JWKS address: on your computer `${AP_ISSUER}/jwks`. */
  jwksUrl: string;
  /** How to fetch it. Online, the AUTH service binding's fetch. In tests, a stand-in. */
  fetch?: FetchLike;
  /** AP_TEST_SIGNING_KEY, passed only when AP_TRUST_TEST_ISSUER=1 on your computer. */
  testSigningKey?: string;
}

export interface VerifierConfig {
  issuer: string; // AP_ISSUER
  resource: string; // AP_RESOURCE
  keys: KeySource;
}

// The only state kept between requests: the sign-in server's public keys, one set per JWKS address.
// jose fetches them on first use, keeps them for 10 minutes, and fetches again when a token names a
// key id it has not seen, at most once every 30 seconds (its cooldown). Nothing about a person or company.
const keySets = new Map<string, JWTVerifyGetKey>();

function remoteKeys(source: KeySource): JWTVerifyGetKey {
  let set = keySets.get(source.jwksUrl);
  if (!set) {
    set = createRemoteJWKSet(new URL(source.jwksUrl), source.fetch ? { [customFetch]: source.fetch } : {});
    keySets.set(source.jwksUrl, set);
  }
  return set;
}

/** The public half of AP_TEST_SIGNING_KEY (Ed25519, PKCS#8 DER, base64url), with its RFC 7638 kid. */
async function testPublicKey(testSigningKey: string): Promise<JWK> {
  const der = Uint8Array.from(atob(testSigningKey.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "Ed25519" }, true, ["sign"]);
  const { kty, crv, x } = (await crypto.subtle.exportKey("jwk", key)) as JWK;
  const bare = { kty, crv, x } as JWK;
  return { ...bare, alg: "EdDSA", use: "sig", kid: await calculateJwkThumbprint(bare) };
}

const refuse = () => new OAuthError(OAuthErrorCode.InvalidToken, SIGN_IN);

export function makeTokenVerifier(config: VerifierConfig): OAuthTokenVerifier {
  const remote = remoteKeys(config.keys);
  const testKeys = config.keys.testSigningKey
    ? testPublicKey(config.keys.testSigningKey).then((jwk) => ({ kid: jwk.kid!, keys: createLocalJWKSet({ keys: [jwk] }) }))
    : undefined;
  const getKey: JWTVerifyGetKey = async (header, token) => {
    const test = await testKeys;
    return test && header.kid === test.kid ? test.keys(header, token) : remote(header, token);
  };

  return {
    async verifyAccessToken(token: string): Promise<AuthInfo> {
      let payload;
      try {
        ({ payload } = await jwtVerify(token, getKey, {
          issuer: config.issuer,
          audience: config.resource,
          algorithms: ["EdDSA"],
          typ: "at+jwt",
          requiredClaims: ["exp", "sub"],
        }));
      } catch (err) {
        // Keys that cannot be fetched are the connector's problem, not the token's: 500, not 401.
        if (err instanceof errors.JWKSTimeout || (err instanceof errors.JOSEError && err.code === "ERR_JOSE_GENERIC")) throw err;
        if (err instanceof errors.JOSEError) throw refuse();
        throw err; // a network error fetching the keys
      }
      // `aud` must be this connector's address exactly. jose accepts an array that contains it; the
      // sign-in server writes a single string, so anything else is refused.
      if (payload.aud !== config.resource) throw refuse();
      const tenant = payload.tenant;
      if (typeof tenant !== "string" || !tenant) throw refuse();
      const clientId = typeof payload.client_id === "string" ? payload.client_id : typeof payload.azp === "string" ? payload.azp : "";
      if (!clientId) throw refuse();
      const scopes = typeof payload.scope === "string" ? payload.scope.split(" ").filter(Boolean) : [];
      return {
        token,
        clientId,
        scopes,
        expiresAt: payload.exp,
        resource: new URL(config.resource),
        extra: { tenant, sub: payload.sub },
      };
    },
  };
}
