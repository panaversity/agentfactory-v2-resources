# Lab 20, Task 9: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each API's documentation leads us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch20.md`. The offline results, the type checks, the recorded tests and the runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** 400, 400, 401, no retry helps.

**What a good run shows:** temperature 400, forced-tool 400, bad-key 401 `authentication_error`.

Retrying helps none of them: each is the request's own fault. If `temperature` or `forced-tool` does not fail, record it: the API may have changed since this chapter was checked.
