# Lab 21, Task 3: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each SDK's documentation and the offline run lead us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch21.md`. The offline results, the type checks, the tests, and both SDKs' runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** Most people expect one assistant message per model reply. The SDK sends one per piece of the reply, so text plus a tool call arrives as two.

**What a good run shows:** First SDK: init (5 tools), assistant text, assistant tool_use, user tool_result, assistant answer, result success, 2 turns. Shadowing warning for 4 tools.

**Seen in the offline run:** Yes, both languages.
