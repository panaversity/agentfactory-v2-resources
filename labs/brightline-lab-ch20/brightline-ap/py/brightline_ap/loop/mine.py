"""Your own loop on the first API (Lab 21, Task 5b). You decide every line, and your coding agent types it.

It takes the same options and gives back the same result as claude_loop.py, so the recorded responses that
check the lab's loop can check yours too: npm run test:mine:py. Plan it in your own words, not from
claude_loop.py. The lab's own pieces are yours to use: RunMeter (limits.py) counts turns and cost,
claude_tools() and run_tool give you the four tools.
"""
from __future__ import annotations

from typing import Any, Callable

from .claude_loop import LoopResult, MessagesClient
from .limits import Limits, Prices
from .tools import RunTool
from .trace import Tracer


async def run_my_loop(
    *, client: MessagesClient, model: str, instructions: str, question: str, run_tool: RunTool,
    limits: Limits, prices: Prices, cache: bool = False, tracer: Tracer | None = None,
    log: Callable[[str, Any], None] | None = None,
) -> LoopResult:
    # Your stops first, then steps 1 to 5, each under a comment in your own words.
    raise NotImplementedError(f"Not written yet: this is Task 5b. (Asked: {question})")
