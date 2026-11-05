# Lab 20, Task 8: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each API's documentation leads us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch20.md`. The offline results, the type checks, the recorded tests and the runs against the practice connector with a stand-in model, were checked on macOS on November 5, 2026.

**Your prediction, if it matched:** 6 requests, `turn_limit`.

**What a good run shows:** Tests: 6 requests and `turn_limit`, then `cost_cap` earlier. Live with `--max-turns 1`: `stop: turn_limit | turns: 1`.

On the practice connector with `PRACTICE_BROKEN=search_policy` and `--max-turns 4`, the run gets "try again" and stops with `stop: turn_limit | turns: 4`. A model that gives up first and says the policy tool is not working is also a pass.
