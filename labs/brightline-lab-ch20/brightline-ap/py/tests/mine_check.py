"""Task 5b: the recorded responses that check the lab's loop, run against your own (brightline_ap/loop/mine.py).

No network and no cost. Run it with npm run test:mine:py. The file name does not start with test_, so
npm run test:loop:py and npm run test:py leave it out: your loop starts empty. Each test's name says which
part of your plan it checks.
"""
from __future__ import annotations

import asyncio
import json
import pathlib
from typing import Any

from anthropic.types import Message

from brightline_ap.loop.claude_loop import LoopResult
from brightline_ap.loop.limits import Limits, Prices
from brightline_ap.loop.mine import run_my_loop
from brightline_ap.loop.tools import RunTool, ToolOutcome

FIX = pathlib.Path(__file__).parents[2] / "tests/fixtures/loop"


def fixture(name: str) -> list[dict[str, Any]]:
    return json.loads((FIX / f"{name}.json").read_text())


def plain(value: Any) -> Any:
    """What the SDK would serialize: pydantic objects become the fields they were made with."""
    return json.loads(json.dumps(value, default=lambda o: o.model_dump(mode="json", exclude_unset=True)))


class Recorded:
    """A stand-in client: returns recorded responses in order, and keeps a copy of every request."""

    def __init__(self, name: str) -> None:
        self.queue = [Message.model_validate(r) for r in fixture(name)]
        self.requests: list[dict[str, Any]] = []
        self.messages = self

    async def create(self, **request: Any) -> Message:
        self.requests.append(plain(request))
        if not self.queue:
            raise RuntimeError("no more recorded responses: the loop called the model too often")
        return self.queue.pop(0)


async def throws(name: str, tool_input: Any) -> ToolOutcome:
    if name == "get_purchase_order" and tool_input.get("invoice_number") == "INV-8316":
        raise RuntimeError("No purchase order for INV-8316.")
    if name == "search_policy":
        return ToolOutcome(True, "try again")
    return ToolOutcome(True, '[{"invoice_number":"INV-8301"}]')


async def says_so(name: str, tool_input: Any) -> ToolOutcome:
    """Returns ok=False for INV-8316, as the connector does for a tool error."""
    if name == "get_purchase_order" and tool_input.get("invoice_number") == "INV-8316":
        return ToolOutcome(False, "No purchase order for INV-8316.")
    return await throws(name, tool_input)


INSTRUCTIONS = "You answer AP questions."
LIMITS = Limits(max_turns=6, max_cost_usd=0.25, max_seconds=120)
PRICES = Prices(input=3, output=15, cache_write=3.75, cache_read=0.3)  # made-up test prices


def mine(name: str, question: str = "q", run_tool: RunTool = throws,
         limits: Limits = LIMITS) -> tuple[LoopResult, list[dict[str, Any]]]:
    client = Recorded(name)
    result = asyncio.run(run_my_loop(client=client, model="claude-sonnet-5-5", instructions=INSTRUCTIONS,
                                     question=question, run_tool=run_tool, limits=limits, prices=PRICES))
    return result, client.requests


def test_your_stops_turn_limit() -> None:
    r, reqs = mine("claude-try-again", "Is there an early-payment discount?")
    assert r.stop == "turn_limit" and len(reqs) == 6


def test_your_stops_cost_cap() -> None:
    r, reqs = mine("claude-try-again", limits=Limits(max_turns=6, max_cost_usd=0.01, max_seconds=120))
    assert r.stop == "cost_cap" and len(reqs) < 6


def test_step_1_call_sends_instructions_question_and_tools() -> None:
    _, reqs = mine("claude-one-tool", "Which invoices are due this week?")
    first = reqs[0]
    assert first["model"] == "claude-sonnet-5-5" and first["system"] == INSTRUCTIONS
    assert first["messages"] == [{"role": "user", "content": "Which invoices are due this week?"}]
    assert [t["name"] for t in first["tools"]] == ["find_vendor", "list_open_invoices", "get_purchase_order",
                                                   "search_policy"]
    assert not {"temperature", "top_p", "top_k"} & set(first)


def test_step_2_keep_sends_the_model_entry_back_unchanged() -> None:
    _, reqs = mine("claude-one-tool")
    second = reqs[1]["messages"]
    assert len(second) == 3  # the question, the model's entry, your results
    assert second[1] == {"role": "assistant", "content": fixture("claude-one-tool")[0]["content"]}


def test_step_3_check_goes_round_once_then_ends_at_end_turn() -> None:
    r, reqs = mine("claude-one-tool", "Which invoices are due this week?")
    assert (r.stop, r.turns, len(reqs)) == ("end_turn", 2, 2)
    assert "Ten invoices" in r.answer


def test_step_3_check_ends_on_any_other_stop_reason() -> None:
    for name, stop in [("claude-refusal", "refusal"), ("claude-max-tokens", "max_tokens")]:
        r, reqs = mine(name)
        assert r.stop == stop and len(reqs) == 1


def test_step_4_run_a_failed_tool_still_gets_an_error_result() -> None:
    for run_tool in (throws, says_so):
        r, reqs = mine("claude-parallel-one-fails", run_tool=run_tool)
        assert r.stop == "end_turn"
        failed = reqs[1]["messages"][-1]["content"][1]  # your newest entry
        assert failed["type"] == "tool_result" and failed["tool_use_id"] == "toolu_01Lab20B2"
        assert failed["is_error"] is True


def test_step_5_return_one_result_per_call_matched_by_id_in_one_entry() -> None:
    _, reqs = mine("claude-parallel-one-fails")
    entry = reqs[1]["messages"][-1]  # your newest entry
    assert entry["role"] == "user"
    assert [b["type"] for b in entry["content"]] == ["tool_result", "tool_result"]
    assert [b["tool_use_id"] for b in entry["content"]] == ["toolu_01Lab20B1", "toolu_01Lab20B2"]
    assert not entry["content"][0].get("is_error", False)
