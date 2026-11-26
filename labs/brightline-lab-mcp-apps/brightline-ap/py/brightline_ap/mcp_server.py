"""The connector's front door in Python (18.6, 18.7, F4 "How the connector does it").

In order: the Origin check (Chapter 17), first; the connector's own document (RFC 9728); the token,
checked by the SDK's bearer middleware with our TokenVerifier (verify_token.py) and
`validate_token_resource=True`; each tool's scope (403 insufficient_scope); then MCP, with the
company, person, app and scopes read from the token only.

Run locally, from py/:
  uv run --env-file ../servers/ap-py/.dev.vars --env-file ../.secrets/test-signing.local.env python -m brightline_ap.mcp_server [port]
(AP_HANDLE_KEY comes from `npm run keys`. Never type a key on a command line.)
The same app is mounted in the Python Worker (servers/ap-py/src/entry.py).
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
from collections.abc import Callable
from typing import Any

from pydantic import AnyHttpUrl
from starlette.routing import Route
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from mcp.server.auth.middleware.bearer_auth import AuthenticatedUser
from mcp.server.auth.routes import build_resource_metadata_url, create_protected_resource_routes
from mcp.server.auth.settings import AuthSettings
from mcp.server.transport_security import TransportSecuritySettings

from .companies import company_name
from .connector import Deps, RequestAuth, build_server, console_log
from .db import ApDatabase, ConnectDatabase
from .embeddings import Embedder, embedder_from_env
from .rate_limit import DEFAULT_COMPANY, DEFAULT_PERSON, Limits, check_limits, memory_limits
from .verify_token import BrightlineTokenVerifier

SIGN_IN = "Sign in to use the Brightline AP connector."
SCOPES = ["ap:read", "ap:vendors.read"]  # every scope this connector knows, as its document lists them
BASE_SCOPES = ["ap:read"]  # every request needs it: the minimum the 401 names
TOOL_SCOPES = {  # docs/auth-spec.md: each call needs ap:read, and find_vendor ap:vendors.read too
    "find_vendor": ["ap:read", "ap:vendors.read"],
    "list_open_invoices": ["ap:read"],
    "get_purchase_order": ["ap:read"],
    "search_policy": ["ap:read"],
}
# Rule 3: input names that claim a company. No tool has one (docs/auth-spec.md).
COMPANY_INPUT = re.compile(r"(company|tenant|org|organization)(_?(id|name))?", re.IGNORECASE)


def company_input_message(name: str) -> str:
    return f"Unknown input {name}. The company comes only from your sign-in, never from a tool input."


def rate_limit_message(over: str, tenant: str) -> str:
    """Rule 5's refusals, word for word from docs/auth-spec.md."""
    if over == "person":
        return "Too many calls from you to the Brightline AP connector. Wait a minute and try again."
    return f"Too many calls from {company_name(tenant)} to the Brightline AP connector. Wait a minute and try again."


async def _json(send: Send, status: int, body_value: Any, extra_headers: list[tuple[bytes, bytes]] | None = None) -> None:
    body = json.dumps(body_value, separators=(",", ":")).encode()
    await send({"type": "http.response.start", "status": status, "headers": [
        (b"content-type", b"application/json"), (b"content-length", str(len(body)).encode()), *(extra_headers or [])]})
    await send({"type": "http.response.body", "body": body})


def auth_settings(*, issuer: str, resource: str) -> AuthSettings:
    """The SDK's resource-server settings. validate_token_resource=True: the SDK itself refuses a token
    whose resource (AccessToken.resource, from `aud`) is not this connector (F4)."""
    return AuthSettings(issuer_url=AnyHttpUrl(issuer), resource_server_url=AnyHttpUrl(resource),
                        required_scopes=BASE_SCOPES, validate_token_resource=True)


def _quoted(value: str) -> str:
    return re.sub(r'[\\"]', lambda m: "\\" + m.group(0), value)


async def _challenge(send: Send, status: int, error: str, description: str, scopes: list[str], metadata_url: str) -> None:
    """The same WWW-Authenticate challenge, in the same order, as the TypeScript SDK writes."""
    header = (f'Bearer error="{error}", error_description="{_quoted(description)}", '
              f'scope="{" ".join(scopes)}", resource_metadata="{metadata_url}"')
    body = json.dumps({"error": error, "error_description": description}).encode()
    await send({"type": "http.response.start", "status": status, "headers": [
        (b"content-type", b"application/json"), (b"content-length", str(len(body)).encode()), (b"www-authenticate", header.encode())]})
    await send({"type": "http.response.body", "body": body})


class ScopeGate:
    """Wraps the SDK's /mcp route, after its bearer middleware has checked the token.

    The Python SDK has no per-tool scope challenge (the TypeScript SDK's requireScopes), so the body
    is read here: a tools/call whose tool needs a scope the token lacks gets 403 insufficient_scope
    naming every scope the call needs, before any tool runs. No token gets the 401 with our wording.
    """

    def __init__(self, app: ASGIApp, metadata_url: str, limits: Limits | None = None,
                 log: Callable[[dict[str, Any]], None] | None = None) -> None:
        self.app, self.metadata_url, self.limits, self.log = app, metadata_url, limits, log or console_log

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        user = scope.get("user")
        if not isinstance(user, AuthenticatedUser):
            await _challenge(send, 401, "invalid_token", SIGN_IN, BASE_SCOPES, self.metadata_url)
            return
        granted = set(user.scopes)
        if not set(BASE_SCOPES) <= granted:
            await _challenge(send, 403, "insufficient_scope", "Insufficient scope", BASE_SCOPES, self.metadata_url)
            return
        claims = user.access_token.claims or {}
        tenant, person = str(claims.get("tenant", "")), str(user.access_token.subject or "")
        tool_header = next((v.decode() for k, v in scope["headers"] if k.lower() == b"mcp-name"), "")

        def audit(outcome: str, tool_name: str) -> None:
            self.log({"event": "tools/call", "company": tenant, "person": person, "app": user.access_token.client_id,
                      "tool": tool_name, "outcome": outcome, "ms": 0})

        # Rule 5: counted per company, with a smaller limit per person inside it.
        over = await check_limits(self.limits, tenant, person) if self.limits is not None else None
        if over is not None:
            audit("rate_limited", tool_header)
            await _json(send, 429, {"jsonrpc": "2.0", "id": None, "error": {"code": -32000, "message": rate_limit_message(over, tenant)}},
                        [(b"retry-after", b"60")])
            return
        if scope.get("method") != "POST":
            await self.app(scope, receive, send)
            return
        chunks: list[bytes] = []
        while True:
            message = await receive()
            if message["type"] != "http.request":
                break
            chunks.append(message.get("body", b""))
            if not message.get("more_body", False):
                break
        body = b"".join(chunks)
        try:
            parsed: Any = json.loads(body)
        except ValueError:
            parsed = None
        requests: list[Any] = parsed if isinstance(parsed, list) else [parsed]  # pyright: ignore[reportUnknownVariableType]
        for request in requests:
            rpc_message: dict[str, Any] = request if isinstance(request, dict) else {}  # pyright: ignore[reportUnknownVariableType]
            if rpc_message.get("method") == "tools/call":
                params: dict[str, Any] = rpc_message.get("params") if isinstance(rpc_message.get("params"), dict) else {}  # pyright: ignore[reportAssignmentType]
                tool = params.get("name")
                arguments: Any = params.get("arguments")
                # Rule 3: a tool input naming a company is refused, the same words from every tool.
                names: list[str] = [str(k) for k in arguments] if isinstance(arguments, dict) else []  # pyright: ignore[reportUnknownVariableType, reportUnknownArgumentType]
                named = next((k for k in names if COMPANY_INPUT.fullmatch(k)), None)
                if named is not None:
                    audit("company_input", str(tool))
                    await _json(send, 200, {"jsonrpc": "2.0", "id": rpc_message.get("id"), "result": {
                        "content": [{"type": "text", "text": company_input_message(named)}], "isError": True}})
                    return
                needed = TOOL_SCOPES.get(str(tool), BASE_SCOPES)
                if not set(needed) <= granted:
                    company = company_name(tenant)
                    audit("insufficient_scope", str(tool))
                    await _challenge(send, 403, "insufficient_scope",
                                     f"{tool} needs {' '.join(needed)}. Your role in {company} does not include it.", needed, self.metadata_url)
                    return
        replayed = False

        async def replay() -> Message:
            nonlocal replayed
            if not replayed:
                replayed = True
                return {"type": "http.request", "body": body, "more_body": False}
            return await receive()

        await self.app(scope, replay, send)


def _origin_allowed(origin: str, allowed: list[str]) -> bool:
    return bool(re.fullmatch(r"http://(127\.0\.0\.1|localhost|\[::1\])(:\d+)?", origin)) or origin in allowed


class FrontDoor:
    """The Origin check, before anything else (F4 step 9): a browser page from another site is refused."""

    def __init__(self, app: ASGIApp, allowed_origins: list[str]) -> None:
        self.app, self.allowed = app, allowed_origins

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            origin = next((v.decode() for k, v in scope["headers"] if k.lower() == b"origin"), None)
            if origin is not None and not _origin_allowed(origin, self.allowed):
                body = b"Forbidden: Origin not allowed"
                await send({"type": "http.response.start", "status": 403, "headers": [(b"content-type", b"text/plain")]})
                await send({"type": "http.response.body", "body": body})
                return
        await self.app(scope, receive, send)


def create_app(
    *, handle_key: str, issuer: str, resource: str, jwks_url: str | None = None, test_signing_key: str | None = None,
    db: ApDatabase, embedder: Embedder, allowed_origins: list[str] | None = None, allowed_hosts: list[str] | None = None,
    now_ms: Callable[[], int] | None = None, observe: Callable[[RequestAuth], None] | None = None,
    handle_key_previous: str | None = None, limits: Limits | None = None,
    log: Callable[[dict[str, Any]], None] | None = None,
) -> Any:
    for name, value in (("AP_HANDLE_KEY", handle_key), ("AP_ISSUER", issuer), ("AP_RESOURCE", resource)):
        if not value:
            raise ValueError(f"{name} must be set")
    settings = auth_settings(issuer=issuer, resource=resource)
    verifier = BrightlineTokenVerifier(issuer=issuer, resource=resource, jwks_url=jwks_url or f"{issuer}/jwks",
                                       test_signing_key=test_signing_key)
    server = build_server(Deps(db=db, embedder=embedder, handle_key=handle_key, now_ms=now_ms or (lambda: int(time.time() * 1000)),
                               observe=observe, handle_key_previous=handle_key_previous, log=log),
                          auth=settings, token_verifier=verifier)
    security = TransportSecuritySettings(
        # The Host check guards a server on your own computer against DNS rebinding. A deployed
        # server adds its own public host name (the Worker entry passes it), or every call gets 421.
        allowed_hosts=["127.0.0.1", "127.0.0.1:*", "localhost", "localhost:*",
                       *[o.split("://")[-1] for o in (allowed_origins or [])], *(allowed_hosts or [])],
        allowed_origins=["http://127.0.0.1:*", "http://localhost:*", *(allowed_origins or [])],
    )
    app = server.streamable_http_app(json_response=True, transport_security=security)
    metadata_url = str(build_resource_metadata_url(AnyHttpUrl(resource)))
    prm_path = metadata_url.split("://", 1)[1].split("/", 1)[1]
    routes = app.router.routes
    for i, route in enumerate(routes):
        if isinstance(route, Route) and route.path == "/" + prm_path:
            # The SDK lists only required_scopes in the document. List every scope this connector knows.
            routes[i] = create_protected_resource_routes(resource_url=AnyHttpUrl(resource), authorization_servers=[AnyHttpUrl(issuer)],
                                                         scopes_supported=SCOPES, resource_name="Brightline AP connector")[0]
        elif isinstance(route, Route) and route.path == "/mcp":
            route.app = ScopeGate(route.app, metadata_url, limits=limits, log=log)
    return FrontDoor(app, allowed_origins or [])


def main() -> None:
    import uvicorn

    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8718
    env = os.environ
    issuer = env.get("AP_ISSUER", "")
    if not env.get("DATABASE_URL_READER"):
        sys.exit("DATABASE_URL_READER is not set. Run npm run db:passwords (field guide F2).")
    app = create_app(
        db=ConnectDatabase(env["DATABASE_URL_READER"]), embedder=embedder_from_env(env),
        handle_key=env.get("AP_HANDLE_KEY", ""), issuer=issuer, resource=env.get("AP_RESOURCE", ""),
        # On your computer the public keys come straight from the sign-in server. With
        # AP_TRUST_TEST_ISSUER=1, tokens signed with the test key are trusted as well.
        jwks_url=f"{issuer}/jwks",
        test_signing_key=env.get("AP_TEST_SIGNING_KEY") if env.get("AP_TRUST_TEST_ISSUER") == "1" else None,
        handle_key_previous=env.get("AP_HANDLE_KEY_PREVIOUS") or None,
        # Rule 5 on your computer: counted in this copy only (calls a minute; the sign-in matrix raises them).
        limits=memory_limits(int(env.get("AP_RATE_LIMIT_COMPANY", DEFAULT_COMPANY)), int(env.get("AP_RATE_LIMIT_PERSON", DEFAULT_PERSON))),
    )
    print(f"brightline-ap (Python) at http://127.0.0.1:{port}/mcp")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")


if __name__ == "__main__":
    main()
