# Lab 20, Task 6: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** Reloading Cedar Ridge into `dev`: `vendors 9, invoices 20, purchase_orders 8, policy_documents 3, policy_passages 12`, with `old-email-approvals-2024.md` reported as not loaded. Staging was not run by the authors.

Row C8, on both connectors: the note came back unchanged, as data. Drawn in a headless browser with each connector's answers, the details box held three `p` elements and the note as characters, `<img src=x onerror=alert(1)>` and all, with no request and no pop-up. The authors then broke the page on purpose, drawing the note as page code, and C8 failed: an `img` element appeared. Put back, it passed.

**Not run in Claude by the authors.** From their setup that day they could not open Claude or ChatGPT, so they checked the page another way, said below. If your run differs, your run is the evidence: write what you saw in `docs/screen-spec.md`. In the MCP project's basic host, marked 2.1.0, in headless Chrome, with a small helper that added the test person's token to each call, as an AI app does, as Luis, *Vendor details* on V102 showed the note as characters, with no element made from it, no pop-up and no request outside the computer. A request the authors made from inside the page to an outside address was blocked by the frame's content rules (`connect-src 'self'`).

Your prediction: Luis sees the note's characters, page code included, as plain text.

**Compare with** `answer-key/files/data-cedar/vendor-notes.csv`, `answer-key/files/scripts/screen-matrix.ts`, `answer-key/files/scripts/lib/draw-page.ts`, `answer-key/files/ui/open-invoices.src.html`.
