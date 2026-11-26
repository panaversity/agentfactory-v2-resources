# Lab 22, Task 8: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each SDK's documentation and the offline run lead us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch21.md`. The offline results, the type checks, the tests, and both SDKs' runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** The hook first, and yes, the tool can still run: a hook that throws counts as no decision, and the call goes on to the other checks.

**What a good run shows:** Hook first. A hook that throws counts as no decision by default, so the call goes on to the other checks.

**Seen in the offline run:** Yes (order). On November 26, 2026, a hook that threw gave a `hook_callback_failed` message, and the allowed tool then ran.
