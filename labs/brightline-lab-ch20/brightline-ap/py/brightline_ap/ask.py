"""npm run ask:py -- --api claude|openai|open [--trace] [--quiet] [--cache] [--max-turns N] "question"

The Python twin of scripts/ask.ts. Runs one question through the hand-written loop
and prints every request and response in order. Keys are read from ../.secrets/
and never printed.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import pathlib
from typing import Any

from anthropic import AsyncAnthropic
from openai import AsyncOpenAI

from .loop.claude_loop import run_claude_loop
from .loop.limits import Limits, Prices
from .loop.openai_loop import run_openai_loop
from .loop.tools import allow_only, connect_to_connector
from .loop.trace import Tracer

ROOT = pathlib.Path(__file__).parents[2]
# The request deadline (20.8): the SDK cancels one attempt that takes longer than this.
# It then retries, up to max_retries times, so one call can take up to about three
# deadlines. The run's time limit, checked before the next call, still stops the run.
REQUEST_DEADLINE_S = 60
CONFIG = json.loads((ROOT / "src/loop/config.json").read_text())  # the same pins as config.ts


def read_env(name: str) -> dict[str, str]:
    path = ROOT / ".secrets" / name
    if not path.exists():
        raise SystemExit(f"Missing .secrets/{name}. See Task 0.")
    pairs = (line.split("=", 1) for line in path.read_text().splitlines() if "=" in line and not line.startswith("#"))
    return {k.strip(): v.strip() for k, v in pairs}


def prices_for(api: str) -> Prices:
    p = CONFIG["prices"][api]
    if api != "open" and not any(p.values()):
        raise SystemExit(f"Fill in prices.{api} in src/loop/config.json from the provider's pricing page first (F5).")
    return Prices(p["input"], p["output"], p["cacheWrite"], p["cacheRead"])


async def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--api", default="claude", choices=["claude", "openai", "open"])
    ap.add_argument("--trace", action="store_true")
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--cache", action="store_true")
    ap.add_argument("--max-turns", type=int)
    ap.add_argument("question")
    a = ap.parse_args()

    def log(label: str, value: Any) -> None:
        if not a.quiet:
            print(f"\n=== {label} ===")
            print(json.dumps(value, indent=2, default=lambda o: o.model_dump(mode="json", exclude_unset=True)))

    instructions = (ROOT / "prompts/ap-worker.v1.md").read_text()
    limits = Limits(**{"max_turns": a.max_turns or CONFIG["limits"]["maxTurns"], "max_cost_usd": CONFIG["limits"]["maxCostUsd"],
                       "max_seconds": CONFIG["limits"]["maxSeconds"]})
    connector = read_env("connector.env")
    tracer = Tracer()
    # CONNECTOR_URL in the environment overrides the file, for a second practice connector (Task 8b).
    connector_url = os.environ.get("CONNECTOR_URL") or connector["CONNECTOR_URL"]
    async with connect_to_connector(connector_url, connector["CONNECTOR_TOKEN"]) as connector_tool:
        run_tool = allow_only(connector_tool)  # the authorization boundary (20.8)
        if a.api == "claude":
            prices = prices_for("claude")
            client = AsyncAnthropic(api_key=read_env("anthropic.env")["ANTHROPIC_API_KEY"], timeout=REQUEST_DEADLINE_S, max_retries=2)
            r = await run_claude_loop(client=client, model=CONFIG["models"]["claude"], instructions=instructions,
                                      question=a.question, run_tool=run_tool, limits=limits, prices=prices,
                                      cache=a.cache, tracer=tracer, log=log)
        else:
            open_model = a.api == "open"
            prices = prices_for(a.api)
            client = (AsyncOpenAI(base_url="http://127.0.0.1:11434/v1/", api_key="ollama", timeout=REQUEST_DEADLINE_S, max_retries=2) if open_model
                      else AsyncOpenAI(api_key=read_env("openai.env")["OPENAI_API_KEY"], timeout=REQUEST_DEADLINE_S, max_retries=2))
            r = await run_openai_loop(client=client, model=CONFIG["models"][a.api], instructions=instructions,
                                      question=a.question, run_tool=run_tool, limits=limits, prices=prices,
                                      open_model=open_model, tracer=tracer, log=log)
    print(f"\n--- stop: {r.stop} | turns: {r.turns} | cost: ${r.cost_usd:.4f} ---\n{r.answer}")
    if a.trace:
        (ROOT / "trace.jsonl").write_text(tracer.to_json_lines() + "\n")
        print(f"\nWrote {len(tracer.spans)} spans to trace.jsonl")


if __name__ == "__main__":
    asyncio.run(main())
