# Lab 20, Task 11: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each API's documentation leads us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch20.md`. The offline results, the type checks, the recorded tests and the runs against the practice connector with a stand-in model, were checked on macOS on November 5, 2026.

**Your prediction, if it matched:** Parse at block stop. Cache read from turn 2.

**What a good run shows:** Event order as 20.11. With `--cache`, `cache_read_input_tokens` from turn 2, lower total.

The tool input arrives in pieces that are not valid JSON on their own, and is parsed once, at its `content_block_stop`. If no tokens are cached, the repeated start may be shorter than the model's minimum for caching (F5): record it.
