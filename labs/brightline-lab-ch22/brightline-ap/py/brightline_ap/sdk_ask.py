"""npm run sdk:py -- --sdk claude|openai|open|runner [--max-turns N] [--budget USD] [--persist] [--resume ID] [--trace] "question"

The Python twin of scripts/sdk-ask.ts: one line per message, then a summary line.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import re
from pathlib import Path
from typing import Any

from claude_agent_sdk import AssistantMessage, ResultMessage, SystemMessage, TextBlock, ToolResultBlock, ToolUseBlock, UserMessage

from .sdk.claude_agent import WorkerSettings as ClaudeSettings, ask_claude
from .sdk.openai_agent import WorkerSettings as OpenAISettings, ask_openai
from .sdk.tool_runner import ask_with_tool_runner


def show_requests() -> None:
    # Task 4: each request's store, include and previous_response_id, as the second SDK sends them.
    # Its Python package prints no request body of its own (F3), so the default client prints these three.
    from agents import set_default_openai_client
    from openai import AsyncOpenAI

    client = AsyncOpenAI()
    create = client.responses.create

    async def logged(**kw: Any) -> Any:
        def plain(v: Any) -> Any:
            return None if type(v).__name__ in ("NotGiven", "Omit") else v
        print(f"request: store={plain(kw.get('store'))} include={plain(kw.get('include'))} "
              f"previous_response_id={plain(kw.get('previous_response_id'))}")
        return await create(**kw)

    setattr(client.responses, "create", logged)
    set_default_openai_client(client, use_for_tracing=False)


def load_secrets() -> None:
    # Secrets come from files git ignores, read here and never printed (Chapter 20, F0)
    for f in [".secrets/anthropic.env", ".secrets/openai.env", ".secrets/connector.env"]:
        p = Path(f)
        if p.exists():
            for line in p.read_text().splitlines():
                m = re.match(r"^([A-Z_]+)=(.*)$", line)
                if m and m.group(1) not in os.environ:
                    os.environ[m.group(1)] = m.group(2)


def show(m) -> None:
    # One line per message in the stream (21.3)
    if isinstance(m, SystemMessage) and m.subtype == "init":
        d = m.data
        servers = ", ".join(f"{s['name']}={s['status']}" for s in d.get("mcp_servers", []))
        print(f"system init: model {d.get('model')}, tools [{', '.join(d.get('tools', []))}], servers {servers}, session {d.get('session_id')}")
    elif isinstance(m, AssistantMessage):
        parts = []
        for b in m.content:
            if isinstance(b, ToolUseBlock):
                parts.append(f"tool_use {b.name} {json.dumps(b.input)}")
            elif isinstance(b, TextBlock):
                parts.append(f'text "{b.text[:70]}"')
            else:
                parts.append(type(b).__name__)
        print("assistant: " + " | ".join(parts))
    elif isinstance(m, UserMessage):
        c = m.content
        parts = [("tool_result (error)" if b.is_error else "tool_result") if isinstance(b, ToolResultBlock)
                 else type(b).__name__ for b in c] if isinstance(c, list) else ["text"]
        print("user: " + " | ".join(parts))
    elif isinstance(m, ResultMessage):
        print(f"result: {m.subtype}, turns {m.num_turns}, cost ${(m.total_cost_usd or 0):.4f}")


async def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sdk", default="claude")
    ap.add_argument("--max-turns", type=int)
    ap.add_argument("--budget", type=float)
    ap.add_argument("--resume")
    ap.add_argument("--persist", action="store_true")
    ap.add_argument("--trace", action="store_true")
    ap.add_argument("question", nargs="+")
    a = ap.parse_args()
    load_secrets()
    config = json.loads(Path("src/sdk/config.json").read_text())
    url = os.environ.get("CONNECTOR_URL", "http://127.0.0.1:8760/mcp")
    token = os.environ.get("CONNECTOR_TOKEN", "")
    question = " ".join(a.question)
    max_turns = a.max_turns or config["limits"]["maxTurns"]
    log = lambda line: print(f"  {line}")  # noqa: E731

    if a.sdk == "claude":
        s = await ask_claude(question, ClaudeSettings(
            url, token, config["models"]["claude"], max_turns, a.budget or config["limits"]["maxBudgetUsd"],
            config["limits"]["timeLimitSeconds"], a.persist, a.resume), show, log)
        print(f"answer: {s.answer}")
        print(f"--- stop: {s.stop} | turns: {s.turns} | cost: ${s.cost_usd:.4f} | session: {s.session_id} ---")
    elif a.sdk == "runner":
        stop, answer, turns = await ask_with_tool_runner(question, url, token, config["models"]["claude"], max_turns)
        print(f"answer: {answer}")
        print(f"--- stop: {stop} | turns: {turns} ---")
    else:
        is_open = a.sdk == "open"
        if not is_open:
            show_requests()
        s = await ask_openai(question, OpenAISettings(
            url, token, config["models"]["open" if is_open else "openai"], max_turns,
            config["limits"]["timeLimitSeconds"], a.trace, "http://127.0.0.1:11434/v1/" if is_open else None), log)
        for item in s.history:
            i = item if isinstance(item, dict) else {}
            print(f"history: {i.get('type', 'message')}{' ' + i['role'] if i.get('role') else ''}"
                  f"{' ' + i['name'] + ' ' + i.get('arguments', '') if i.get('name') else ''}")
        print(f"answer: {s.answer}")
        print(f"--- stop: {s.stop} | model calls: {s.turns} | tokens: {s.tokens} ---")


if __name__ == "__main__":
    asyncio.run(main())
