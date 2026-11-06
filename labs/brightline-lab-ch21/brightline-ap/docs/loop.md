# The loop

The AP worker's loop, as `src/loop/claude.ts` and `py/brightline_ap/loop/claude_loop.py` run it on the first API.
`src/loop/openai.ts` and `openai_loop.py` run the same five steps on the second API.

| Step | TypeScript (`claude.ts`) | Python (`claude_loop.py`) |
| --- | --- | --- |
| The stops, checked first, before every call | lines 41 to 44 | lines 44 to 48 |
| 1. Call the model, with the whole conversation and the tools | lines 46 to 70, the call on line 58 | lines 50 to 77, the call on line 65 |
| 2. Keep everything the model said, unchanged | lines 72 to 74, line 73 pushes it | lines 78 to 80, line 79 appends it |
| 3. Check why it stopped: only "wants a tool" goes round again | lines 76 to 79, line 77 decides, line 78 returns | lines 82 to 84, line 83 decides, line 84 returns |
| 4. Run each tool it asked for, one result per call, failures included | lines 81 to 94, the tool runs on line 87 | lines 86 to 99, the tool runs on line 93 |
| 5. Return the results, before anything else in the next entry | lines 96 to 97 | lines 101 to 102 |

## The three limits

From `src/loop/config.json`, which both languages read. `beforeTurn()` in `src/loop/limits.ts` checks them in this order before every call:

| Limit | Value | Stop reason |
| --- | --- | --- |
| Turns: model calls in one run | 8 | `turn_limit` |
| Cost cap, in dollars, from the prices in `config.json` | 0.10 | `cost_cap` |
| Time for the whole run, in seconds | 120 | `time_limit` |

The cost cap is checked before a call, so the last call can cross it.

## The invariant

The model only asks. Your code decides whether to run each tool, owns the whole conversation, and decides when the loop stops.
