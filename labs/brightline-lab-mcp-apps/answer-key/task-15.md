# Lab 20, Task 15: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** The app tool lives in the page. In a headless browser, a small host called it the way an AI app does, with Luis's calls answered by the TypeScript connector. It answered "14 overdue invoices, $17,980.25 in all. 2 have no due date." The screen then listed the 14 oldest first, from INV-6201 and INV-6208, due February 28, 2027, to INV-6216, due March 29, and then INV-6210 and INV-6219 under "No due date".

While it ran, the connector wrote three audit lines, all `next_invoice_page`, each naming Luis (`u_test_luis`) and Cedar Ridge, and none holding a token. Nothing was saved.

**Not run in Claude by the authors.** From their setup that day they could not open Claude or ChatGPT, so they checked the page another way, said below. If your run differs, your run is the evidence: write what you saw in `docs/screen-spec.md`. So which AI apps called the app tool was not seen.

Your prediction: only `next_invoice_page` calls, as Luis, for the pages the screen had not loaded yet.

**Compare with** `answer-key/files/ui/open-invoices.src.html`. The tool is `show_overdue`.
