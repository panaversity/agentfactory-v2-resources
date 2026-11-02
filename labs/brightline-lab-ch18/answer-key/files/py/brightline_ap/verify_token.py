"""The token check (18.6, F4) in Python: a TokenVerifier for the MCP Python SDK, with PyJWT.

A token is accepted only if its header says it is an access token (typ "at+jwt", alg EdDSA), its
signature checks out against the sign-in server's public keys, its issuer is AP_ISSUER, its
audience is exactly AP_RESOURCE (one string), it has not expired, and it names a company
(`tenant`). Tokens are checked here, locally: the sign-in server is never asked per request.
"""

from __future__ import annotations

import asyncio
import base64
import hashlib
import json
from typing import Any

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey
from jwt import PyJWKClient, PyJWKClientConnectionError

from mcp.server.auth.provider import AccessToken

# The only state kept between requests: one PyJWKClient per JWKS address, holding the sign-in
# server's public keys. PyJWT keeps the key set for 5 minutes and fetches again for a key id it has
# not seen, at most once every 30 seconds (its cooldown). Nothing about a person or a company.
_KEY_SETS: dict[str, PyJWKClient] = {}


def _key_set(jwks_url: str) -> PyJWKClient:
    client = _KEY_SETS.get(jwks_url)
    if client is None:
        client = _KEY_SETS[jwks_url] = PyJWKClient(jwks_url, timeout=5)
    return client


def _b64url(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()


def test_public_key(test_signing_key: str) -> tuple[str, Ed25519PublicKey]:
    """The public half of AP_TEST_SIGNING_KEY (Ed25519, PKCS#8 DER, base64url) and its RFC 7638 kid."""
    private = serialization.load_der_private_key(base64.urlsafe_b64decode(test_signing_key + "=" * (-len(test_signing_key) % 4)), None)
    if not isinstance(private, Ed25519PrivateKey):
        raise ValueError("AP_TEST_SIGNING_KEY must be an Ed25519 key")
    public = private.public_key()
    x = _b64url(public.public_bytes(serialization.Encoding.Raw, serialization.PublicFormat.Raw))
    kid = _b64url(hashlib.sha256(json.dumps({"crv": "Ed25519", "kty": "OKP", "x": x}, separators=(",", ":")).encode()).digest())
    return kid, public


class BrightlineTokenVerifier:
    """Implements the SDK's TokenVerifier protocol: verify_token returns an AccessToken, or None to refuse."""

    def __init__(self, *, issuer: str, resource: str, jwks_url: str, test_signing_key: str | None = None) -> None:
        self.issuer, self.resource = issuer, resource
        self.keys = _key_set(jwks_url)
        # Trusted only when AP_TRUST_TEST_ISSUER=1 on your computer (the caller decides).
        self.test_key = test_public_key(test_signing_key) if test_signing_key else None

    async def _key_for(self, kid: str | None) -> Any:
        if self.test_key is not None and kid == self.test_key[0]:
            return self.test_key[1]
        if not kid:
            raise jwt.InvalidTokenError("no kid")
        # PyJWKClient fetches with urllib, which blocks: run it off the event loop.
        return (await asyncio.to_thread(self.keys.get_signing_key, kid)).key

    async def verify_token(self, token: str) -> AccessToken | None:
        try:
            header = jwt.get_unverified_header(token)
            if header.get("typ") != "at+jwt" or header.get("alg") != "EdDSA":
                return None
            key = await self._key_for(header.get("kid"))
            claims: dict[str, Any] = jwt.decode(
                token, key, algorithms=["EdDSA"], issuer=self.issuer, audience=self.resource,
                options={"require": ["exp", "iss", "aud", "sub"], "strict_aud": True},
            )
        except PyJWKClientConnectionError:
            raise  # the public keys cannot be fetched: the connector's problem, not the token's
        except (jwt.PyJWTError, ValueError):
            return None
        tenant, client_id = claims.get("tenant"), claims.get("client_id") or claims.get("azp")
        if not isinstance(tenant, str) or not tenant or not isinstance(client_id, str) or not client_id:
            return None
        scope = claims.get("scope")
        return AccessToken(
            token=token,
            client_id=client_id,
            scopes=scope.split() if isinstance(scope, str) else [],
            expires_at=int(claims["exp"]),
            resource=str(claims["aud"]),  # with validate_token_resource=True the SDK compares it too
            subject=str(claims["sub"]),
            claims={"iss": claims["iss"], "tenant": tenant},
        )
