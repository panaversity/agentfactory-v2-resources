"""The connector's front door in Python: check Origin, check the key, then serve MCP.

Run locally, from py/:  uv run --env-file ../servers/ap-py/.dev.vars python -m brightline_ap.mcp_server [port]
(The keys come from `npm run keys`. Never type them on a command line.)
The same app is mounted in the Python Worker (servers/ap-py/src/entry.py).
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import sys
import time
from collections.abc import Callable
from pathlib import Path
from typing import Any

from starlette.types import ASGIApp, Receive, Scope, Send

from mcp.server.transport_security import TransportSecuritySettings

from .connector import POLICY_FILES, DataSource, Deps, build_server

REPO = Path(__file__).resolve().parents[2]
ALLOWED_FILES = {
    "data/vendors.csv", "data/vendor-notes.csv", "data/vendor-banking.csv", "data/invoices.csv", "data/purchase-orders.csv",
    *POLICY_FILES,
}


class FileData:
    """Reads only the files the connector may read, from the repository on disk."""

    async def read(self, path: str) -> str:
        if path not in ALLOWED_FILES:
            raise ValueError(f"{path} is not a file this connector may read")
        return (REPO / path).read_text(encoding="utf-8")


def caller_of(key: str) -> str:
    """First 16 hex characters of SHA-256(key): who is calling, without keeping the key."""
    return hashlib.sha256(key.encode()).hexdigest()[:16]


class KeyCheck:
    """Refuse any request without the right key, before MCP sees it. Records the caller for handles."""

    def __init__(self, app: ASGIApp, token: str) -> None:
        if len(token) < 16:
            raise ValueError("AP_MCP_TOKEN must be set, at least 16 characters")
        self.app, self.token = app, token

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        headers = {k.decode().lower(): v.decode() for k, v in scope["headers"]}
        auth = headers.get("authorization", "")
        key = auth[7:] if auth.startswith("Bearer ") else ""
        if not key or not hmac.compare_digest(key.encode(), self.token.encode()):
            body = json.dumps({"error": "A valid key is required."}).encode()
            await send({"type": "http.response.start", "status": 401, "headers": [
                (b"content-type", b"application/json"), (b"www-authenticate", b'Bearer realm="brightline-ap"')]})
            await send({"type": "http.response.body", "body": body})
            return
        scope.setdefault("state", {})["caller"] = caller_of(key)
        await self.app(scope, receive, send)


def create_app(
    *, token: str, handle_key: str, data: DataSource | None = None,
    allowed_origins: list[str] | None = None, allowed_hosts: list[str] | None = None,
    now_ms: Callable[[], int] | None = None,
) -> Any:
    server = build_server(Deps(data=data or FileData(), handle_key=handle_key, now_ms=now_ms or (lambda: int(time.time() * 1000))))
    security = TransportSecuritySettings(
        # The Host check guards a server on your own computer against DNS rebinding. A deployed
        # server adds its own public host name (the Worker entry passes it), or every call gets 421.
        allowed_hosts=["127.0.0.1", "127.0.0.1:*", "localhost", "localhost:*",
                       *[o.split("://")[-1] for o in (allowed_origins or [])], *(allowed_hosts or [])],
        allowed_origins=["http://127.0.0.1:*", "http://localhost:*", *(allowed_origins or [])],
    )
    # Origin and Host are checked by the SDK's transport security. The key is checked in front of everything.
    mcp_app = server.streamable_http_app(json_response=True, transport_security=security)
    return KeyCheck(mcp_app, token)


def main() -> None:
    import uvicorn

    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8718
    app = create_app(token=os.environ.get("AP_MCP_TOKEN", ""), handle_key=os.environ.get("AP_HANDLE_KEY", ""))
    print(f"brightline-ap (Python) at http://127.0.0.1:{port}/mcp")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")


if __name__ == "__main__":
    main()
