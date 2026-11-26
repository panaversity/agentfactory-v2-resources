# Lab 20, Task 2: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** The test passed before any page existed. The text answer is JSON: five invoices, INV-6201 to INV-6205, a `next_page` handle, and `total_count` 16. It has no dollar total, because no tool returns one: $21,329.00 is Cedar Ridge's total in the data, not in a tool's answer.

Your prediction: no. The test does not change in Task 3, because the page leaves every text answer as it was.

**Compare with** `answer-key/files/servers/ap-ts/test/screen.test.ts`. The test is "Task 2, text first".
