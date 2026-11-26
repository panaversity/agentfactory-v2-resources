# Lab 20, Task 0: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** In Claude Code 2.1.332, `/plugin marketplace add modelcontextprotocol/ext-apps`, then `/plugin install mcp-apps@mcp-apps`, installed the plugin. The older name, `mcp-apps@modelcontextprotocol-ext-apps`, failed with "not found in marketplace". The plugin's skills, in the project's repository that day: `create-mcp-app`, `add-app-to-server`, `convert-web-app` and `migrate-oai-app`.

The "Extensions" section names `io.modelcontextprotocol/ui`, Stable, revision 2026-01-26, with the text answer as the fallback, and no sign-in extension. The authors' finished section also has a Skills over MCP row: that is Task 10's.

Your five lines should say that `list_open_invoices` gets the screen, because the person reads and pages through 16 rows and acts on them (20.2), and that the other three tools stay text: one vendor, one purchase order, a few policy lines.

**Compare with** `answer-key/files/docs/connector-spec.md`. Read its "Extensions" section only, for now.
