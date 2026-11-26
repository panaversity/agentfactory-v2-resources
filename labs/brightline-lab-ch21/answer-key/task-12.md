# Lab 22, Task 12: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each SDK's documentation and the offline run lead us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch21.md`. The offline results, the type checks, the tests, and both SDKs' runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** The tool's arguments and results, but not the token. The question and the answer may not be in it.

**What a good run shows:** Trace in dashboard with the tool's arguments and results, not the token. The question and the answer may not show: in the upload the authors read, each model call's span held only a response id, and the worker stores no responses.

**Seen in the offline run:** Not testable offline.
