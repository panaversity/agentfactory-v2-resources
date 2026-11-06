"""Test tokens, signed the way the sign-in server signs them (Ed25519, header typ "at+jwt").

The key is AP_TEST_SIGNING_KEY from `npm run keys`, which `npm run test:py` passes to uv with
--env-file when .secrets/test-signing.local.env exists. Otherwise (a fresh clone, CI) a key made
for this run is used. A small local server stands in for the sign-in server's JWKS. Nothing here
ever prints a key or a token.
"""

from __future__ import annotations

import base64
import hashlib
import json
import os
import threading
import time
import uuid
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

ISSUER = "http://127.0.0.1:8719/api/auth"
RESOURCE = "http://127.0.0.1:8717/mcp"
PRM_PATH = "/.well-known/oauth-protected-resource/mcp"
PRM_URL = f"http://127.0.0.1:8717{PRM_PATH}"
OTHER_RESOURCE = "http://127.0.0.1:8737/mcp"


def _b64url(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()


@dataclass(frozen=True)
class SigningKey:
    private_key: Ed25519PrivateKey
    public_jwk: dict[str, str]
    kid: str


def describe(private_key: Ed25519PrivateKey) -> SigningKey:
    x = _b64url(private_key.public_key().public_bytes(serialization.Encoding.Raw, serialization.PublicFormat.Raw))
    # RFC 7638 thumbprint, the same kid the TypeScript tests and connector compute.
    kid = _b64url(hashlib.sha256(json.dumps({"crv": "Ed25519", "kty": "OKP", "x": x}, separators=(",", ":")).encode()).digest())
    return SigningKey(private_key, {"kty": "OKP", "crv": "Ed25519", "x": x, "alg": "EdDSA", "use": "sig", "kid": kid}, kid)


def _pkcs8(key: Ed25519PrivateKey) -> str:
    return _b64url(key.private_bytes(serialization.Encoding.DER, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))


_stored = os.environ.get("AP_TEST_SIGNING_KEY") or None
TEST_KEY_SOURCE = "AP_TEST_SIGNING_KEY" if _stored else "made for this run"
TEST_SIGNING_KEY_B64 = _stored or _pkcs8(Ed25519PrivateKey.generate())
_loaded = serialization.load_der_private_key(base64.urlsafe_b64decode(TEST_SIGNING_KEY_B64 + "=" * (-len(TEST_SIGNING_KEY_B64) % 4)), None)
assert isinstance(_loaded, Ed25519PrivateKey)
TEST_KEY = describe(_loaded)
STRANGER_KEY = describe(Ed25519PrivateKey.generate())
ROTATED_KEY = describe(Ed25519PrivateKey.generate())


def sign(over: dict[str, Any] | None = None, *, omit: tuple[str, ...] = (), key: SigningKey = TEST_KEY,
         kid: str | None = None, typ: str = "at+jwt") -> str:
    now = int(time.time())
    claims: dict[str, Any] = {
        "iss": ISSUER, "aud": RESOURCE, "sub": "u_test_ana", "client_id": "app_test_client", "azp": "app_test_client",
        "scope": "ap:read ap:vendors.read", "tenant": "org_brightline", "sid": "s_test", "iat": now, "exp": now + 600,
        "jti": str(uuid.uuid4()), **(over or {}),
    }
    for name in omit:
        claims.pop(name, None)
    return jwt.encode(claims, key.private_key, algorithm="EdDSA", headers={"typ": typ, "kid": kid or key.kid})


# --- A stand-in for the sign-in server's /api/auth/jwks -------------------------------------------
# Each path is its own key set, so a test can rotate keys without touching the others.


class _Sets:
    def __init__(self) -> None:
        self.keys: dict[str, list[dict[str, str]]] = {}
        self.fetches: dict[str, int] = {}


SETS = _Sets()


class _Handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:  # noqa: N802 (the standard library's name)
        SETS.fetches[self.path] = SETS.fetches.get(self.path, 0) + 1
        keys = SETS.keys.get(self.path)
        body = json.dumps({"keys": keys}).encode() if keys is not None else b"{}"
        self.send_response(200 if keys is not None else 404)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: Any) -> None:
        pass


_server = ThreadingHTTPServer(("127.0.0.1", 0), _Handler)
threading.Thread(target=_server.serve_forever, daemon=True).start()
JWKS_BASE = f"http://127.0.0.1:{_server.server_address[1]}"


def fake_jwks(name: str, keys: list[dict[str, str]] | None = None) -> str:
    """Publish a key set at its own address and return that address."""
    path = f"/{name}/jwks"
    SETS.keys[path] = keys if keys is not None else [TEST_KEY.public_jwk]
    SETS.fetches[path] = 0
    return JWKS_BASE + path


def fetches(url: str) -> int:
    return SETS.fetches.get(url.removeprefix(JWKS_BASE), 0)


def publish(url: str, keys: list[dict[str, str]]) -> None:
    SETS.keys[url.removeprefix(JWKS_BASE)] = keys


DEFAULT_JWKS = fake_jwks("default")
