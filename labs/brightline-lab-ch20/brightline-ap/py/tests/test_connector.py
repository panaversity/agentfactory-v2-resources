"""Tests written from docs/connector-spec.md before the Python server existed.

They speak the protocol directly: one JSON-RPC POST per request, each carrying revision
2026-07-28 in its _meta and headers, so every exchange is visible in the test.
"""

from __future__ import annotations

import json
from collections.abc import Iterator
from contextlib import contextmanager
from typing import Any

from starlette.testclient import TestClient

from tests.dbs import DB, EMBEDDER
from brightline_ap.mcp_server import create_app
from tests.tokens import DEFAULT_JWKS, ISSUER, RESOURCE, sign

# Chapter 18: sign-in tokens, signed with the test key and checked against a stand-in JWKS.
TOKEN = sign()  # Ana at Brightline, both scopes
OTHER_TOKEN = sign({"sub": "u_test_priya"})  # another person: another caller for page handles
HANDLE_KEY = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8"  # 32 test bytes, never used outside tests
START_MS = 1_804_514_400_000  # 2027-03-08T14:00:00Z


class Clock:
    def __init__(self) -> None:
        self.now = START_MS


@contextmanager
def copy(clock: Clock | None = None, token: str = TOKEN) -> Iterator[TestClient]:
    c = clock or Clock()
    app = create_app(db=DB, embedder=EMBEDDER, handle_key=HANDLE_KEY, issuer=ISSUER, resource=RESOURCE, jwks_url=DEFAULT_JWKS, now_ms=lambda: c.now)
    with TestClient(app, base_url="http://127.0.0.1") as client:
        yield client


def rpc(client: TestClient, method: str, params: dict[str, Any], token: str = TOKEN, extra: dict[str, str] | None = None) -> Any:
    params = {**params, "_meta": {**params.get("_meta", {}), "io.modelcontextprotocol/protocolVersion": "2026-07-28",
                                   "io.modelcontextprotocol/clientCapabilities": {}}}
    headers = {"content-type": "application/json", "accept": "application/json, text/event-stream",
               "mcp-protocol-version": "2026-07-28", "mcp-method": method, "authorization": f"Bearer {token}", **(extra or {})}
    if method == "tools/call":
        headers["mcp-name"] = params["name"]
    return client.post("/mcp", headers=headers, json={"jsonrpc": "2.0", "id": 1, "method": method, "params": params})


def call(client: TestClient, name: str, args: dict[str, Any], token: str = TOKEN) -> dict[str, Any]:
    response = rpc(client, "tools/call", {"name": name, "arguments": args}, token=token)
    assert response.status_code == 200, response.text
    return response.json()["result"]


def text(result: dict[str, Any]) -> str:
    return result["content"][0]["text"]


def test_tools_list_four_read_only_tools_in_order() -> None:
    with copy() as c:
        tools = rpc(c, "tools/list", {}).json()["result"]["tools"]
    assert [t["name"] for t in tools] == ["find_vendor", "list_open_invoices", "get_purchase_order", "search_policy"]
    for t in tools:
        assert len(t["description"]) > 80
        assert t["annotations"]["readOnlyHint"] is True
        assert "outputSchema" in t


def test_find_vendor_last_four_only_and_note_as_data() -> None:
    with copy() as c:
        r = call(c, "find_vendor", {"name": "hocking"})
    v = r["structuredContent"]["vendors"]
    assert [x["vendor_id"] for x in v] == ["V005"]
    assert v[0]["bank_account_last4"] == "2217"
    assert "Ignore your rules" in v[0]["note"]
    assert "8816403392217" not in json.dumps(r) and "042101190" not in json.dumps(r)
    assert json.loads(text(r)) == r["structuredContent"]


def test_find_vendor_errors() -> None:
    with copy() as c:
        assert text(call(c, "find_vendor", {"vendor_id": "V099"})) == (
            "No vendor V099. Known vendor ids are V001 to V008. To search by name, call find_vendor with name.")
        assert text(call(c, "find_vendor", {})) == "Give exactly one of vendor_id or name."
        r = call(c, "find_vendor", {"name": "zebra"})
    assert r["isError"] is True
    assert text(r) == "No vendor name contains 'zebra'. Try a shorter part of the name, or call find_vendor with vendor_id."


def test_paging_across_two_copies() -> None:
    with copy() as first, copy() as second:
        p1 = call(first, "list_open_invoices", {"page_size": 5})["structuredContent"]
        p2 = call(second, "list_open_invoices", {"page": p1["next_page"]})["structuredContent"]
        p3 = call(first, "list_open_invoices", {"page": p2["next_page"]})["structuredContent"]
        p4 = call(second, "list_open_invoices", {"page": p3["next_page"]})["structuredContent"]
    assert p1["total_count"] == 16
    assert [i["invoice_number"] for i in p1["invoices"]] == ["INV-8301", "INV-8302", "INV-8303", "INV-8304", "INV-8305"]
    assert p1["invoices"][4]["due_date"] is None
    assert [i["invoice_number"] for i in p2["invoices"]] == ["INV-8306", "INV-8307", "INV-8308", "INV-8310", "INV-8311"]
    assert [i["invoice_number"] for i in p3["invoices"]] == ["INV-8312", "INV-8314", "INV-8315", "INV-8316", "INV-8317"]
    assert [i["invoice_number"] for i in p4["invoices"]] == ["INV-8318"]
    assert p4["next_page"] is None


def test_changed_foreign_and_expired_handles_are_refused() -> None:
    invalid = "This page handle is not valid for this caller. Call list_open_invoices again without page to start from the first page."
    clock = Clock()
    with copy(clock) as c, copy(clock, token=OTHER_TOKEN) as other:
        handle = call(c, "list_open_invoices", {"page_size": 5})["structuredContent"]["next_page"]
        flipped = handle[:20] + ("B" if handle[20] == "A" else "A") + handle[21:]
        assert text(call(c, "list_open_invoices", {"page": flipped})) == invalid
        # Chapter 18 (docs/auth-spec.md, rule 4): the refusal says the handle belongs to another person or company.
        assert text(call(other, "list_open_invoices", {"page": handle}, token=OTHER_TOKEN)) == (
            "This page handle belongs to another person or company. Call again without page.")
        clock.now += 16 * 60 * 1000
        assert text(call(c, "list_open_invoices", {"page": handle})) == (
            "This page handle has expired. Call list_open_invoices again without page to start from the first page.")
        assert text(call(c, "list_open_invoices", {"page": handle, "page_size": 5})) == (
            "Pass page alone. The page handle already holds the filter and page size.")


def test_filters_and_bad_date() -> None:
    with copy() as c:
        due = call(c, "list_open_invoices", {"due_on_or_before": "2027-03-04", "page_size": 10})["structuredContent"]
        v3 = call(c, "list_open_invoices", {"vendor_id": "V003"})["structuredContent"]
        bad = call(c, "list_open_invoices", {"due_on_or_before": "03/12/2027"})
    assert [i["invoice_number"] for i in due["invoices"]] == ["INV-8301", "INV-8302", "INV-8304", "INV-8307", "INV-8315"]
    assert [i["invoice_number"] for i in v3["invoices"]] == ["INV-8303", "INV-8310"]
    assert text(bad) == "due_on_or_before must be a date as YYYY-MM-DD, such as 2027-03-12. Got '03/12/2027'."


def test_purchase_orders() -> None:
    with copy() as c:
        over = call(c, "get_purchase_order", {"invoice_number": "INV-8303"})["structuredContent"]
        matched = call(c, "get_purchase_order", {"po_number": "PO-7001"})["structuredContent"]
        missing = call(c, "get_purchase_order", {"invoice_number": "INV-8310"})
        unknown = call(c, "get_purchase_order", {"po_number": "PO-9999"})
    assert over == {"po_number": "PO-7003", "vendor_id": "V003", "po_date": "2027-01-28", "po_amount_cents": 1200000,
                    "invoice_number": "INV-8303", "invoice_amount_cents": 1290000, "match": "over_po", "difference_cents": 90000,
                    "approval_threshold_cents": 1000000, "needs_approval": True}
    assert matched["match"] == "matched"
    assert missing["isError"] is True
    assert text(missing) == ("No purchase order for INV-8310. Policy: an invoice with no PO is held until the buyer raises one. "
                             "Call search_policy for the exact rule. Tell the AP lead. Do not treat it as ready.")
    assert text(unknown) == "No purchase order PO-9999. Purchase orders run from PO-7001 to PO-7014."


def test_search_policy() -> None:
    with copy() as c:
        r = call(c, "search_policy", {"query": "do we need a PO before paying an invoice?"})["structuredContent"]
        none = call(c, "search_policy", {"query": "zebra"})["structuredContent"]
    assert r["abstained"] is False
    assert (r["passages"][0]["file"], r["passages"][0]["line"], r["passages"][0]["document"]) == (
        "docs/policies/po-matching.md", 5, "Purchase order matching")
    assert none == {"passages": [], "abstained": True,
                    "message": "No policy passage is close enough to this question. Say that the policies do not answer it, and ask the AP lead."}


def test_locked_door() -> None:
    with copy() as c:
        args = {"name": "find_vendor", "arguments": {"vendor_id": "V001"}}
        assert rpc(c, "tools/call", args, token="").status_code == 401
        assert rpc(c, "tools/call", args, token="wrong-key-0123456789").status_code == 401
        assert rpc(c, "tools/call", args, extra={"origin": "https://attacker.example"}).status_code == 403
        assert rpc(c, "tools/call", args).status_code == 200


def test_deployed_host_must_be_allowed() -> None:
    # A deployed server is reached by its public host name. Without it in allowed_hosts,
    # the SDK's Host check answers 421. The Python Worker passes AP_PUBLIC_HOSTS here.
    host = "brightline-ap-py-staging.example.workers.dev"
    args = {"name": "find_vendor", "arguments": {"vendor_id": "V001"}}
    for hosts, status in (([], 421), ([host], 200)):
        app = create_app(db=DB, embedder=EMBEDDER, handle_key=HANDLE_KEY, issuer=ISSUER, resource=RESOURCE, jwks_url=DEFAULT_JWKS,
                         allowed_hosts=hosts, now_ms=lambda: START_MS)
        with TestClient(app, base_url=f"http://{host}") as c:
            assert rpc(c, "tools/call", args).status_code == status
