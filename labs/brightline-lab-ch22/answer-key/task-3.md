# Lab 22, Task 3: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**If the stop rule applies.** If this task did something different from **What good looks like**, stop there: record what you saw in `ports/ch22.md`, and do not build on it. To carry on anyway, compare your work with this key yourself, in a text editor and never in the agent, and carry on once they match. It is not your mistake.

**Your prediction, if it matched:** Zero.

**What good looks like:** a message in, a message out, no tool calls, then `session.status_idle` with `stop_reason` `end_turn`, "finished". Two different session ids, each with its own history. The cost is under a cent.

**Expected from the platform's documentation:** No tool calls, `stop_reason` `end_turn`. Two different session ids. Cost under one cent (to be confirmed by the authors' live run).

**Never a deduction:** stopping here under the stop rule, the wording of the answer to "What is 2 + 2?", or how `scripts/session.ts` lays out each line, as long as the real event name is beside the plain form.
