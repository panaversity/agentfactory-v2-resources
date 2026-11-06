"""The first rung (21.1): the same client library as Chapter 20, with only the loop taken over.

Compare this file with loop/claude_loop.py. Steps 2 to 5 of that loop are gone. Step 1's settings stay.
"""

from __future__ import annotations

from pathlib import Path

import httpx2
from anthropic import AsyncAnthropic
from anthropic.lib.tools.mcp import async_mcp_tool
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client


async def ask_with_tool_runner(question: str, connector_url: str, connector_token: str, model: str, max_turns: int):
    # Your process still connects to the connector, as in Chapter 20
    http = httpx2.AsyncClient(headers={"Authorization": f"Bearer {connector_token}"})
    async with streamable_http_client(connector_url, http_client=http) as (read, write, *_):
        async with ClientSession(read, write) as mcp:
            await mcp.initialize()
            tools = (await mcp.list_tools()).tools
            client = AsyncAnthropic()  # reads ANTHROPIC_API_KEY, retries twice, as in Chapter 20
            # One call replaces the loop: call, keep, check, run each tool, return its result, call again
            runner = client.beta.messages.tool_runner(
                model=model,
                max_tokens=4096,
                system=Path("prompts/ap-worker-sdk.v1.md").read_text(),
                tools=[async_mcp_tool(t, mcp) for t in tools],  # each MCP tool, wrapped so the runner can call it
                messages=[{"role": "user", "content": question}],
                max_iterations=max_turns,  # your turn limit, now an option
                thread=False,  # by default the runner keeps the conversation on the provider's side (21.1)
            )
            turns = 0
            async for message in runner:
                turns += 1
                print(f"turn {turns}: stop {message.stop_reason}, {', '.join(b.type for b in message.content)}")
            final = await runner.until_done()  # the last message, the one that did not ask for a tool
            answer = "".join(b.text for b in final.content if b.type == "text")
            return final.stop_reason, answer, turns
