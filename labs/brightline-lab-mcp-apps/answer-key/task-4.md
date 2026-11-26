# Lab 20, Task 4: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** The Python connector serves the same file, `ui/open-invoices.html`, byte for byte: a test compares them. The page goes in through `mcp.server.apps` (`Apps.add_html_resource`, with the same `ui.domain` rule). The authors registered `list_open_invoices` and `next_invoice_page` with `mcp.tool` and their `ui` keys, so the tools keep the order `docs/connector-spec.md` gives: an extension's own tools come before the server's, which would change the order the conformance suite compares. If you used `@apps.tool` instead, define those tools before you create the server object, or they do not appear.

The Python `tools/list` test gained `next_invoice_page`, and nothing else in it changed. The Python suite passed: 53 tests at the end of the lab, and `npm run check:py` found 0 errors.

Your prediction: yes, the same file, not a copy.

**Compare with** `answer-key/files/py/brightline_ap/screen_and_skills.py`, `answer-key/files/py/brightline_ap/connector.py`, `answer-key/files/py/brightline_ap/mcp_server.py`, `answer-key/files/py/tests/test_connector.py`, `answer-key/files/py/tests/test_screen.py`.
