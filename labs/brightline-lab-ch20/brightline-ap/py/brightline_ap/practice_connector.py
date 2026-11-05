"""A local practice connector for Lab 20: the same four read-only tools, over MCP,
on 127.0.0.1 only, reading data/practice/brightline.json.

Use it when your Chapter 19 staging connector is not running (Task 0, route B).
It checks one bearer token, from PRACTICE_TOKEN, so the loop still sends a token
the way it does to the real connector. It is not the real connector: it has no
sign-in server, no companies to keep apart and no database.

    npm run connector:practice          (listens on http://127.0.0.1:8760/mcp)

It reads CONNECTOR_TOKEN from .secrets/connector.env itself, so no agent ever reads
the token. PRACTICE_TOKEN overrides it (the tests use that). PRACTICE_BROKEN names
tools that always answer "try again", to test a loop's stops (Lab 20 Task 8, Lab 21 Task 7).
"""
from __future__ import annotations

import json
import os
import pathlib
import secrets
from typing import Any

import uvicorn
from mcp.server.mcpserver import MCPServer
from mcp.server.mcpserver.exceptions import ToolError  # its message reaches the model
from starlette.types import ASGIApp, Receive, Scope, Send

ROOT = pathlib.Path(__file__).parents[2]
BROKEN = {t.strip() for t in os.environ.get("PRACTICE_BROKEN", "").split(",") if t.strip()}
DATA = json.loads((ROOT / "data/practice/brightline.json").read_text())
server = MCPServer(name="brightline-ap-practice", version="0.20.0")


@server.tool(description="Find a vendor by vendor id (such as V001) or by part of its name.")
def find_vendor(query: str) -> Any:
    if "find_vendor" in BROKEN:
        return "try again"
    q = query.strip().lower()
    return [v for v in DATA["vendors"] if q == v["vendor_id"].lower() or q in v["name"].lower()]


@server.tool(description="List unpaid invoices, filtered by vendor id and a last due date (YYYY-MM-DD). Pass null for a filter you do not need.")
def list_open_invoices(vendor_id: str | None, due_by: str | None) -> Any:
    if "list_open_invoices" in BROKEN:
        return "try again"
    rows = DATA["invoices"]
    if vendor_id:
        rows = [r for r in rows if r["vendor_id"] == vendor_id]
    if due_by:
        rows = [r for r in rows if r["due_date"] <= due_by]
    return sorted(rows, key=lambda r: r["due_date"])


@server.tool(description="Get the purchase order matched to one invoice, by invoice number (such as INV-8303).")
def get_purchase_order(invoice_number: str) -> Any:
    if "get_purchase_order" in BROKEN:
        return "try again"
    invoice = next((i for i in DATA["invoices"] if i["invoice_number"] == invoice_number), None)
    if invoice is None:
        raise ToolError(f"No invoice {invoice_number}. Check the number with list_open_invoices.")
    if invoice["po_number"] is None:
        raise ToolError(f"{invoice_number} has no purchase order.")
    return next(p for p in DATA["purchase_orders"] if p["po_number"] == invoice["po_number"])


@server.tool(description="Search the AP policy. Returns up to three passages, each with a citation.")
def search_policy(query: str) -> Any:
    if "search_policy" in BROKEN:
        return "try again"
    words = {w for w in query.lower().split() if len(w) > 3}
    scored = [(sum(w in p["text"].lower() for w in words), p) for p in DATA["policy"]]
    return [p for score, p in sorted(scored, key=lambda s: -s[0]) if score > 0][:3]


class RequireToken:
    """Refuse any request without the practice token, as the real connector refuses one without a sign-in token."""

    def __init__(self, app: ASGIApp, token: str) -> None:
        self.app, self.expected = app, f"Bearer {token}".encode()

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            auth = dict(scope["headers"]).get(b"authorization", b"")
            if not secrets.compare_digest(auth, self.expected):
                await send({"type": "http.response.start", "status": 401, "headers": [(b"content-type", b"text/plain")]})
                await send({"type": "http.response.body", "body": b"401: no valid token"})
                return
        await self.app(scope, receive, send)


def read_token() -> str | None:
    """Read CONNECTOR_TOKEN from .secrets/connector.env without printing it."""
    path = ROOT / ".secrets/connector.env"
    if not path.exists():
        return None
    for line in path.read_text().splitlines():
        if line.startswith("CONNECTOR_TOKEN="):
            return line.split("=", 1)[1].strip()
    return None


def main() -> None:
    token = os.environ.get("PRACTICE_TOKEN") or read_token()
    if not token:
        raise SystemExit("No token: Task 0 writes CONNECTOR_TOKEN to .secrets/connector.env.")
    if BROKEN:
        print(f"practice connector: broken on purpose: {', '.join(sorted(BROKEN))}")
    port = int(os.environ.get("PRACTICE_PORT", "8760"))
    app = RequireToken(server.streamable_http_app(stateless_http=True, json_response=True), token)
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")


if __name__ == "__main__":
    main()
