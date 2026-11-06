# Lab 20, Task 4: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each API's documentation leads us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch20.md`. The offline results, the type checks, the recorded tests and the runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** Two results, second `is_error: true`.

**What a good run shows:** Test: ids B1 and B2. Live: both at once or one at a time, both correct.

The answer says INV-8316 has no purchase order: the connector's error says such an invoice is held until the buyer raises one. Whether the model asked for both calls at once or one at a time, record which: both are correct.
