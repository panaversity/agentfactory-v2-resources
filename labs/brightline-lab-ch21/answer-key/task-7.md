# Lab 21, Task 7: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each SDK's documentation and the offline run lead us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch21.md`. The offline results, the type checks, the tests, and both SDKs' runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** The runner is called twice for each question, once until the call is handed back and once to resume. And no, the rejected tool never runs.

**What a good run shows:** Second SDK: approve INV-8316 (flag written), reject ALL (no write).

**Seen in the offline run:** Yes, both languages.
