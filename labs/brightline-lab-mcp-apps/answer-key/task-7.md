# Lab 20, Task 7: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**Not run in Claude by the authors.** From their setup that day they could not open Claude or ChatGPT, so they checked the page another way, said below. If your run differs, your run is the evidence: write what you saw in `docs/screen-spec.md`. So the model's two answers were not run.

**What the authors checked instead.** In the MCP project's basic host, marked 2.1.0, in headless Chrome, with a small helper that added the test person's token to each call, as an AI app does, the page sent an update every time it changed, three in all: rows 1 to 5, rows 6 to 10, and rows 11 to 15. The third reads "The open-invoices screen now shows rows 11 to 15 of 16: row 11 INV-6211, row 12 INV-6213, row 13 INV-6216, row 14 INV-6218, row 15 INV-6219." Row 12, INV-6213, is due March 28, 2027, so after the change the answer should name INV-6213.

Your prediction: before the change the model has no picture of page three, so it may name page one's second row, INV-6202, ask which row you mean, or avoid naming one. Any of these is a pass.

**Compare with** `answer-key/files/ui/open-invoices.src.html`. The function is `tellModel`.
