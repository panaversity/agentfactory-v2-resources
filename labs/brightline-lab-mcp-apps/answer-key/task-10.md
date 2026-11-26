# Lab 20, Task 10: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** Both connectors list one skill, `brightline-invoice-triage`, with two files: `SKILL.md`, 1,526 bytes, `sha256:9c079f4212291e8b8818c975f251709c88798ff2d73c694df3b5702966233f6c`, and `references/rules.md`, 491 bytes, `sha256:75ca61e3c47ea0f83c878e601575591aef48d64af4d303e736e05185dd9eec12`. The served `SKILL.md` differs from the plugin's file only in its name line. Your fingerprints match these only if your files are byte for byte the kit's.

`tools/list` now has six tools, in this order: `find_vendor`, `list_open_invoices`, `next_invoice_page`, `get_purchase_order`, `search_policy` and `brightline_invoice_triage`. The new test in the conformance suite passed, and the suite ended 98 checks passed, 0 failed.

Your prediction: two files, `SKILL.md` and `references/rules.md`.

**Compare with** `answer-key/files/servers/ap-ts/src/skills.ts`, `answer-key/files/servers/ap-ts/src/server.ts`, `answer-key/files/py/brightline_ap/screen_and_skills.py`, `answer-key/files/py/brightline_ap/connector.py`, `answer-key/files/scripts/conformance.ts`, `answer-key/files/servers/ap-ts/test/skills.test.ts`, `answer-key/files/py/tests/test_skills.py`, `answer-key/files/servers/ap-ts/test/connector.test.ts`, `answer-key/files/py/tests/test_connector.py`.
