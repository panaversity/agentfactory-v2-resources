"""The Python connector behind sign-in tokens (Lab 18, Task 7), written before the code.

The same cases as servers/ap-ts/test/auth.test.ts, from docs/auth-spec.md, 18.6, 18.7 and F4.
"""

from __future__ import annotations

import time
import types
from collections.abc import Callable, Iterator
from contextlib import contextmanager
from typing import Any

import jwt.jwks_client
import pytest
from starlette.testclient import TestClient

from brightline_ap.connector import RequestAuth
from brightline_ap.mcp_server import create_app
from tests.test_connector import HANDLE_KEY, START_MS, TOKEN, rpc
from tests.tokens import (DEFAULT_JWKS, ISSUER, OTHER_RESOURCE, PRM_PATH, PRM_URL, RESOURCE, ROTATED_KEY, STRANGER_KEY,
                          TEST_KEY, TEST_SIGNING_KEY_B64, fake_jwks, fetches, publish, sign)

SIGN_IN = "Sign in to use the Brightline AP connector."
RESOURCE_METADATA = f'resource_metadata="{PRM_URL}"'
LIST: dict[str, Any] = {"name": "list_open_invoices", "arguments": {}}


@contextmanager
def door(jwks_url: str = DEFAULT_JWKS, test_signing_key: str | None = None,
         observe: Callable[[RequestAuth], None] | None = None) -> Iterator[TestClient]:
    app = create_app(handle_key=HANDLE_KEY, issuer=ISSUER, resource=RESOURCE, jwks_url=jwks_url,
                     test_signing_key=test_signing_key, now_ms=lambda: START_MS, observe=observe)
    with TestClient(app, base_url="http://127.0.0.1:8717") as client:
        yield client


def assert_sign_in_refusal(response: Any, what: str) -> None:
    assert response.status_code == 401, f"{what}: {response.status_code}"
    challenge = response.headers.get("www-authenticate", "")
    assert challenge.startswith("Bearer "), what
    assert RESOURCE_METADATA in challenge, f"{what}: {challenge}"
    assert 'scope="ap:read"' in challenge, f"{what}: {challenge}"
    assert f'error_description="{SIGN_IN}"' in challenge, f"{what}: {challenge}"


def test_the_connectors_own_document() -> None:
    with door() as c:
        r = c.get(PRM_PATH)
    assert r.status_code == 200
    doc = r.json()
    assert doc["resource"] == RESOURCE
    assert doc["authorization_servers"] == [ISSUER]
    assert doc["scopes_supported"] == ["ap:read", "ap:vendors.read"]


def test_never_serves_a_sign_in_servers_document() -> None:
    with door() as c:
        assert c.get("/.well-known/oauth-authorization-server").status_code == 404


def test_no_token() -> None:
    with door() as c:
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token=""), "no token")


def test_expired_token() -> None:
    now = int(time.time())
    with door() as c:
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token=sign({"iat": now - 1200, "exp": now - 600})), "expired")


def test_wrong_audience() -> None:
    with door() as c:
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token=sign({"aud": OTHER_RESOURCE})), "another connector")
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token=sign({"aud": RESOURCE + "/"})), "audience with a slash")


def test_wrong_issuer() -> None:
    with door() as c:
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token=sign({"iss": "http://127.0.0.1:8729/api/auth"})), "issuer")


def test_no_tenant() -> None:
    with door() as c:
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token=sign(omit=("tenant",))), "no tenant")
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token=sign({"tenant": ""})), "empty tenant")


def test_forged_unknown_wrong_type_and_garbage() -> None:
    with door() as c:
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token=sign(key=STRANGER_KEY, kid=TEST_KEY.kid)), "forged")
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token=sign(key=STRANGER_KEY)), "unknown key")
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token=sign(typ="JWT")), "typ JWT")
        assert_sign_in_refusal(rpc(c, "tools/call", LIST, token="wrong-key-0123456789"), "not a token")


def test_missing_tool_scope_403_names_every_scope() -> None:
    auditor = sign({"sub": "u_test_grace", "scope": "ap:read"})
    with door() as c:
        r = rpc(c, "tools/call", {"name": "find_vendor", "arguments": {"vendor_id": "V005"}}, token=auditor)
        assert r.status_code == 403
        challenge = r.headers.get("www-authenticate", "")
        assert 'error="insufficient_scope"' in challenge, challenge
        assert 'scope="ap:read ap:vendors.read"' in challenge, challenge
        assert RESOURCE_METADATA in challenge, challenge
        assert ('error_description="find_vendor needs ap:read ap:vendors.read. '
                'Your role in Brightline does not include it."') in challenge, challenge
        assert rpc(c, "tools/call", LIST, token=auditor).status_code == 200
        none = rpc(c, "tools/call", LIST, token=sign({"scope": "offline_access"}))
        assert none.status_code == 403
        assert 'scope="ap:read"' in none.headers.get("www-authenticate", "")


def test_good_token_reaches_the_tools_locked() -> None:
    seen: list[RequestAuth] = []
    with door(observe=seen.append) as c:
        r = rpc(c, "tools/call", {"name": "find_vendor", "arguments": {"vendor_id": "V005"}}, token=TOKEN)
    assert r.status_code == 200
    assert "isError" not in r.json()["result"] or r.json()["result"]["isError"] is False
    assert seen and seen[-1] == RequestAuth(tenant="org_brightline", person="u_test_ana", app="app_test_client",
                                            scopes=("ap:read", "ap:vendors.read"))
    with pytest.raises(AttributeError):
        seen[-1].tenant = "org_cedar"  # type: ignore[misc]  # the request context is locked


def test_x_tenant_header_is_ignored() -> None:
    seen: list[RequestAuth] = []
    with door(observe=seen.append) as c:
        rpc(c, "tools/call", LIST, token=sign({"tenant": "org_cedar", "sub": "u_test_luis"}), extra={"x-tenant": "org_brightline"})
    assert seen and all(a.tenant == "org_cedar" for a in seen)


def test_foreign_origin_refused_first() -> None:
    with door() as c:
        assert rpc(c, "tools/call", LIST, token="", extra={"origin": "https://attacker.example"}).status_code == 403


def test_rotated_key_fetched_again_at_most_once_per_cooldown(monkeypatch: pytest.MonkeyPatch) -> None:
    clock = {"t": time.monotonic()}
    monkeypatch.setattr(jwt.jwks_client, "time", types.SimpleNamespace(monotonic=lambda: clock["t"], time=time.time))
    url = fake_jwks("rotation")
    with door(jwks_url=url) as c:
        assert rpc(c, "tools/call", LIST, token=sign()).status_code == 200
        assert fetches(url) == 1
        assert rpc(c, "tools/call", LIST, token=sign()).status_code == 200
        assert fetches(url) == 1, "a known key id needs no fetch"
        publish(url, [TEST_KEY.public_jwk, ROTATED_KEY.public_jwk])
        clock["t"] += 31
        assert rpc(c, "tools/call", LIST, token=sign(key=ROTATED_KEY)).status_code == 200
        assert fetches(url) == 2, "an unknown key id makes one new fetch"
        for _ in range(5):
            rpc(c, "tools/call", LIST, token=sign(key=STRANGER_KEY))
        assert fetches(url) == 2, "no new fetch inside the cooldown"


def test_test_key_trusted_only_when_asked() -> None:
    url = fake_jwks("trust", [ROTATED_KEY.public_jwk])  # the sign-in server does not publish the test key
    with door(jwks_url=url, test_signing_key=TEST_SIGNING_KEY_B64) as c:
        assert rpc(c, "tools/call", LIST, token=sign()).status_code == 200
        assert rpc(c, "tools/call", LIST, token=sign(key=ROTATED_KEY)).status_code == 200
    with door(jwks_url=url) as c:
        assert rpc(c, "tools/call", LIST, token=sign()).status_code == 401


def test_validate_token_resource_is_on() -> None:
    from brightline_ap.mcp_server import auth_settings

    settings = auth_settings(issuer=ISSUER, resource=RESOURCE)
    assert settings.validate_token_resource is True
    assert str(settings.resource_server_url) == RESOURCE
