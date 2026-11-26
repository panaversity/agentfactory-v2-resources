# Lab 21, Task 5b: answer key

For you, after the task. Open it in a text editor, never in the agent. This task makes no live call: the tests replay recorded responses. Everything here was checked on macOS on November 26, 2026, with the lab's pinned packages.

**Your prediction, if it matched:** Without step 2, only the step 2 test fails. Request 2 holds two entries, the question and your results, not three. The live API would reject that request, because each tool result must answer a tool call in the entry just before it (21.4, 21.5).

**What a good run shows:** your loop passes all 8 tests in your language, `npm run test:mine` or `npm run test:mine:py`. With step 2 commented out, exactly one test fails: `step 2, keep` (`test_step_2_keep_sends_the_model_entry_back_unchanged` in Python). Put the line back, and all 8 pass again.

**If a test fails, its name says which part of your plan to change.**

| Test name starts with | What it checks | The usual slip |
| --- | --- | --- |
| `your stops` | A tool that always says "try again" ends at 6 requests with `turn_limit`. A 1-cent cap ends earlier with `cost_cap` | The stops checked after the call instead of before it, or the turn counted from 0 |
| `step 1, call` | The first request: the model, the instructions as `system`, the question, the four tools, and no `temperature`, `top_p` or `top_k` | The instructions put in the messages, or tools left out |
| `step 2, keep` | Request 2's second entry is the model's whole content, unchanged | Only the text kept, or the thinking block dropped or rebuilt |
| `step 3, check` | One tool round, then `end_turn` with the answer. `refusal` and `max_tokens` end at once | The loop ends only on `end_turn`, so it goes round again on a refusal |
| `step 4, run` | A tool that throws, and one that returns `ok: false`, both come back as results with `is_error: true` | No `try`, or `is_error` set only inside the `catch` |
| `step 5, return` | One entry in the person's role, two `tool_result` blocks, ids B1 then B2 | One entry per result, or a text block before the results |

**One loop that passes, for comparison.** Yours will differ in its words and perhaps its order of lines. What matters is that each comment is a decision you made, and that you can say what each line under it does. This one is 60 lines in TypeScript and 57 in Python, close to the lab's own loop without its trace and log lines.

```ts
// My own loop on the first API (Lab 21, Task 5b). My plan is the comments; the agent typed the code under each.

import type Anthropic from "@anthropic-ai/sdk";
import type { LoopOptions, LoopResult } from "./claude.js";
import { claudeTools } from "./tools.js";
import { RunMeter } from "./limits.js";

export async function runMyLoop(o: LoopOptions): Promise<LoopResult> {
  const meter = new RunMeter(o.limits, o.prices);
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: o.question }];
  let answer = "";

  for (let turn = 1; ; turn++) {
    // My stops: before every call, check the turn limit, the cost cap and the time limit, and stop if one is reached.
    const stop = meter.beforeTurn(turn);
    if (stop) return { stop, answer, turns: turn - 1, costUsd: meter.spent, messages };

    // Step 1, call: send the instructions, the whole conversation and the four tools. The model decides about tools.
    const response = await o.client.messages.create({
      model: o.model,
      max_tokens: 4096,
      system: o.instructions,
      messages,
      tools: claudeTools(),
      tool_choice: { type: "auto" },
      thinking: { type: "adaptive" },
    });
    meter.addUsage({
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
      cacheWrite: response.usage.cache_creation_input_tokens ?? 0,
      cacheRead: response.usage.cache_read_input_tokens ?? 0,
    });

    // Step 2, keep: add everything the model sent to the conversation, exactly as it came, thinking too.
    messages.push({ role: "assistant", content: response.content });
    answer = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");

    // Step 3, check: go round again only if it wants a tool. Any other reason ends the loop.
    if (response.stop_reason !== "tool_use") {
      return { stop: response.stop_reason ?? "unknown", answer, turns: turn, costUsd: meter.spent, messages };
    }

    // Step 4, run: run every tool it asked for. A tool that fails still gives a result, marked as an error.
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      let outcome: { ok: boolean; text: string };
      try {
        outcome = await o.runTool(block.name, block.input);
      } catch (error) {
        outcome = { ok: false, text: `The tool failed: ${error instanceof Error ? error.message : String(error)}` };
      }
      results.push({ type: "tool_result", tool_use_id: block.id, content: outcome.text, is_error: !outcome.ok });
    }

    // Step 5, return: all the results in one new entry, matched by id, results first. Then call again.
    messages.push({ role: "user", content: results });
  }
}
```

```python
"""My own loop on the first API (Lab 21, Task 5b). My plan is the comments; the agent typed the code under each."""
from __future__ import annotations

from typing import Any, Callable

from .claude_loop import LoopResult, MessagesClient
from .limits import Limits, Prices, RunMeter, TokenCount
from .tools import RunTool, ToolOutcome, claude_tools
from .trace import Tracer


async def run_my_loop(
    *, client: MessagesClient, model: str, instructions: str, question: str, run_tool: RunTool,
    limits: Limits, prices: Prices, cache: bool = False, tracer: Tracer | None = None,
    log: Callable[[str, Any], None] | None = None,
) -> LoopResult:
    meter = RunMeter(limits, prices)
    messages: list[dict[str, Any]] = [{"role": "user", "content": question}]
    answer = ""
    turn = 0
    while True:
        turn += 1
        # My stops: before every call, check the turn limit, the cost cap and the time limit.
        if stop := meter.before_turn(turn):
            return LoopResult(stop, answer, turn - 1, meter.spent, messages)

        # Step 1, call: the instructions, the whole conversation and the four tools. The model decides.
        response = await client.messages.create(
            model=model, max_tokens=4096, system=instructions, messages=messages,
            tools=claude_tools(), tool_choice={"type": "auto"}, thinking={"type": "adaptive"},
        )
        u = response.usage
        meter.add_usage(TokenCount(u.input_tokens, u.output_tokens,
                                   u.cache_creation_input_tokens or 0, u.cache_read_input_tokens or 0))

        # Step 2, keep: everything the model sent goes into the conversation, exactly as it came.
        messages.append({"role": "assistant", "content": response.content})
        answer = "".join(b.text for b in response.content if b.type == "text")

        # Step 3, check: only "wants a tool" goes round again. Anything else ends the loop.
        if response.stop_reason != "tool_use":
            return LoopResult(str(response.stop_reason), answer, turn, meter.spent, messages)

        # Step 4, run: every tool it asked for. A failure is still a result, marked as an error.
        results: list[dict[str, Any]] = []
        for block in response.content:
            if block.type != "tool_use":
                continue
            try:
                outcome = await run_tool(block.name, block.input)
            except Exception as error:
                outcome = ToolOutcome(ok=False, text=f"The tool failed: {error}")
            results.append({"type": "tool_result", "tool_use_id": block.id,
                            "content": outcome.text, "is_error": not outcome.ok})

        # Step 5, return: all results in one new entry, matched by id, results first. Then call again.
        messages.append({"role": "user", "content": results})
```
