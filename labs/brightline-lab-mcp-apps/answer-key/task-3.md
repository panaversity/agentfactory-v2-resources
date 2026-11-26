# Lab 20, Task 3: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** `registerAppTool()` in `@modelcontextprotocol/ext-apps` 2.0.4 does not accept the connector's scope check in its type, so the authors kept `server.registerTool()` and added the pointer, `_meta.ui.resourceUri`, plus the older key `ui/resourceUri` that some AI apps still read. Every tool kept its scope check. `next_invoice_page` has visibility `["app"]` and `ap:read`, like `list_open_invoices`.

The page is one file, `ui/open-invoices.html`, 519,954 bytes with the page library inside it, built by `npm run build:ui` from `ui/open-invoices.src.html`. Its resource has the type `text/html;profile=mcp-app`, no `csp` at all, and a `ui.domain` made from the connector's own address. For the authors' local address, `http://127.0.0.1:8717/mcp`, it is `5452aa7dae42d881f3f4344fff4249ec.claudemcpcontent.com`. Yours comes from your staging address.

A Worker cannot read files, so `npm run build:ui` also writes `servers/ap-ts/src/bundled.ts`, a copy of the page and of the skill's files, which the connector serves unless `node.ts` passes the files from disk. A test fails when the two differ. `npm run check:deploy` bundled the Worker: 1,703.72 KiB, 358.46 KiB with gzip.

Lab 17's `tools/list` test gained `next_invoice_page`, and nothing else in it changed. The authors' final file also lists the skill's tool: that is Task 10's.

**Claude's client.** On the local sign-in server, `npm run client:add -- --env local --client-id brightline-claude --name "Claude (lab)" --redirect https://claude.ai/api/mcp/auth_callback` printed `client ID: brightline-claude`. Signing Luis in through that client with Claude's return address (`npm run sign-in -- --client brightline-claude --email luis@cedarridge.example --company org_cedar --redirect https://claude.ai/api/mcp/auth_callback`) gave a token for `org_cedar` with `ap:read ap:vendors.read`, made for `http://127.0.0.1:8717/mcp`, with the client ID `brightline-claude`. The task's staging command is the same with `--env staging`.

**Not run in Claude by the authors.** From their setup that day they could not open Claude or ChatGPT, so they checked the page another way, said below. If your run differs, your run is the evidence: write what you saw in `docs/screen-spec.md`. They drew the page in the MCP project's basic host, marked 2.1.0, in headless Chrome, with a small helper that added the test person's token to each call, as an AI app does: as Luis, five rows, INV-6201 to INV-6205. The basic host's tool list left out `next_invoice_page`, as visibility asks.

Your prediction: before a page first appears, Claude asks *Allow once*, or *Always allow* for a server you trust.

**Compare with** `answer-key/files/servers/ap-ts/src/server.ts`, `answer-key/files/servers/ap-ts/src/screen.ts`, `answer-key/files/servers/ap-ts/src/http.ts`, `answer-key/files/servers/ap-ts/src/node.ts`, `answer-key/files/servers/ap-ts/src/bundled.ts`, `answer-key/files/ui/open-invoices.src.html`, `answer-key/files/scripts/build-ui.ts`, `answer-key/files/servers/ap-ts/test/connector.test.ts`, `answer-key/files/servers/ap-ts/test/screen.test.ts`, `answer-key/files/servers/ap-ts/package.json`, `answer-key/files/package.json`.
