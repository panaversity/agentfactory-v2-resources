"""The AP worker on the second SDK: an agent and a runner (21.3 to 21.8).

Every option below replaces a line of the Chapter 20 loop, or decides something the loop decided.
The file is named openai_agent.py, never agents.py: the SDK itself is imported as `agents`.
"""

from __future__ import annotations

import asyncio
import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable

from agents import (Agent, GuardrailFunctionOutput, MaxTurnsExceeded, ModelSettings, OpenAIProvider,
                    OutputGuardrailTripwireTriggered, RunConfig, Runner, function_tool, output_guardrail,
                    set_tracing_disabled)
from agents.mcp import MCPServerStreamableHttp

from .policy import FLAG_DESCRIPTION, cites_policy_line, decide_tool, parse_args, write_flag


@dataclass
class WorkerSettings:
    connector_url: str
    connector_token: str
    model: str
    max_turns: int
    time_limit_seconds: int
    tracing: bool
    base_url: str | None = None  # set for an open model on your own computer (the port)


@dataclass
class RunSummary:
    stop: str
    answer: str
    turns: int
    tokens: int
    history: list[Any] = field(default_factory=list)


# A function tool with an effect, so it waits for approval before it runs (21.5).
@function_tool(name_override="flag_invoice", description_override=FLAG_DESCRIPTION, needs_approval=True)
def flag_invoice(invoice_number: str, reason: str) -> str:
    return write_flag(invoice_number, reason)


# A guardrail: your code checks the final answer, and stops the run if it fails (21.6).
@output_guardrail(name="must_cite_a_policy_line")
async def must_cite(context, agent, output) -> GuardrailFunctionOutput:
    cited = cites_policy_line(str(output))
    return GuardrailFunctionOutput(output_info={"cited": cited}, tripwire_triggered=not cited)


def build_worker(s: WorkerSettings, connector: MCPServerStreamableHttp) -> tuple[Agent, RunConfig]:
    set_tracing_disabled(not s.tracing)  # traces leave your process by default, so the lab turns them off (21.8)
    # Chapter 20, 20.6: stateless, nothing kept on the provider's side, and the reasoning sent back to you
    settings = ModelSettings(store=False) if s.base_url else ModelSettings(
        store=False, response_include=["reasoning.encrypted_content"])
    agent = Agent(
        name="AP worker",
        instructions=Path("prompts/ap-worker-sdk.v1.md").read_text(),  # Chapter 20: the instructions
        model=s.model,
        model_settings=settings,
        mcp_servers=[connector],
        tools=[flag_invoice],
        output_guardrails=[must_cite],
    )
    provider = OpenAIProvider(base_url=s.base_url, api_key="ollama", use_responses=True) if s.base_url else None
    return agent, RunConfig(model_provider=provider) if provider else RunConfig()


async def ask_openai(question: str, s: WorkerSettings, log: Callable[[str], None], history: list[Any] | None = None) -> RunSummary:
    history = history or []
    # Chapter 20, Step 4: your process connects to the connector, with the test token in a header (21.4)
    connector = MCPServerStreamableHttp(name="brightline", params={
        "url": s.connector_url, "headers": {"Authorization": f"Bearer {s.connector_token}"}})

    async def run() -> RunSummary:
        async with connector:
            agent, config = build_worker(s, connector)
            # Chapter 20, Steps 1 to 5: the runner runs the loop. You hand it the whole history (21.7)
            result = await Runner.run(agent, [*history, {"role": "user", "content": question}],
                                      max_turns=s.max_turns, run_config=config)
            # A tool that needs approval pauses the run and hands the call back. Your rule decides, and the run resumes (21.5)
            while result.interruptions:
                state = result.to_state()
                for item in result.interruptions:
                    d = decide_tool(item.name or "", parse_args(item.arguments or "{}"))
                    log(f"approval: {item.name} -> {'approve' if d.allow else 'reject'}")
                    if d.allow:
                        state.approve(item)
                    else:
                        state.reject(item, rejection_message=d.message)
                result = await Runner.run(agent, state, max_turns=s.max_turns, run_config=config)
            usage = result.context_wrapper.usage
            return RunSummary("done", str(result.final_output or ""), usage.requests,
                              usage.input_tokens + usage.output_tokens, result.to_input_list())

    try:
        return await asyncio.wait_for(run(), timeout=s.time_limit_seconds)  # Chapter 20's time limit stays yours
    except MaxTurnsExceeded as error:
        return RunSummary("max_turns", "", _requests(error), 0, history)
    except OutputGuardrailTripwireTriggered as error:
        return RunSummary("guardrail", "", _requests(error), 0, history)
    except asyncio.TimeoutError:
        return RunSummary("time_limit", "", 0, 0, history)


def _requests(error: Exception) -> int:
    """How many model calls the run made before it stopped, from the error's own run data."""
    run_data = getattr(error, "run_data", None)
    return run_data.context_wrapper.usage.requests if run_data else 0
