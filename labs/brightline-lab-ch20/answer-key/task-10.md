# Lab 20, Task 10: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each API's documentation leads us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch20.md`. The offline results, the type checks, the recorded tests and the runs against the practice connector with a stand-in model, were checked on macOS on November 5, 2026.

**Your prediction, if it matched:** An `execute_tool search_policy` span.

**What a good run shows:** Good run cites `purchasing.md:5`. Broken run: only `chat` spans.

Compare with `answer-key/files/ports/trace-good.jsonl`: three spans, `chat claude-sonnet-5-5`, `execute_tool search_policy` with its `gen_ai.tool.call.id`, then `chat claude-sonnet-5-5`. It comes from the real loop, tracer and practice connector with a stand-in model, so its ids and timings are that run's. The broken trace has no `execute_tool` span at all.
