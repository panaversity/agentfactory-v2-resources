# Lab 21, Task 0: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each SDK's documentation and the offline run lead us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch21.md`. The offline results, the type checks, the tests, and both SDKs' runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** Yes. Each language's package brings its own copy of the harness program, a large file, which is why it needs disk space.

**What a good run shows:** Pins 0.3.318 / 0.21.0 / 0.2.178 / 0.24.0. 15 TS and 13 Python SDK tests pass. Lab 20's `npm run test:loop` 32 and `npm run test:loop:py` 22 still pass.

**Seen in the offline run:** Yes.
