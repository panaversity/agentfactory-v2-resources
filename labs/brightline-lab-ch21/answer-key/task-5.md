# Lab 22, Task 5: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each SDK's documentation and the offline run lead us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch21.md`. The offline results, the type checks, the tests, and both SDKs' runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** About thirty, and a shell or web tool. Record what your model actually tried.

**What a good run shows:** Built-ins on, with `--max-turns 1`: 33 tools (28 built in). Model may try Bash or WebFetch, denied, then `error_max_turns` after its one turn. Off: 5 tools, one turn.

**Seen in the offline run:** Yes (Bash tried and denied). On November 26, 2026, a stand-in that asked to read `.secrets/` had its read run without the permission callback, as Anthropic's permissions page says happens in `default` mode. With a turn limit of 1, the result never went back to the model.
