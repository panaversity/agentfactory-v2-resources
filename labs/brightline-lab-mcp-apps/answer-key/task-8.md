# Lab 20, Task 8: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**Not run in Claude by the authors.** From their setup that day they could not open Claude or ChatGPT, so they checked the page another way, said below. If your run differs, your run is the evidence: write what you saw in `docs/screen-spec.md`. The authors did not run ChatGPT or Goose either.

**What to compare.** The same rows and the same refusals as Task 5's matrix. In OpenCode, which shows no screens, the text answer is Task 2's: five invoices, INV-6201 to INV-6205, the handle for the next page, and `total_count` 16.

Your prediction: what can differ is how each AI app asks before it shows the page, whether it can sign in to the connector at all, and how its screen lays out. The connector's answers cannot differ, because the connector checks every call the same way.

**Compare with** `answer-key/files/docs/screen-spec.md`. Its last section is where your differences go.
