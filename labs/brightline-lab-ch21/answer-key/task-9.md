# Lab 21, Task 9: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each SDK's documentation and the offline run lead us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch21.md`. The offline results, the type checks, the tests, and both SDKs' runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** Four calls, and no. The cap is checked after each response, so the last one can cross it.

**What a good run shows:** First SDK `--max-turns 4`: 4 tool calls, error_max_turns, num_turns 5. `--budget 0.01`: error_max_budget_usd at about $0.014. Second SDK: 8 model calls, stop max_turns.

**Seen in the offline run:** Yes, both SDKs.
