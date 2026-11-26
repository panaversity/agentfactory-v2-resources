# Lab 20, Task 5: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** Every row passed on both connectors, and both gave the same answer on every row:

- C1: INV-6206 to INV-6210.
- C2: 403 `insufficient_scope`, with "find_vendor needs ap:read ap:vendors.read. Your role in Cedar Ridge Supply does not include it."
- C3: "No invoice INV-8301 in the AP data. Check the number, or call list_open_invoices to see open invoices.", word for word the reply for an invoice that exists nowhere.
- C4: `total_count` 16, Cedar Ridge's.
- C5: "This page handle belongs to another person or company. Call again without page."
- C6: answered, INV-6206 to INV-6210, and 401 with no token.
- C7: 401 and no rows. With a fresh token, the same handle gave INV-6206 to INV-6210.
- C9: the same refusal as C5. Page one again: 16, Cedar Ridge's.

Before Task 6 the matrix has these eight rows on each connector. At the end of the lab, with C8, it ended `matrix:screen: 19 rows passed, 0 failed`.

**Not run in Claude by the authors.** From their setup that day they could not open Claude or ChatGPT, so they checked the page another way, said below. If your run differs, your run is the evidence: write what you saw in `docs/screen-spec.md`. In the MCP project's basic host, marked 2.1.0, in headless Chrome, with a small helper that added the test person's token to each call, as an AI app does: as Luis, *Next page* drew INV-6206 to INV-6210. As Marco, *Vendor details* on V102 showed "Your role does not include vendor details."

**Compare with** `answer-key/files/scripts/screen-matrix.ts`, `answer-key/files/docs/screen-matrix.md`, `answer-key/files/package.json`.
