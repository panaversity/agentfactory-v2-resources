"""A local practice connector for Lab 20: the same four read-only tools, over MCP,
on 127.0.0.1 only, reading Brightline's own files.

The same tools as your Chapter 19 connector: the names, descriptions and inputs come from
tools/ap-tools.json, which was written from that connector's own tool list, and the answers
have its shapes and its error messages. It reads the files `npm run tenant:load` loads into
your database, data/*.csv and docs/policies/, so routes A and B answer from one Brightline.
One difference: its policy search weighs shared words, a rare word counting more, where the
real connector searches by meaning, so the order and the scores of the passages can differ.

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
import csv
import json
import math
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
TOOLS = {t["name"]: t for t in json.loads((ROOT / "tools/ap-tools.json").read_text())}
server = MCPServer(name="brightline-ap-practice", version="0.20.0")


def rows(name: str) -> list[dict[str, str]]:
    """One CSV file from data/, the folder `npm run tenant:load -- --folder data` reads."""
    with (ROOT / "data" / name).open(newline="") as f:
        return list(csv.DictReader(f))


VENDORS = rows("vendors.csv")
NOTES: dict[str, str | None] = {r["vendor_id"]: r["note"] or None for r in rows("vendor-notes.csv")}
# Only the last four digits ever leave, as in the real connector (19.11).
LAST4 = {r["vendor_id"]: (r.get("account_last4") or r["account_number"])[-4:] for r in rows("vendor-banking.csv")}
INVOICES: list[dict[str, Any]] = [{**r, "due_date": r["due_date"] or None, "amount_cents": int(r["amount_cents"])}
                                  for r in rows("invoices.csv")]
POS: list[dict[str, Any]] = sorted(({**r, "amount_cents": int(r["amount_cents"]), "invoice_number": r["invoice_number"] or None}
                                    for r in rows("purchase-orders.csv")), key=lambda p: p["po_number"])
THRESHOLD = int(next(r["value"] for r in rows("settings.csv") if r["setting"] == "approval_threshold_cents"))


def policy_passages() -> list[dict[str, Any]]:
    """One passage per policy line, as Lab 19's loader chunks them: no headings, blank lines or Owner: lines."""
    out: list[dict[str, Any]] = []
    with (ROOT / "docs/policies/manifest.csv").open(newline="") as f:
        documents = [d for d in csv.DictReader(f) if d["counts"] == "yes"]
    for d in documents:
        section = ""
        text = (ROOT / "docs/policies" / d["file"]).read_text().replace("\r\n", "\n")
        for number, raw in enumerate(text.split("\n"), 1):
            line = raw.strip()
            if line.startswith("#"):
                section = re.sub(r"^#+\s*", "", line)
            elif line and not re.match(r"^(Owner|From):", line):
                out.append({"document": d["title"], "file": f"docs/policies/{d['file']}", "section": section,
                            "line": number, "line_end": number, "text": line})
    return out


PASSAGES = policy_passages()
STOP = {"a", "an", "the", "is", "are", "be", "of", "to", "for", "and", "or", "in", "on", "by", "it", "its", "do", "does",
        "what", "which", "who", "when", "how", "our", "we", "us", "say", "says", "about", "policy", "policies", "cite",
        "line", "rule", "any", "this", "that", "as", "at", "from", "with", "has", "have", "there"}
SAME = {"without": "no", "missing": "no"}


def words(text: str) -> set[str]:
    """A text's words, lower case, "purchase order" read as "po", plurals as singular."""
    text = re.sub(r"purchase orders?|\bpos\b", "po", text.lower())
    found: list[str] = re.findall(r"[a-z0-9]+", text)
    out: set[str] = set()
    for raw in found:
        w = SAME.get(raw, raw)
        if len(w) > 3 and w.endswith("s"):
            w = w[:-1]
        if w not in STOP:
            out.add(w)
    return out


PASSAGE_WORDS = [words(p["text"]) for p in PASSAGES]


def weight(word: str) -> float:
    """A rare word counts more: the fewer policy lines hold it, the more it weighs."""
    held = sum(word in ws for ws in PASSAGE_WORDS)
    return math.log((len(PASSAGES) + 1) / (held + 1)) + 1


def described(tool: str, field: str) -> Any:
    """An input's description, word for word from tools/ap-tools.json."""
    return Field(description=TOOLS[tool]["input_schema"]["properties"][field]["description"])


def unknown_vendor(vendor_id: str) -> str:
    ids = sorted(v["vendor_id"] for v in VENDORS)
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
        found = [v for v in VENDORS if v["vendor_id"] == vendor_id]
        if not found:
            raise ToolError(unknown_vendor(vendor_id))
    else:
        q = (name or "").strip().lower()
        found = [v for v in VENDORS if q in v["vendor_name"].lower()]
        if not found:
            raise ToolError(f"No vendor name contains '{name}'. Try a shorter part of the name, or call find_vendor with vendor_id.")
    return {"vendors": [{"vendor_id": v["vendor_id"], "vendor_name": v["vendor_name"], "terms": v["terms"],
                         "bank_account_last4": LAST4.get(v["vendor_id"], ""), "note": NOTES.get(v["vendor_id"])}
                        for v in sorted(found, key=lambda v: v["vendor_id"])]}


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
    if vendor_id is not None and vendor_id not in {v["vendor_id"] for v in VENDORS}:
        raise ToolError(unknown_vendor(vendor_id))
    # Open invoices only. A due-date filter leaves out invoices with no due date, as the real query does.
    found = [r for r in INVOICES
             if r["status"] == "open" and (vendor_id is None or r["vendor_id"] == vendor_id)
             and (due_on_or_before is None or (r["due_date"] is not None and r["due_date"] <= due_on_or_before))]
    found.sort(key=lambda r: r["invoice_number"])
    shown = found[offset: offset + size]
    next_offset = offset + len(shown)
    next_page = None
    if next_offset < len(found):
        state = {"v": 1, "vendor_id": vendor_id, "due_on_or_before": due_on_or_before, "offset": next_offset, "page_size": size}
        next_page = base64.urlsafe_b64encode(json.dumps(state).encode()).decode().rstrip("=")
    invoices = [{"invoice_number": r["invoice_number"], "vendor_id": r["vendor_id"], "invoice_date": r["invoice_date"],
                 "due_date": r["due_date"], "amount_cents": r["amount_cents"]} for r in shown]
    return {"invoices": invoices, "total_count": len(found), "next_page": next_page}


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
        po = next((p for p in POS if p["po_number"] == po_number), None)
        if po is None:
            raise ToolError(f"No purchase order {po_number}. Purchase orders run from {POS[0]['po_number']} to {POS[-1]['po_number']}.")
    else:
        if not any(i["invoice_number"] == invoice_number for i in INVOICES):
            raise ToolError(f"No invoice {invoice_number} in the AP data. Check the number, or call list_open_invoices to see open invoices.")
        po = next((p for p in POS if p["invoice_number"] == invoice_number), None)
        if po is None:
            raise ToolError(f"No purchase order for {invoice_number}. Policy: an invoice with no PO is held until the buyer raises one. "
                            "Call search_policy for the exact rule. Tell the AP lead. Do not treat it as ready.")
    invoice = next((i for i in INVOICES if i["invoice_number"] == po["invoice_number"]), None)
    if invoice is None:
        raise ToolError(f"Purchase order {po['po_number']} names no invoice in the AP data. Tell the AP lead.")
    difference = invoice["amount_cents"] - po["amount_cents"]
    return {
        "po_number": po["po_number"], "vendor_id": po["vendor_id"], "po_date": po["po_date"],
        "po_amount_cents": po["amount_cents"],
        "invoice_number": invoice["invoice_number"], "invoice_amount_cents": invoice["amount_cents"],
        "match": "matched" if difference == 0 else "over_po" if difference > 0 else "under_po",
        "difference_cents": difference,
        # The company's own rule, from data/settings.csv, computed here, never by the model.
        "approval_threshold_cents": THRESHOLD,
        "needs_approval": invoice["amount_cents"] >= THRESHOLD,
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
    # Not search by meaning, as the real connector's is: shared words, weighed. Below 0.4, abstain, as it does.
    asked = words(query)
    whole = sum(weight(w) for w in asked) or 1.0
    scored = [(sum(weight(w) for w in asked & ws) / whole, k) for k, ws in enumerate(PASSAGE_WORDS)]
    found = sorted((s for s in scored if s[0] >= 0.4), key=lambda s: (-s[0], s[1]))[: limit or 3]
    if not found:
        return {"passages": [], "abstained": True,
                "message": "No policy passage is close enough to this question. Say that the policies do not answer it, and ask the AP lead."}
    return {"passages": [{**PASSAGES[k], "similarity": round(score, 3)} for score, k in found], "abstained": False, "message": None}


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
