"""The Python twins of scripts/break.ts and scripts/stateful.ts (Tasks 5, 7 and 9).

    npm run break:py -- temperature | forced-tool | drop-thinking | bad-key
    npm run stateful:py -- "Which invoices are due this week?"
"""
from __future__ import annotations

import asyncio
import json
import sys
from typing import Any

import anthropic
from anthropic import AsyncAnthropic
from openai import AsyncOpenAI

from .ask import CONFIG, ROOT, read_env
from .loop.tools import claude_tools, connect_to_connector, openai_tools


async def break_it(which: str) -> None:
    key = "sk-ant-not-a-real-key" if which == "bad-key" else read_env("anthropic.env")["ANTHROPIC_API_KEY"]
    client = AsyncAnthropic(api_key=key, max_retries=0)  # no retries, so you see the first answer
    question = {"role": "user", "content": "Which invoices are due this week?"}
    base: dict[str, Any] = {"model": CONFIG["models"]["claude"], "max_tokens": 1024,
                            "tools": claude_tools(), "messages": [question]}
    try:
        if which == "temperature":
            await client.messages.create(**base, extra_body={"temperature": 1})  # an old sample's habit
        elif which == "forced-tool":
            await client.messages.create(**base, tool_choice={"type": "any"})
        elif which == "drop-thinking":
            first = await client.messages.create(**base, thinking={"type": "adaptive"})
            if not any(b.type == "thinking" for b in first.content):
                raise SystemExit("No thinking block this time, so there is nothing to drop. Run it again.")
            call = next((b for b in first.content if b.type == "tool_use"), None)
            if call is None:
                raise SystemExit("The model answered without a tool call. Run it again.")
            edited = [b for b in first.content if b.type not in ("thinking", "redacted_thinking")]
            print(f"turn 1: {[b.type for b in first.content]}, sending back: {[b.type for b in edited]}")
            await client.messages.create(**{**base, "thinking": {"type": "adaptive"}, "messages": [
                question, {"role": "assistant", "content": edited},
                {"role": "user", "content": [{"type": "tool_result", "tool_use_id": call.id, "content": "[]"}]}]})
        elif which == "bad-key":
            await client.messages.create(**base)
        else:
            raise SystemExit("Choose one: temperature, forced-tool, drop-thinking, bad-key")
        print("No error. Record that in ports/ch20.md: the API may have changed since this chapter was checked.")
    except anthropic.APIStatusError as error:
        body: Any = error.body if isinstance(error.body, dict) else {}
        print(f"status:     {error.status_code}")
        print(f"type:       {body.get('error', {}).get('type')}")
        print(f"message:    {body.get('error', {}).get('message')}")
        print(f"request id: {error.request_id}")  # quote this when you ask the provider for help


async def stateful(question: str) -> None:
    client = AsyncOpenAI(api_key=read_env("openai.env")["OPENAI_API_KEY"])
    instructions = (ROOT / "prompts/ap-worker.v1.md").read_text()
    conn = read_env("connector.env")
    new_items: list[Any] = [{"role": "user", "content": question}]
    previous: str | None = None
    sent_by_us: list[Any] = []
    stored_ids: list[str] = []
    async with connect_to_connector(conn["CONNECTOR_URL"], conn["CONNECTOR_TOKEN"]) as run_tool:
        for turn in range(1, 9):
            extra = {"previous_response_id": previous} if previous else {}
            response = await client.responses.create(
                model=CONFIG["models"]["openai"], instructions=instructions, input=new_items,
                store=True, tools=openai_tools(), **extra)  # type: ignore[arg-type]
            sent_by_us.append({"turn": turn, "previous_response_id": previous, "input": new_items})
            previous = response.id
            stored_ids.append(response.id)
            calls = [i for i in response.output if i.type == "function_call"]
            print(f"turn {turn}: response {response.id}, {len(calls)} tool call(s), "
                  f"input tokens billed: {response.usage.input_tokens if response.usage else '?'}")
            if not calls:
                print("\n" + response.output_text)
                break
            new_items = []
            for call in calls:
                r = await run_tool(call.name, json.loads(call.arguments))
                new_items.append({"type": "function_call_output", "call_id": call.call_id,
                                  "output": r.text if r.ok else f"ERROR: {r.text}"})
    print("\n=== What this program sent, call by call ===")
    print(json.dumps(sent_by_us, indent=2))
    print(f"\nThe model's tool calls and reasoning are not in that list. They live under response {previous}.")
    print(f"Delete the stored responses when you finish (F4): {', '.join(stored_ids)}")


if __name__ == "__main__":
    if sys.argv[1] == "break":
        asyncio.run(break_it(sys.argv[2] if len(sys.argv) > 2 else ""))
    else:
        asyncio.run(stateful(" ".join(sys.argv[2:]) or "Which invoices are due this week?"))
