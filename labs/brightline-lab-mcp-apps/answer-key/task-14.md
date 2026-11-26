# Lab 20, Task 14: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**Not built or run by the authors.** Check your run against the task's "What good looks like".

What to look for: the token's subject names the job's client, not a person, with `ap:read` only and Brightline as its company. `list_open_invoices` answers with Brightline's 13 open invoices. `find_vendor` answers 403, and its description names the missing `ap:vendors.read`.

Your prediction: 403, because the job's token has no `ap:vendors.read`.
