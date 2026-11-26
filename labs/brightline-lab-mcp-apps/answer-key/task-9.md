# Lab 20, Task 9: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw, on their computer.** No pull request was run on GitHub. Locally, every check the workflow runs passed: `npm test`, `npm run typecheck`, `npm run test:py`, `npm run check:py`, `npm run test:servers`, `npm run conformance` (98 checks passed, 0 failed), `npm run matrix:data` (25 rows passed, 0 failed), `npm run matrix:screen` (19 rows passed, 0 failed) and `npm run check:deploy`. The sign-in matrix, `npm run matrix`, ended 12 rows passed, 0 failed, at the start of the lab and at the end. No row of it or of the data matrix changed.

`tests-unchanged` fails on purpose, and names exactly two files: `py/tests/test_connector.py` and `servers/ap-ts/test/connector.test.ts`, the two `tools/list` tests that Tasks 3, 4 and 10 changed. Compare its list with those tasks. If nothing else is on it and every other check passes, merge.

Your prediction: none of the first two should change. A screen adds a caller, not a new way into another company's data.

**Compare with** `answer-key/files/.github/workflows/ci.yml`. It adds the screen matrix, and a step that fails when the built page or the Worker's copies are older than their sources.
