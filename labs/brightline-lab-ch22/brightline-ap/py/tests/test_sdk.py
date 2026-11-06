"""Offline tests for Lab 21: no model, no network, no key. They check the rules and the options you read."""

import os
from pathlib import Path
from typing import Any, cast

import pytest

from brightline_ap.sdk.claude_agent import WorkerSettings as ClaudeSettings, claude_options, isolate_environment, worker_env
from brightline_ap.sdk.openai_agent import WorkerSettings as OpenAISettings, build_worker
from brightline_ap.sdk.policy import Decision, cites_policy_line, decide_tool, parse_args

ROOT = Path(__file__).resolve().parents[2]


@pytest.fixture(autouse=True)
def run_from_the_repository_root(monkeypatch):
    # Lab 21 reads its prompt and config from the repository root. Lab 20 runs its tests from py/, so move there first
    monkeypatch.chdir(ROOT)


CLAUDE = ClaudeSettings("http://127.0.0.1:8760/mcp", "t", "m", 8, 0.1, 120, False)


def test_rule1_allows_one_named_invoice_with_a_reason():
    assert decide_tool("mcp__local__flag_invoice", {"invoice_number": "INV-8316", "reason": "No purchase order on file."}) == Decision(True)


@pytest.mark.parametrize("tool_input", [{"invoice_number": "ALL", "reason": "check everything"},
                                        {"invoice_number": "INV-8316", "reason": "why"}])
def test_rule1_denies_a_bad_flag(tool_input):
    assert decide_tool("flag_invoice", tool_input).allow is False


def test_rule1_denies_any_other_tool_with_a_message():
    assert decide_tool("WebFetch", {"url": "https://example.com"}) == Decision(False, "Denied: WebFetch is not one of this worker's tools.")


@pytest.mark.parametrize("answer,expected", [("Pay it once it matches its PO (po-matching.md:5).", True),
                                             ("Yes.", False), ("See po-matching.md line 9.", False)])
def test_rule2_needs_a_citation(answer, expected):
    assert cites_policy_line(answer) is expected


def test_first_sdk_turns_built_ins_off_and_reads_nothing_from_this_computer():
    o = claude_options(CLAUDE, lambda _: None)
    assert o.tools == [] and o.setting_sources == [] and o.strict_mcp_config is True
    assert o.permission_mode == "default"
    assert o.allowed_tools == [f"mcp__brightline__{t}" for t in ["find_vendor", "list_open_invoices", "get_purchase_order", "search_policy"]]


def test_first_sdk_keeps_the_limits_and_writes_no_session_file():
    o = claude_options(CLAUDE, lambda _: None)
    assert (o.max_turns, o.max_budget_usd) == (8, 0.1)
    assert o.extra_args == {"no-session-persistence": None}
    servers = cast(dict[str, Any], o.mcp_servers)
    assert servers["brightline"]["headers"] == {"Authorization": "Bearer t"}


def test_worker_env_drops_other_variables():
    os.environ["SOMETHING_PRIVATE"] = "x"
    assert "SOMETHING_PRIVATE" not in worker_env()


def test_second_sdk_stores_nothing_and_has_its_guard_and_approval():
    agent, _ = build_worker(OpenAISettings("http://127.0.0.1:8760/mcp", "t", "m", 8, 120, False), connector=cast(Any, None))
    assert agent.model_settings.store is False
    assert [g.name for g in agent.output_guardrails] == ["must_cite_a_policy_line"]
    assert [t.name for t in agent.tools] == ["flag_invoice"] and cast(Any, agent.tools[0]).needs_approval is True


def test_isolate_environment_trims_this_process_in_python(monkeypatch):
    # In Python the SDK adds env= to this process's own environment, so this is the control that matters (21.9)
    monkeypatch.setenv("SOMETHING_PRIVATE", "x")
    monkeypatch.setenv("HTTPS_PROXY", "http://proxy.example:8080")
    saved = dict(os.environ)
    try:
        isolate_environment()
        assert "SOMETHING_PRIVATE" not in os.environ
        assert os.environ["HTTPS_PROXY"] == "http://proxy.example:8080"
    finally:
        os.environ.clear()
        os.environ.update(saved)


def test_broken_tool_arguments_are_denied_not_crashed():
    assert parse_args("{not json") == {}
    assert decide_tool("flag_invoice", parse_args("{not json")).allow is False
