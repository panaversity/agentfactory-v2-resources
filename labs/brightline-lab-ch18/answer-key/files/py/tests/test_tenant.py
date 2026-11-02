"""The seven request-context rules (18.11, 18.12, F9) in Python, written before the code (Lab 18, Task 9c).

The same cases as servers/ap-ts/test/tenant.test.ts, with the same words.
"""

from __future__ import annotations

import json
from collections.abc import Iterator
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
from pathlib import Path
from typing import Any

from mcp.server.transport_security import TransportSecuritySettings
from starlette.testclient import TestClient

from brightline_ap.connector import Deps, build_server, seal_handle
from brightline_ap.mcp_server import FileData, create_app
from tests.test_connector import HANDLE_KEY, START_MS, rpc
from tests.tokens import DEFAULT_JWKS, ISSUER, RESOURCE, sign

SIGN_IN = "Sign in to use the Brightline AP connector."
NO_DATA_CEDAR = "No AP data is connected for Cedar Ridge Supply yet."
COMPANY_INPUT = "Unknown input company. The company comes only from your sign-in, never from a tool input."
BELONGS = "This page handle belongs to another person or company. Call again without page."
INVALID = "This page handle is not valid for this caller. Call list_open_invoices again without page to start from the first page."
PERSON_LIMIT = "Too many calls from you to the Brightline AP connector. Wait a minute and try again."
COMPANY_LIMIT = "Too many calls from Brightline to the Brightline AP connector. Wait a minute and try again."
NEW_HANDLE_KEY = "ICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj8"

ANA = sign({"tenant": "org_brightline", "sub": "u_test_ana"})
PRIYA = sign({"tenant": "org_brightline", "sub": "u_test_priya"})
LUIS = sign({"tenant": "org_cedar", "sub": "u_test_luis"})
CI = sign({"tenant": "org_conformance", "sub": "ci_test", "client_id": "ci_test", "azp": "ci_test"})

ARGS: dict[str, dict[str, Any]] = {
    "find_vendor": {"vendor_id": "V005"},
    "list_open_invoices": {},
    "get_purchase_order": {"po_number": "PO-7003"},
    "search_policy": {"query": "purchase order"},
}


@contextmanager
def copy(**extra: Any) -> Iterator[TestClient]:
    app = create_app(handle_key=extra.pop("handle_key", HANDLE_KEY), issuer=ISSUER, resource=RESOURCE, jwks_url=DEFAULT_JWKS,
                     now_ms=lambda: START_MS, **extra)
    with TestClient(app, base_url="http://127.0.0.1:8718") as client:
        yield client


def tool(client: TestClient, token: str, name: str, args: dict[str, Any], headers: dict[str, str] | None = None) -> Any:
    return rpc(client, "tools/call", {"name": name, "arguments": args}, token=token, extra=headers)


def result(response: Any) -> dict[str, Any]:
    assert response.status_code == 200, response.text
    return response.json()["result"]


def text_of(response: Any) -> str:
    return result(response)["content"][0]["text"]


# --- Rule 1 -------------------------------------------------------------------------------------


def test_rule_1_every_tool_refuses_without_a_request_context() -> None:
    server = build_server(Deps(data=FileData(), handle_key=HANDLE_KEY, now_ms=lambda: START_MS))
    app = server.streamable_http_app(json_response=True, transport_security=TransportSecuritySettings(enable_dns_rebinding_protection=False))
    with TestClient(app, base_url="http://127.0.0.1") as client:
        for name, args in ARGS.items():
            r = result(tool(client, "", name, args))
            assert r.get("isError") is True, f"{name} answered without a request context"
            assert r["content"][0]["text"] == SIGN_IN, name


def test_rule_1_the_context_is_locked() -> None:
    seen: list[Any] = []
    with copy(observe=seen.append) as c:
        for name, args in ARGS.items():
            assert tool(c, ANA, name, args).status_code == 200
    assert len(seen) == 4
    for auth in seen:
        try:
            auth.tenant = "org_cedar"
            raise AssertionError("the request context could be changed")
        except AttributeError:
            pass
        assert auth.tenant == "org_brightline"


# --- Rule 2 -------------------------------------------------------------------------------------


def test_rule_2_two_companies_at_once_200_times() -> None:
    with copy() as c:
        def pair(_: int) -> tuple[Any, Any]:
            return tool(c, ANA, "list_open_invoices", {}), tool(c, LUIS, "list_open_invoices", {})
        with ThreadPoolExecutor(max_workers=32) as pool:
            pairs = list(pool.map(pair, range(200)))
    wrong = 0
    for brightline, cedar in pairs:
        if result(brightline).get("structuredContent", {}).get("total_count") != 13:
            wrong += 1
        if text_of(cedar) != NO_DATA_CEDAR:
            wrong += 1
    assert wrong == 0, f"{wrong} of 400 answers went to the wrong company"


# --- Rule 3 -------------------------------------------------------------------------------------


def test_rule_3_x_tenant_is_ignored() -> None:
    with copy() as c:
        for name, args in ARGS.items():
            assert text_of(tool(c, LUIS, name, args, {"X-Tenant": "org_brightline"})) == NO_DATA_CEDAR, name


def test_rule_3_a_company_input_is_refused_by_every_tool() -> None:
    with copy() as c:
        for name, args in ARGS.items():
            r = result(tool(c, ANA, name, {**args, "company": "Brightline"}))
            assert r.get("isError") is True, name
            assert r["content"][0]["text"] == COMPANY_INPUT, name


# --- Rule 4 -------------------------------------------------------------------------------------


def first_handle(c: TestClient, token: str) -> str:
    return result(tool(c, token, "list_open_invoices", {"page_size": 5}))["structuredContent"]["next_page"]


def test_rule_4_handles_belong_to_one_person_in_one_company() -> None:
    with copy() as c, copy() as other:
        handle = first_handle(c, ANA)
        assert text_of(tool(c, PRIYA, "list_open_invoices", {"page": handle})) == BELONGS
        assert text_of(tool(c, CI, "list_open_invoices", {"page": handle})) == BELONGS
        page2 = result(tool(other, ANA, "list_open_invoices", {"page": handle}))["structuredContent"]
        assert [i["invoice_number"] for i in page2["invoices"]] == ["INV-8306", "INV-8307", "INV-8308", "INV-8310", "INV-8311"]


def test_rule_4_a_version_1_handle_is_refused() -> None:
    v1 = seal_handle({"v": 1, "vendor_id": None, "due_on_or_before": None, "offset": 5, "page_size": 5,
                      "caller": "org_brightline/u_test_ana", "expires_at": START_MS + 600_000}, HANDLE_KEY)
    with copy() as c:
        assert text_of(tool(c, ANA, "list_open_invoices", {"page": v1})) == INVALID


def test_rule_4_previous_handle_key_opens_but_never_seals() -> None:
    with copy() as old, copy(handle_key=NEW_HANDLE_KEY, handle_key_previous=HANDLE_KEY) as rotated, \
            copy(handle_key=NEW_HANDLE_KEY) as new_only:
        old_handle = first_handle(old, ANA)
        assert result(tool(rotated, ANA, "list_open_invoices", {"page": old_handle})).get("isError") is not True
        new_handle = first_handle(rotated, ANA)
        assert text_of(tool(old, ANA, "list_open_invoices", {"page": new_handle})) == INVALID
        assert text_of(tool(new_only, ANA, "list_open_invoices", {"page": old_handle})) == INVALID


# --- Rule 5 -------------------------------------------------------------------------------------


def test_rule_5_person_then_company_and_another_company_untouched() -> None:
    from brightline_ap.rate_limit import Limits, MemoryRateLimiter
    with copy(limits=Limits(company=MemoryRateLimiter(5, 60), person=MemoryRateLimiter(3, 60))) as c:
        for _ in range(3):
            assert tool(c, ANA, "list_open_invoices", {}).status_code == 200
        fourth = tool(c, ANA, "list_open_invoices", {})
        assert fourth.status_code == 429
        assert fourth.headers["retry-after"] == "60"
        assert fourth.json()["error"]["message"] == PERSON_LIMIT
        for _ in range(2):
            assert tool(c, PRIYA, "list_open_invoices", {}).status_code == 200
        full = tool(c, PRIYA, "list_open_invoices", {})
        assert full.status_code == 429
        # Priya is within her own 3, but Brightline has used its 5 (Ana's refused 4th did not count).
        assert full.json()["error"]["message"] == COMPANY_LIMIT
        jordan = tool(c, sign({"tenant": "org_brightline", "sub": "u_test_jordan"}), "list_open_invoices", {})
        assert jordan.status_code == 429
        assert jordan.json()["error"]["message"] == COMPANY_LIMIT
        for _ in range(3):
            assert tool(c, LUIS, "list_open_invoices", {}).status_code == 200


# --- Rule 6 -------------------------------------------------------------------------------------


def test_rule_6_one_audit_line_per_call_and_no_token_or_content() -> None:
    lines: list[dict[str, Any]] = []
    with copy(log=lines.append) as c:
        tool(c, ANA, "find_vendor", {"vendor_id": "V005"})
    assert len(lines) == 1, lines
    line = lines[0]
    assert sorted(line) == ["app", "company", "event", "ms", "outcome", "person", "tool"]
    assert isinstance(line["ms"], int)
    assert {**line, "ms": 0} == {"event": "tools/call", "company": "org_brightline", "person": "u_test_ana",
                                 "app": "app_test_client", "tool": "find_vendor", "outcome": "ok", "ms": 0}
    recorded = json.dumps(lines)
    for never in (ANA, ANA.split(".")[2], "V005", "Hocking", "2217"):
        assert never not in recorded


def test_rule_6_refusals_and_no_data_are_logged() -> None:
    lines: list[dict[str, Any]] = []
    with copy(log=lines.append) as c:
        tool(c, sign({"sub": "u_test_grace", "scope": "ap:read"}), "find_vendor", {"vendor_id": "V005"})
        tool(c, LUIS, "list_open_invoices", {})
        tool(c, ANA, "get_purchase_order", {"invoice_number": "INV-8310"})
    assert [[x["company"], x["person"], x["tool"], x["outcome"]] for x in lines] == [
        ["org_brightline", "u_test_grace", "find_vendor", "insufficient_scope"],
        ["org_cedar", "u_test_luis", "list_open_invoices", "no_data"],
        ["org_brightline", "u_test_ana", "get_purchase_order", "tool_error"],
    ]


# --- Rule 7 -------------------------------------------------------------------------------------


def test_rule_7_no_data_message_from_every_tool() -> None:
    with copy() as c:
        for tenant, name in (("org_cedar", "Cedar Ridge Supply"), ("org_juniper", "Juniper Trail Outfitters")):
            token = sign({"tenant": tenant, "sub": f"u_test_{tenant}"})
            for tool_name, args in ARGS.items():
                r = result(tool(c, token, tool_name, args))
                assert r.get("isError") is True
                assert r["content"][0]["text"] == f"No AP data is connected for {name} yet."
                assert r.get("structuredContent") is None


class Spy:
    def __init__(self) -> None:
        self.read_paths: list[str] = []
        self.files = FileData()

    async def read(self, path: str) -> str:
        self.read_paths.append(path)
        return await self.files.read(path)


def test_rule_7_data_tenants_decide_the_folder() -> None:
    spy = Spy()
    with copy(data=spy, data_tenants="org_brightline=data,org_conformance=data-conformance") as c:
        assert result(tool(c, CI, "list_open_invoices", {}))["structuredContent"]["total_count"] == 13
    assert spy.read_paths and all(p.startswith("data-conformance/") for p in spy.read_paths), spy.read_paths
    with copy(data_tenants="") as none:
        assert text_of(tool(none, ANA, "list_open_invoices", {})) == "No AP data is connected for Brightline yet."


def test_rule_7_python_worker_reads_ap_data_tenants() -> None:
    entry = (Path(__file__).resolve().parents[2] / "servers" / "ap-py" / "src" / "entry.py").read_text()
    config = (Path(__file__).resolve().parents[2] / "servers" / "ap-py" / "wrangler.jsonc").read_text()
    assert "AP_DATA_TENANTS" in entry
    assert config.count('"AP_DATA_TENANTS": "org_brightline=data,org_conformance=data-conformance"') == 2


