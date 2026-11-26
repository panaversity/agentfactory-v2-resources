"""Lab 20, Task 4: the same screen on the Python connector. The page is the one file the TypeScript
connector serves, the pointer and the page-only tool are the same, and the text answer is unchanged."""

from __future__ import annotations

import hashlib
import json

from brightline_ap.screen_and_skills import PAGE_URI, REPO
from tests.test_connector import call, copy, rpc
from tests.tokens import RESOURCE, sign

LUIS = sign({"tenant": "org_cedar", "sub": "u_test_luis"})


def test_text_first_five_invoices_a_handle_and_the_count_of_all_16() -> None:
    with copy() as c:
        result = call(c, "list_open_invoices", {}, token=LUIS)
    said = json.loads(result["content"][0]["text"])
    assert [i["invoice_number"] for i in said["invoices"]] == ["INV-6201", "INV-6202", "INV-6203", "INV-6204", "INV-6205"]
    assert isinstance(said["next_page"], str) and said["total_count"] == 16
    assert "21,329" not in result["content"][0]["text"]


def test_the_pointer_the_page_only_tool_and_the_shared_page() -> None:
    with copy() as c:
        tools = {t["name"]: t for t in rpc(c, "tools/list", {}, token=LUIS).json()["result"]["tools"]}
        read = rpc(c, "resources/read", {"uri": PAGE_URI}, token=LUIS, extra={"mcp-name": PAGE_URI}).json()["result"]
    assert tools["list_open_invoices"]["_meta"]["ui"]["resourceUri"] == PAGE_URI
    assert tools["next_invoice_page"]["_meta"]["ui"]["visibility"] == ["app"]
    item = read["contents"][0]
    assert item["mimeType"] == "text/html;profile=mcp-app"
    assert item["text"] == (REPO / "ui" / "open-invoices.html").read_text(encoding="utf-8"), "the same file as the TypeScript page"
    assert "csp" not in item["_meta"]["ui"], "the page declares no outside address"
    assert item["_meta"]["ui"]["domain"] == hashlib.sha256(RESOURCE.encode()).hexdigest()[:32] + ".claudemcpcontent.com"


def test_the_page_only_tool_is_checked_like_any_call() -> None:
    marco = sign({"tenant": "org_cedar", "sub": "u_test_marco", "scope": "ap:read"})
    with copy() as c:
        first = call(c, "list_open_invoices", {}, token=marco)["structuredContent"]
        second = call(c, "next_invoice_page", {"page": first["next_page"]}, token=marco)["structuredContent"]
        none = rpc(c, "tools/call", {"name": "next_invoice_page", "arguments": {"page": first["next_page"]}}, token="x" * 24)
    assert [i["invoice_number"] for i in second["invoices"]] == ["INV-6206", "INV-6207", "INV-6208", "INV-6209", "INV-6210"]
    assert none.status_code == 401
