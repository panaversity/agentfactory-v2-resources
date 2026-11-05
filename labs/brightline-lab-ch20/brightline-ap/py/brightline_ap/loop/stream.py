"""Streaming (Concept 20.11).

With streaming on, one response arrives as a series of server-sent events. Text
arrives in pieces you can show at once. A tool call's input arrives as pieces of a
JSON string: join them, and parse only when the block ends.

This reader is for showing a stream, not for driving the loop. It keeps the text and
the finished tool calls, but not the thinking blocks and their signatures, which the
loop must send back unchanged (20.5). To loop with streaming, keep the whole final
message instead (the SDK's stream helper assembles it).

An error in the middle of a stream: the SDK raises it from the async for loop below,
so it reaches the caller as an exception, and no half-finished tool call is ever
returned, because a call is added only when its block stops.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any, AsyncIterable, Callable


@dataclass
class Assembled:
    text: str = ""
    tool_calls: list[dict[str, Any]] = field(default_factory=lambda: [])
    stop_reason: str | None = None


async def read_claude_stream(events: AsyncIterable[Any], on_text: Callable[[str], None] = lambda _: None) -> Assembled:
    out = Assembled()
    partial_json: dict[int, str] = {}  # block index -> JSON text so far
    tool_at: dict[int, dict[str, str]] = {}

    async for event in events:
        if event.type == "content_block_start" and event.content_block.type == "tool_use":
            tool_at[event.index] = {"id": event.content_block.id, "name": event.content_block.name}
            partial_json[event.index] = ""
        elif event.type == "content_block_delta" and event.delta.type == "text_delta":
            out.text += event.delta.text
            on_text(event.delta.text)  # show it now: the person sees the answer appear
        elif event.type == "content_block_delta" and event.delta.type == "input_json_delta":
            partial_json[event.index] += event.delta.partial_json
        elif event.type == "content_block_stop" and event.index in tool_at:
            out.tool_calls.append({**tool_at[event.index], "input": json.loads(partial_json[event.index] or "{}")})
        elif event.type == "message_delta":
            out.stop_reason = event.delta.stop_reason
    return out
