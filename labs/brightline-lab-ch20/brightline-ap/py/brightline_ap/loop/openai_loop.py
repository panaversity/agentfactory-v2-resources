"""The same agent loop on the OpenAI Responses API (Concepts 20.6 and 20.7).

Stateless, like the Claude loop: store is False, there is no previous_response_id,
and this file builds and sends the whole input list on every call.
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Callable, Protocol

from openai.types.responses import Response

from .limits import Limits, Prices, RunMeter, TokenCount
from .tools import RunTool, ToolOutcome, openai_tools
from .trace import Tracer


class ResponsesClient(Protocol):
    @property
    def responses(self) -> Any: ...


@dataclass
class LoopResult:
    stop: str
    answer: str
    turns: int
    cost_usd: float
    input: list[Any]  # the whole input list, as sent


def finish_reason(response: Response) -> str:
    """The trace's finish reason. This API has no stop reason, so it is worked out from
    the response: a function call means "tool_call", a cut-short response "length"."""
    if response.status == "incomplete":
        return "length"
    if response.status != "completed":
        return str(response.status)
    return "tool_call" if any(i.type == "function_call" for i in response.output) else "stop"


async def run_openai_loop(
    *, client: ResponsesClient, model: str, instructions: str, question: str, run_tool: RunTool,
    limits: Limits, prices: Prices, open_model: bool = False, tracer: Tracer | None = None,
    log: Callable[[str, Any], None] | None = None,
) -> LoopResult:
    tracer = tracer or Tracer()
    meter = RunMeter(limits, prices)
    input_items: list[Any] = [{"role": "user", "content": question}]
    answer = ""
    turn = 0

    while True:
        turn += 1
        if limit_stop := meter.before_turn(turn):
            return LoopResult(limit_stop, answer, turn - 1, meter.spent, input_items)

        # Step 1. Call the model. Instructions go on every request: nothing is kept for us.
        request: dict[str, Any] = {
            "model": model,
            "instructions": instructions,
            "input": input_items,
            "tools": openai_tools(),
            "tool_choice": "auto",
            "store": False,  # keep nothing on the provider's side: the list is ours
            "max_output_tokens": 4096,
        }
        if not open_model:
            request["include"] = ["reasoning.encrypted_content"]  # explicit, and harmless
        if log:
            log("request", request)
        with tracer.model_call("openai", model) as attrs:
            response: Response = await client.responses.create(**request)
            attrs["gen_ai.response.finish_reasons"] = [finish_reason(response)]  # a list, as the conventions define it
            attrs["gen_ai.usage.input_tokens"] = response.usage.input_tokens if response.usage else 0
            attrs["gen_ai.usage.output_tokens"] = response.usage.output_tokens if response.usage else 0
        if log:
            log("response", response)
        u = response.usage
        cached = u.input_tokens_details.cached_tokens if u else 0
        written = u.input_tokens_details.cache_write_tokens if u else 0
        meter.add_usage(TokenCount(
            input=(u.input_tokens if u else 0) - cached - written,
            output=u.output_tokens if u else 0,
            cache_write=written,
            cache_read=cached,
        ))

        # Step 2. Keep every item the model produced, unchanged, reasoning items included.
        input_items += list(response.output)
        answer = "".join(part.text for item in response.output if item.type == "message"
                         for part in item.content if part.type == "output_text")

        # Step 3. Stop when the model asked for no tool, or when the response was cut short.
        calls = [i for i in response.output if i.type == "function_call"]
        if response.status == "incomplete":
            reason = response.incomplete_details.reason if response.incomplete_details else "unknown"
            return LoopResult(f"incomplete: {reason}", answer, turn, meter.spent, input_items)
        if response.status != "completed":
            return LoopResult(str(response.status), answer, turn, meter.spent, input_items)
        if not calls:
            return LoopResult("done", answer, turn, meter.spent, input_items)

        # Step 4. Run each call. Arguments arrive as a JSON string, so parse them first.
        for call in calls:
            with tracer.tool_call(call.name, call.call_id) as span:
                try:
                    outcome = await run_tool(call.name, json.loads(call.arguments))
                except Exception as error:
                    outcome = ToolOutcome(ok=False, text=f"The tool failed: {error}")
                if not outcome.ok:
                    span["error.type"] = "tool_error"  # the trace shows which tool failed (20.10)
            # Step 5. One output per call_id. This API has no error flag, so the text says so.
            input_items.append({"type": "function_call_output", "call_id": call.call_id,
                                "output": outcome.text if outcome.ok else f"ERROR: {outcome.text}"})
