# Lab 20, Task 5: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each API's documentation leads us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch20.md`. The offline results, the type checks, the recorded tests and the runs against the practice connector with a stand-in model, were checked on macOS on November 5, 2026.

**Your prediction, if it matched:** A 400.

**What a good run shows:** 400 `invalid_request_error`, saying the `signature` in the `thinking` block is invalid, with a request id.

Line 40 stops the script when the model did not think on turn 1: run it again. Line 43 is the break: it keeps the thinking block and cuts its signature to its first 20 characters. Dropping every thinking block would not fail: the call goes through, and the model loses that reasoning. The real loop never has this problem, because line 73 of `claude.ts` (line 79 of `claude_loop.py`) pushes `response.content` exactly as it arrived.
