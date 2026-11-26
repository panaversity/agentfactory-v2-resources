# Lab 22, Task 11: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each SDK's documentation and the offline run lead us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch21.md`. The offline results, the type checks, the tests, and both SDKs' runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** The folder named after your path, no token, and, without `--persist`, no session file: only a few small files of the harness's own.

**What a good run shows:** Session file `~/.claude/projects/<encoded cwd>/<id>.jsonl`, about 25 lines, no token. Resume carries history. No persist: no session file. The harness still writes mcp-logs, `~/.claude.json`, a backup of it under `~/.claude/backups/` and a file under `~/.claude/plugins/`, none holding the conversation. Second SDK: history in the program only.

**Seen in the offline run:** Yes.
