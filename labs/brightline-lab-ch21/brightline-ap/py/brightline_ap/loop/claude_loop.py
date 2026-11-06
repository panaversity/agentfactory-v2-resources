"""The agent loop on the Claude Messages API, with nothing hidden (Concepts 20.1 to 20.5).

Stateless: the whole conversation goes with every request, and this file owns it.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, Protocol

from anthropic.types import Message

from .limits import Limits, Prices, RunMeter, TokenCount
from .tools import RunTool, ToolOutcome, claude_tools
from .trace import Tracer


class MessagesClient(Protocol):
    """Only what the loop uses, so tests can pass a recorded stand-in."""

    @property
    def messages(self) -> Any: ...


@dataclass
class LoopResult:
    stop: str  # why the loop ended
    answer: str
    turns: int
    cost_usd: float
    messages: list[dict[str, Any]]  # the whole conversation, as sent


async def run_claude_loop(
    *, client: MessagesClient, model: str, instructions: str, question: str, run_tool: RunTool,
    limits: Limits, prices: Prices, cache: bool = False, tracer: Tracer | None = None,
    log: Callable[[str, Any], None] | None = None,
) -> LoopResult:
    tracer = tracer or Tracer()
    meter = RunMeter(limits, prices)
    messages: list[dict[str, Any]] = [{"role": "user", "content": question}]
    answer = ""
    turn = 0

    while True:
        turn += 1
        # Your stops come first: turn limit, cost cap, time limit (20.8).
        if limit_stop := meter.before_turn(turn):
            return LoopResult(limit_stop, answer, turn - 1, meter.spent, messages)

        # Step 1. Call the model with the instructions, the whole conversation and the tools.
        request: dict[str, Any] = {
            "model": model,
            "max_tokens": 4096,
            "system": instructions,
            "messages": messages,
            "tools": claude_tools(),
            "tool_choice": {"type": "auto"},  # the model decides. Forcing a tool is a 400 on current models
            "thinking": {"type": "adaptive"},  # the same setting on every turn of the loop
        }
        if cache:  # ask the API to cache the repeated start of every request (20.12)
            request["cache_control"] = {"type": "ephemeral"}
        if log:
            log("request", request)
        with tracer.model_call("anthropic", model) as attrs:
            response: Message = await client.messages.create(**request)
            attrs["gen_ai.response.finish_reasons"] = [str(response.stop_reason)]  # a list, as the conventions define it
            attrs["gen_ai.usage.input_tokens"] = response.usage.input_tokens
            attrs["gen_ai.usage.output_tokens"] = response.usage.output_tokens
        if log:
            log("response", response)
        meter.add_usage(TokenCount(
            input=response.usage.input_tokens,
            output=response.usage.output_tokens,
            cache_write=response.usage.cache_creation_input_tokens or 0,
            cache_read=response.usage.cache_read_input_tokens or 0,
        ))

        # Step 2. Keep everything the model said, exactly as it came back, thinking included (20.5).
        messages.append({"role": "assistant", "content": response.content})
        answer = "".join(b.text for b in response.content if b.type == "text")

        # Step 3. Stop on any reason except "wants a tool" (20.3).
        if response.stop_reason != "tool_use":
            return LoopResult(str(response.stop_reason), answer, turn, meter.spent, messages)

        # Step 4. Run every tool it asked for, and keep one result per call, matched by id (20.4).
        results: list[dict[str, Any]] = []
        for block in response.content:
            if block.type != "tool_use":
                continue
            with tracer.tool_call(block.name, block.id) as span:
                try:
                    outcome = await run_tool(block.name, block.input)
                except Exception as error:  # a failure is still a result: the model must hear about it
                    outcome = ToolOutcome(ok=False, text=f"The tool failed: {error}")
                if not outcome.ok:
                    span["error.type"] = "tool_error"  # the trace shows which tool failed (20.10)
            results.append({"type": "tool_result", "tool_use_id": block.id,
                            "content": outcome.text, "is_error": not outcome.ok})

        # Step 5. Send the results back in one user message, results first, then call again.
        messages.append({"role": "user", "content": results})
