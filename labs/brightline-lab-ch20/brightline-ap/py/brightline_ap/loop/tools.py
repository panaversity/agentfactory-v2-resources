"""A tool is a name, a description and a schema (Concept 20.2).

The four AP tools are defined once, in tools/ap-tools.json, as JSON Schema.
Each API wants them in its own shape, so two small functions convert them.
The handler for every tool is the same: call the connector over MCP.
"""
from __future__ import annotations

import json
import pathlib
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import Any, AsyncIterator, Awaitable, Callable

import httpx2
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

TOOL_SPECS: list[dict[str, Any]] = json.loads(
    (pathlib.Path(__file__).parents[3] / "tools/ap-tools.json").read_text()
)


def claude_tools(specs: list[dict[str, Any]] = TOOL_SPECS) -> list[dict[str, Any]]:
    """The shape one API wants: input_schema, strict."""
    return [{"name": s["name"], "description": s["description"], "input_schema": s["input_schema"], "strict": True}
            for s in specs]


def openai_tools(specs: list[dict[str, Any]] = TOOL_SPECS) -> list[dict[str, Any]]:
    """The shape the other API wants: type "function", parameters, strict."""
    return [{"type": "function", "name": s["name"], "description": s["description"],
             "parameters": s["input_schema"], "strict": True} for s in specs]


@dataclass(frozen=True)
class ToolOutcome:
    ok: bool  # False is a failure the model must hear about
    text: str


# Your code runs the tool. The model only asked.
RunTool = Callable[[str, Any], Awaitable[ToolOutcome]]


def allow_only(run_tool: RunTool, allowed: list[str] | None = None) -> RunTool:
    """The authorization boundary (20.8): only the tools this worker was given may run,
    whatever name the model writes. The connector still checks every call."""
    names = set(allowed if allowed is not None else [s["name"] for s in TOOL_SPECS])

    async def guarded(name: str, tool_input: Any) -> ToolOutcome:
        if name not in names:
            return ToolOutcome(ok=False, text=f"Tool {name} is not allowed for this worker.")
        return await run_tool(name, tool_input)

    return guarded


@asynccontextmanager
async def connect_to_connector(url: str, token: str) -> AsyncIterator[RunTool]:
    """The real handler: one MCP tools/call to the connector, with the builder's test token."""
    async with httpx2.AsyncClient(headers={"Authorization": f"Bearer {token}"}, timeout=30) as http:
        async with streamable_http_client(url, http_client=http) as streams:
            async with ClientSession(streams[0], streams[1]) as session:
                await session.initialize()

                async def run_tool(name: str, tool_input: Any) -> ToolOutcome:
                    # A strict tool writes null for an input the model leaves empty. The connector's own
                    # schema leaves such an input out, so the nulls are dropped here, on the way to it.
                    args = {k: v for k, v in tool_input.items() if v is not None}
                    result: Any = await session.call_tool(name, args)
                    text = "\n".join(p.text for p in result.content if getattr(p, "type", "") == "text")
                    return ToolOutcome(ok=not result.is_error, text=text)

                yield run_tool  # session.list_tools() gives the connector's own tool list
