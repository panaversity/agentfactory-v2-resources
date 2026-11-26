# Lab 20, Task 12: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** The four layers: the four tools (and the page's own `next_invoice_page`), the served triage skill, the open-invoices screen, and Chapter 18's sign-in.

Guarded, each with its test or its check: a screen with no text answer (Task 2's test), a screen for every answer and `window.openai` extras (Task 3's test), a hidden tool treated as protected (rows C2 and C6), generic skill names (Task 10's test), testing only that the screen appears (the screen matrix), and testing in one AI app (Task 8, by hand). Open: changing skill files often, linking accounts by email alone (unless you did Task 13), and a job that borrows a person's access (unless you did Task 14).

Your prediction: those three.

**Compare with** `answer-key/files/docs/connector-spec.md`. Its sections "The four layers" and the mistakes table under it.
