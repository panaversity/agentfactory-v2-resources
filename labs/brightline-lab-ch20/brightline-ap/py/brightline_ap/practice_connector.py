"""A local practice connector for Lab 20: the same four read-only tools, over MCP,
on 127.0.0.1 only, reading data/practice/brightline.json.

The same tools as your Chapter 19 connector: the names, descriptions and inputs come from
tools/ap-tools.json, which was written from that connector's own tool list, and the answers
have its shapes and its error messages. A field the practice data does not hold, such as a
bank account or a PO date, comes back empty.

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

import base64
import json
import os
import pathlib
import re
import secrets
from typing import Annotated, Any

import uvicorn
from mcp.server.mcpserver import MCPServer
from mcp.server.mcpserver.exceptions import ToolError  # its message reaches the model
from pydantic import Field
from starlette.types import ASGIApp, Receive, Scope, Send

ROOT = pathlib.Path(__file__).parents[2]
BROKEN = {t.strip() for t in os.environ.get("PRACTICE_BROKEN", "").split(",") if t.strip()}
DATA = json.loads((ROOT / "data/practice/brightline.json").read_text())
TOOLS = {t["name"]: t for t in json.loads((ROOT / "tools/ap-tools.json").read_text())}
server = MCPServer(name="brightline-ap-practice", version="0.20.0")


def described(tool: str, field: str) -> Any:
    """An input's description, word for word from tools/ap-tools.json."""
    return Field(description=TOOLS[tool]["input_schema"]["properties"][field]["description"])


def unknown_vendor(vendor_id: str) -> str:
    ids = sorted(v["vendor_id"] for v in DATA["vendors"])
    return f"No vendor {vendor_id}. Known vendor ids are {ids[0]} to {ids[-1]}. To search by name, call find_vendor with name."


@server.tool(description=TOOLS["find_vendor"]["description"])
def find_vendor(
    vendor_id: Annotated[str | None, described("find_vendor", "vendor_id")] = None,
    name: Annotated[str | None, described("find_vendor", "name")] = None,
) -> Any:
    if "find_vendor" in BROKEN:
        return "try again"
    if (vendor_id is None) == (name is None):
        raise ToolError("Give exactly one of vendor_id or name.")
    if name is not None and not 2 <= len(name.strip()) <= 60:
        raise ToolError("name must be 2 to 60 characters.")
    if vendor_id is not None:
        found = [v for v in DATA["vendors"] if v["vendor_id"] == vendor_id]
        if not found:
            raise ToolError(unknown_vendor(vendor_id))
    else:
        q = (name or "").strip().lower()
        found = [v for v in DATA["vendors"] if q in v["name"].lower()]
        if not found:
            raise ToolError(f"No vendor name contains '{name}'. Try a shorter part of the name, or call find_vendor with vendor_id.")
    return {"vendors": [{"vendor_id": v["vendor_id"], "vendor_name": v["name"], "terms": v["terms"],
                         "bank_account_last4": "", "note": None} for v in found]}


def open_handle(page: str) -> dict[str, Any] | None:
    try:
        state = json.loads(base64.urlsafe_b64decode(page + "=" * (-len(page) % 4)))
        return state if isinstance(state, dict) and state.get("v") == 1 else None
    except ValueError:
        return None


@server.tool(description=TOOLS["list_open_invoices"]["description"])
def list_open_invoices(
    vendor_id: Annotated[str | None, described("list_open_invoices", "vendor_id")] = None,
    due_on_or_before: Annotated[str | None, described("list_open_invoices", "due_on_or_before")] = None,
    page_size: Annotated[int | None, described("list_open_invoices", "page_size")] = None,
    page: Annotated[str | None, described("list_open_invoices", "page")] = None,
) -> Any:
    if "list_open_invoices" in BROKEN:
        return "try again"
    offset = 0
    if page is not None:
        if vendor_id is not None or due_on_or_before is not None or page_size is not None:
            raise ToolError("Pass page alone. The page handle already holds the filter and page size.")
        state = open_handle(page)
        if state is None:
            raise ToolError("This page handle is not valid for this caller. Call list_open_invoices again without page to start from the first page.")
        vendor_id, due_on_or_before = state["vendor_id"], state["due_on_or_before"]
        offset, size = int(state["offset"]), int(state["page_size"])
    else:
        if due_on_or_before is not None and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", due_on_or_before):
            raise ToolError(f"due_on_or_before must be a date as YYYY-MM-DD, such as 2027-03-12. Got '{due_on_or_before}'.")
        if page_size is not None and not 1 <= page_size <= 10:
            raise ToolError("page_size must be 1 to 10.")
        size = page_size or 5
    if vendor_id is not None and vendor_id not in {v["vendor_id"] for v in DATA["vendors"]}:
        raise ToolError(unknown_vendor(vendor_id))
    rows = [r for r in DATA["invoices"]
            if (vendor_id is None or r["vendor_id"] == vendor_id)
            and (due_on_or_before is None or (r["due_date"] is not None and r["due_date"] <= due_on_or_before))]
    rows.sort(key=lambda r: r["invoice_number"])
    shown = rows[offset: offset + size]
    next_offset = offset + len(shown)
    next_page = None
    if next_offset < len(rows):
        state = {"v": 1, "vendor_id": vendor_id, "due_on_or_before": due_on_or_before, "offset": next_offset, "page_size": size}
        next_page = base64.urlsafe_b64encode(json.dumps(state).encode()).decode().rstrip("=")
    invoices = [{"invoice_number": r["invoice_number"], "vendor_id": r["vendor_id"], "invoice_date": None,
                 "due_date": r["due_date"], "amount_cents": r["amount_cents"]} for r in shown]
    return {"invoices": invoices, "total_count": len(rows), "next_page": next_page}


@server.tool(description=TOOLS["get_purchase_order"]["description"])
def get_purchase_order(
    po_number: Annotated[str | None, described("get_purchase_order", "po_number")] = None,
    invoice_number: Annotated[str | None, described("get_purchase_order", "invoice_number")] = None,
) -> Any:
    if "get_purchase_order" in BROKEN:
        return "try again"
    if (po_number is None) == (invoice_number is None):
        raise ToolError("Give exactly one of po_number or invoice_number.")
    if po_number is not None:
        po = next((p for p in DATA["purchase_orders"] if p["po_number"] == po_number), None)
        if po is None:
            numbers = sorted(p["po_number"] for p in DATA["purchase_orders"])
            raise ToolError(f"No purchase order {po_number}. Purchase orders run from {numbers[0]} to {numbers[-1]}.")
        invoice = next((i for i in DATA["invoices"] if i["po_number"] == po_number), None)
        if invoice is None:
            raise ToolError(f"Purchase order {po_number} names no invoice in the AP data. Tell the AP lead.")
    else:
        invoice = next((i for i in DATA["invoices"] if i["invoice_number"] == invoice_number), None)
        if invoice is None:
            raise ToolError(f"No invoice {invoice_number} in the AP data. Check the number, or call list_open_invoices to see open invoices.")
        if invoice["po_number"] is None:
            raise ToolError(f"{invoice_number} has no purchase order.")
        po = next(p for p in DATA["purchase_orders"] if p["po_number"] == invoice["po_number"])
    difference = invoice["amount_cents"] - po["amount_cents"]
    return {
        "po_number": po["po_number"], "vendor_id": po["vendor_id"], "po_date": None,
        "po_amount_cents": po["amount_cents"],
        "invoice_number": invoice["invoice_number"], "invoice_amount_cents": invoice["amount_cents"],
        "match": "matched" if difference == 0 else "over_po" if difference > 0 else "under_po",
        "difference_cents": difference,
        "approval_threshold_cents": po["approval_threshold_cents"],
        "needs_approval": invoice["amount_cents"] >= po["approval_threshold_cents"],
    }


@server.tool(description=TOOLS["search_policy"]["description"])
def search_policy(
    query: Annotated[str, described("search_policy", "query")],
    limit: Annotated[int | None, described("search_policy", "limit")] = None,
) -> Any:
    if "search_policy" in BROKEN:
        return "try again"
    if not 2 <= len(query.strip()) <= 200:
        raise ToolError("query must be 2 to 200 characters.")
    if limit is not None and not 1 <= limit <= 5:
        raise ToolError("limit must be 1 to 5.")
    # Not search by meaning, as the real connector's is: a count of shared words, which is enough for practice.
    words = {w for w in query.lower().split() if len(w) > 3}
    scored = sorted(((sum(w in p["text"].lower() for w in words), p) for p in DATA["policy"]), key=lambda s: -s[0])
    found = [(score, p) for score, p in scored if score > 0][: limit or 3]
    if not found:
        return {"passages": [], "abstained": True,
                "message": "No policy passage is close enough to this question. Say that the policies do not answer it, and ask the AP lead."}
    passages = []
    for score, p in found:
        file, line = p["citation"].rsplit(":", 1)
        passages.append({"document": None, "file": file, "section": None, "line": int(line), "line_end": int(line),
                         "text": p["text"], "similarity": round(score / len(words), 3)})
    return {"passages": passages, "abstained": False, "message": None}


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
