# Lab 20, Task 11: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** The test passed: after one added line, only `skill://brightline-invoice-triage/references/rules.md` had a new fingerprint, and the file was put back.

**Not run in Claude by the authors.** From their setup that day they could not open Claude or ChatGPT, so they checked the page another way, said below. If your run differs, your run is the evidence: write what you saw in `docs/screen-spec.md`. So whether Claude asked again after a change was not seen.

Your prediction: one.

**Compare with** `answer-key/files/servers/ap-ts/test/skills.test.ts`. The test is "Task 11".
