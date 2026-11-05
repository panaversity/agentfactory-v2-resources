"""Lab 20's loop tests in Python. No network.

The first group replays the same recorded responses as tests/loop.test.ts.
The second group runs the real SDK clients against a fake HTTP server, and reads
the JSON that actually goes over the wire.
"""
from __future__ import annotations

import asyncio
import json
import pathlib
from typing import Any

import httpx2 as httpx  # the HTTP library both SDKs use
import pytest
from anthropic import AsyncAnthropic
from anthropic.types import Message
from openai import AsyncOpenAI
from openai.types.responses import Response

from brightline_ap.loop.claude_loop import run_claude_loop
from brightline_ap.loop.limits import Limits, Prices, RunMeter
from brightline_ap.loop.openai_loop import run_openai_loop
from brightline_ap.loop.tools import ToolOutcome
from brightline_ap.loop.trace import Tracer

FIX = pathlib.Path(__file__).parents[2] / "tests/fixtures/loop"


def fixture(name: str) -> list[dict[str, Any]]:
    return json.loads((FIX / f"{name}.json").read_text())


def plain(value: Any) -> Any:
    """What the SDK would serialize: pydantic objects become the fields they were made with."""
    return json.loads(json.dumps(value, default=lambda o: o.model_dump(mode="json", exclude_unset=True)))


class Recorded:
    """A stand-in client: returns recorded responses in order, and keeps a copy of every request."""

    def __init__(self, name: str, kind: str) -> None:
        model = Message if kind == "claude" else Response
        self.queue = [model.model_validate(r) for r in fixture(name)]
        self.requests: list[dict[str, Any]] = []
        self.messages = self.responses = self

    async def create(self, **request: Any) -> Any:
        self.requests.append(plain(request))
        return self.queue.pop(0)


async def tools(name: str, tool_input: Any) -> ToolOutcome:
    if name == "get_purchase_order" and tool_input["invoice_number"] == "INV-8302":
        return ToolOutcome(False, "INV-8302 has no purchase order.")
    if name == "search_policy":
        return ToolOutcome(True, "try again")
    return ToolOutcome(True, '[{"invoice_number":"INV-8301"}]')


BASE: dict[str, Any] = dict(
    instructions="You answer AP questions.", run_tool=tools,
    limits=Limits(max_turns=6, max_cost_usd=0.25, max_seconds=120),
    prices=Prices(input=3, output=15, cache_write=3.75, cache_read=0.3),  # made-up test prices
)


def claude(name: str, question: str = "q", **extra: Any):
    client = Recorded(name, "claude")
    opts = {**BASE, **extra}
    result = asyncio.run(run_claude_loop(client=client, model="claude-sonnet-5-5", question=question, **opts))
    return result, client.requests


def openai(name: str, question: str = "q", **extra: Any):
    client = Recorded(name, "openai")
    opts = {**BASE, **extra}
    result = asyncio.run(run_openai_loop(client=client, model="gpt-6-luna", question=question, **opts))
    return result, client.requests


# Claude loop ------------------------------------------------------------------

def test_claude_one_tool_then_end_turn() -> None:
    r, reqs = claude("claude-one-tool", "Which invoices are due this week?")
    assert (r.stop, r.turns) == ("end_turn", 2)
    second = reqs[1]["messages"]
    assert len(second) == 3
    assert second[2]["content"][0] == {"type": "tool_result", "tool_use_id": "toolu_01Lab20A1",
                                        "content": '[{"invoice_number":"INV-8301"}]', "is_error": False}


def test_claude_echoes_thinking_unchanged() -> None:
    _, reqs = claude("claude-one-tool")
    assert reqs[1]["messages"][1]["content"] == fixture("claude-one-tool")[0]["content"]


def test_claude_one_result_per_call_failure_included() -> None:
    _, reqs = claude("claude-parallel-one-fails")
    results = reqs[1]["messages"][2]["content"]
    assert [b["tool_use_id"] for b in results] == ["toolu_01Lab20B1", "toolu_01Lab20B2"]
    assert [b["is_error"] for b in results] == [False, True]


@pytest.mark.parametrize("name,stop", [("claude-refusal", "refusal"), ("claude-max-tokens", "max_tokens")])
def test_claude_other_stop_reasons(name: str, stop: str) -> None:
    r, reqs = claude(name)
    assert r.stop == stop and len(reqs) == 1


def test_claude_turn_limit_and_cost_cap() -> None:
    r, reqs = claude("claude-try-again")
    assert r.stop == "turn_limit" and len(reqs) == 6
    r, reqs = claude("claude-try-again", limits=Limits(max_turns=6, max_cost_usd=0.01, max_seconds=120))
    assert r.stop == "cost_cap" and len(reqs) < 6


def test_claude_trace_spans() -> None:
    tracer = Tracer()
    claude("claude-parallel-one-fails", tracer=tracer)
    assert [s.name for s in tracer.spans] == ["chat claude-sonnet-5-5", "execute_tool get_purchase_order",
                                              "execute_tool get_purchase_order", "chat claude-sonnet-5-5"]


def test_claude_failed_tool_span_is_an_error() -> None:
    tracer = Tracer()
    claude("claude-parallel-one-fails", tracer=tracer)
    assert [s.status for s in tracer.spans] == ["OK", "OK", "ERROR", "OK"]
    assert tracer.spans[2].attributes["error.type"] == "tool_error"
    assert tracer.spans[0].attributes["gen_ai.response.finish_reasons"] == ["tool_use"]


def test_openai_trace_finish_reason_and_usage() -> None:
    tracer = Tracer()
    openai("openai-one-tool", tracer=tracer)
    chats = [s for s in tracer.spans if s.kind == "CLIENT"]
    assert [s.attributes["gen_ai.response.finish_reasons"] for s in chats] == [["tool_call"], ["stop"]]
    assert isinstance(chats[0].attributes["gen_ai.usage.input_tokens"], int)


# OpenAI loop ------------------------------------------------------------------

def test_openai_stateless_and_reasoning_passed_back() -> None:
    r, reqs = openai("openai-one-tool")
    assert r.stop == "done"
    for q in reqs:
        assert q["store"] is False and "previous_response_id" not in q
    second = reqs[1]["input"]
    assert [i.get("type", "message") for i in second] == ["message", "reasoning", "function_call", "function_call_output"]
    assert second[1] == fixture("openai-one-tool")[0]["output"][0]


def test_openai_one_output_per_call_id() -> None:
    _, reqs = openai("openai-parallel-one-fails")
    outs = [i for i in reqs[1]["input"] if i.get("type") == "function_call_output"]
    assert [o["call_id"] for o in outs] == ["call_lab20_B1", "call_lab20_B2"]
    assert outs[1]["output"].startswith("ERROR:")


def test_openai_incomplete_and_malformed() -> None:
    r, _ = openai("openai-incomplete")
    assert r.stop == "incomplete: max_output_tokens"
    r, reqs = openai("open-malformed-args", open_model=True)
    assert r.stop == "done" and "include" not in reqs[0]
    assert reqs[1]["input"][-1]["output"].startswith("ERROR: The tool failed")


def test_openai_failed_is_not_done() -> None:
    r, _ = openai("openai-failed")
    assert r.stop == "failed"


def test_time_limit() -> None:
    clock = [0.0]
    m = RunMeter(Limits(10, 1, 30), Prices(1, 1, 1, 1), now=lambda: clock[0])
    assert m.before_turn(1) is None
    clock[0] = 31
    assert m.before_turn(2) == "time_limit"


# On the wire: the real SDK clients, a fake server --------------------------------

def wire(name: str) -> tuple[httpx.AsyncClient, list[httpx.Request]]:
    queue, seen = fixture(name), []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(200, json=queue.pop(0), headers={"request-id": f"req_lab20_{len(seen)}"})

    return httpx.AsyncClient(transport=httpx.MockTransport(handler)), seen


def test_wire_claude_sends_the_whole_conversation_and_new_version() -> None:
    http, seen = wire("claude-one-tool")
    client = AsyncAnthropic(api_key="sk-ant-test-not-a-key", http_client=http)
    asyncio.run(run_claude_loop(client=client, model="claude-sonnet-5-5", question="Which invoices are due?", **BASE))
    first, second = (json.loads(r.content) for r in seen)
    assert seen[0].headers["anthropic-version"] == "2026-10-21"
    assert not {"temperature", "top_p", "top_k"} & first.keys()
    assert [m["role"] for m in second["messages"]] == ["user", "assistant", "user"]
    assert second["messages"][1]["content"][0]["signature"] == "EqQBCkYIBxgCKkDsig1"  # thinking, unchanged
    assert second["messages"][2]["content"][0]["type"] == "tool_result"


def test_wire_openai_is_stateless() -> None:
    http, seen = wire("openai-one-tool")
    client = AsyncOpenAI(api_key="sk-test-not-a-key", http_client=http)
    asyncio.run(run_openai_loop(client=client, model="gpt-6-luna", question="Which invoices are due?", **BASE))
    first, second = (json.loads(r.content) for r in seen)
    assert first["store"] is False and second["store"] is False
    assert "previous_response_id" not in second
    assert second["instructions"] == BASE["instructions"]
    assert second["input"][1]["encrypted_content"] == "gAAAAABpLab20encrypted1"
    assert second["input"][3] == {"type": "function_call_output", "call_id": "call_lab20_A1",
                                  "output": '[{"invoice_number":"INV-8301"}]'}


def test_stream_assembles_text_and_tool_input() -> None:
    from pydantic import TypeAdapter
    from anthropic.types import RawMessageStreamEvent
    from brightline_ap.loop.stream import read_claude_stream
    ta: Any = TypeAdapter(RawMessageStreamEvent)
    events = [ta.validate_python(e) for e in fixture("claude-stream-events") if e["type"] != "ping"]

    async def replay():
        for e in events:
            yield e

    pieces: list[str] = []
    out = asyncio.run(read_claude_stream(replay(), pieces.append))
    assert pieces == ["Let me check ", "this week's invoices."]
    assert out.tool_calls == [{"id": "toolu_01Lab20S2", "name": "list_open_invoices",
                               "input": {"vendor_id": None, "due_by": "2027-04-04"}}]
    assert out.stop_reason == "tool_use"


def test_stream_error_mid_stream_reaches_caller() -> None:
    from pydantic import TypeAdapter
    from anthropic.types import RawMessageStreamEvent
    from brightline_ap.loop.stream import read_claude_stream
    ta: Any = TypeAdapter(RawMessageStreamEvent)
    events = [ta.validate_python(e) for e in fixture("claude-stream-events") if e["type"] != "ping"]
    cut = next(i for i, e in enumerate(events) if e.type == "content_block_delta" and e.delta.type == "input_json_delta")

    async def broken():
        for e in events[: cut + 1]:
            yield e
        raise RuntimeError("overloaded_error: the stream ended with an error event")

    try:
        asyncio.run(read_claude_stream(broken()))
    except RuntimeError as error:
        assert "overloaded_error" in str(error)
    else:
        raise AssertionError("the error did not reach the caller")


def test_practice_connector_over_mcp() -> None:
    import os, subprocess, sys, time
    from brightline_ap.loop.tools import connect_to_connector
    env = {**os.environ, "PRACTICE_TOKEN": "test-token-not-secret", "PRACTICE_PORT": "8768"}
    proc = subprocess.Popen([sys.executable, "-m", "brightline_ap.practice_connector"], env=env,
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(50):
            try:
                httpx.post("http://127.0.0.1:8768/mcp")
                break
            except httpx.TransportError:
                time.sleep(0.2)
        assert httpx.post("http://127.0.0.1:8768/mcp").status_code == 401

        async def go() -> tuple[Any, Any]:
            async with connect_to_connector("http://127.0.0.1:8768/mcp", "test-token-not-secret") as run_tool:
                return (await run_tool("find_vendor", {"query": "V003"}),
                        await run_tool("get_purchase_order", {"invoice_number": "INV-8302"}))

        found, missing = asyncio.run(go())
        assert found.ok and "Hocking Valley Pallets" in found.text
        assert not missing.ok and "has no purchase order" in missing.text
    finally:
        proc.terminate()


def test_practice_connector_reads_token_file_and_can_be_broken(tmp_path: Any, monkeypatch: Any) -> None:
    import importlib
    import brightline_ap.practice_connector as pc
    secrets = tmp_path / ".secrets"
    secrets.mkdir()
    (secrets / "connector.env").write_text("CONNECTOR_URL=http://127.0.0.1:8760/mcp\nCONNECTOR_TOKEN=from-the-file\n")
    monkeypatch.setattr(pc, "ROOT", tmp_path)
    assert pc.read_token() == "from-the-file"
    monkeypatch.setenv("PRACTICE_BROKEN", "search_policy")
    pc = importlib.reload(pc)
    assert pc.search_policy("early payment discount") == "try again"
    assert pc.find_vendor("V003")[0]["name"] == "Hocking Valley Pallets"
    monkeypatch.delenv("PRACTICE_BROKEN")
    importlib.reload(pc)


def test_cost_cap_boundary_last_call_can_cross() -> None:
    from brightline_ap.loop.limits import TokenCount
    m = RunMeter(Limits(10, 0.01, 60), Prices(1, 0, 0, 0))  # $1 per million tokens
    m.add_usage(TokenCount(input=9_999, output=0))
    assert m.before_turn(2) is None
    m.add_usage(TokenCount(input=2_000, output=0))
    assert m.spent > 0.01 and m.before_turn(3) == "cost_cap"
    assert RunMeter(Limits(6, 1, 60), Prices(0, 0, 0, 0)).before_turn(6) is None


def test_allow_only_refuses_unlisted_tools() -> None:
    from brightline_ap.loop.tools import allow_only
    guarded = allow_only(tools)

    async def go() -> tuple[ToolOutcome, ToolOutcome]:
        return await guarded("pay_vendor", {"vendor_id": "V001"}), await guarded("find_vendor", {"query": "V001"})

    refused, allowed = asyncio.run(go())
    assert refused == ToolOutcome(False, "Tool pay_vendor is not allowed for this worker.")
    assert allowed.ok
