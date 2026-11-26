"""One answer key per Lab 20 task, as Lab 19's: what the authors saw, and which finished files to compare with.
Usage: make_keys_20.py <labs/brightline-lab-mcp-apps/answer-key>"""
import sys, pathlib

OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
HEAD = ("For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds "
        "the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every "
        "local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test "
        "embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.")
NOT_IN_CLAUDE = ("**Not run in Claude by the authors.** From their setup that day they could not open Claude or ChatGPT, "
                 "so they checked the page another way, said below. If your run differs, your run is the evidence: write what "
                 "you saw in `docs/screen-spec.md`.")
HOST = ("the MCP project's basic host, marked 2.1.0, in headless Chrome, with a small helper that added the test person's "
        "token to each call, as an AI app does")
F = lambda *p: "**Compare with** " + ", ".join(f"`answer-key/files/{x}`" for x in p) + "."
K = {
"0": ["**What the authors saw.** In Claude Code 2.1.332, `/plugin marketplace add modelcontextprotocol/ext-apps`, then "
      "`/plugin install mcp-apps@mcp-apps`, installed the plugin. The older name, `mcp-apps@modelcontextprotocol-ext-apps`, "
      "failed with \"not found in marketplace\". The plugin's skills, in the project's repository that day: `create-mcp-app`, "
      "`add-app-to-server`, `convert-web-app` and `migrate-oai-app`.",
      "The \"Extensions\" section names `io.modelcontextprotocol/ui`, Stable, revision 2026-01-26, with the text answer as the "
      "fallback, and no sign-in extension. The authors' finished section also has a Skills over MCP row: that is Task 10's.",
      "Your five lines should say that `list_open_invoices` gets the screen, because the person reads and pages through 16 rows "
      "and acts on them (20.2), and that the other three tools stay text: one vendor, one purchase order, a few policy lines.",
      F("docs/connector-spec.md") + " Read its \"Extensions\" section only, for now."],
"1": ["**What the authors saw.** The four columns: invoice number, vendor, amount and due date. *Next page* calls "
      "`next_invoice_page`, offered to the page only, with `ap:read`. *Vendor details* calls `find_vendor`, with `ap:read` and "
      "`ap:vendors.read`. The screen starts inline, five rows a page, and the AI app's own extra buttons, such as full screen, "
      "are accepted: the page works in whatever space it gets.",
      "Every refusal has plain words: \"Your role does not include vendor details.\" for a 403, \"You are signed out. Sign in "
      "again, then press the button again.\" for a 401, and the tool's own words for a refused page handle. The \"never\" list "
      "has the bank account ending, the last four digits `find_vendor` returns. Typed questions stay in the chat.",
      "Your prediction: one tool for the table's pages (`next_invoice_page`, `ap:read`) and one for vendor details "
      "(`find_vendor`, `ap:read` and `ap:vendors.read`). Your wording will differ. Check that every refusal has words and "
      "that the bank account ending is on the \"never\" list.",
      F("docs/screen-spec.md")],
"2": ["**What the authors saw.** The test passed before any page existed. The text answer is JSON: five invoices, "
      "INV-6201 to INV-6205, a `next_page` handle, and `total_count` 16. It has no dollar total, because no tool returns one: "
      "$21,329.00 is Cedar Ridge's total in the data, not in a tool's answer.",
      "Your prediction: no. The test does not change in Task 3, because the page leaves every text answer as it was.",
      F("servers/ap-ts/test/screen.test.ts") + " The test is \"Task 2, text first\"."],
"3": ["**What the authors saw.** `registerAppTool()` in `@modelcontextprotocol/ext-apps` 2.0.4 does not accept the "
      "connector's scope check in its type, so the authors kept `server.registerTool()` and added the pointer, "
      "`_meta.ui.resourceUri`, plus the older key `ui/resourceUri` that some AI apps still read. Every tool kept its scope "
      "check. `next_invoice_page` has visibility `[\"app\"]` and `ap:read`, like `list_open_invoices`.",
      "The page is one file, `ui/open-invoices.html`, 519,954 bytes with the page library inside it, built by `npm run "
      "build:ui` from `ui/open-invoices.src.html`. Its resource has the type `text/html;profile=mcp-app`, no `csp` at all, and "
      "a `ui.domain` made from the connector's own address. For the authors' local address, `http://127.0.0.1:8717/mcp`, it is "
      "`5452aa7dae42d881f3f4344fff4249ec.claudemcpcontent.com`. Yours comes from your staging address.",
      "A Worker cannot read files, so `npm run build:ui` also writes `servers/ap-ts/src/bundled.ts`, a copy of the page and of "
      "the skill's files, which the connector serves unless `node.ts` passes the files from disk. A test fails when the two "
      "differ. `npm run check:deploy` bundled the Worker: 1,703.72 KiB, 358.46 KiB with gzip.",
      "Lab 17's `tools/list` test gained `next_invoice_page`, and nothing else in it changed. The authors' final file also "
      "lists the skill's tool: that is Task 10's.",
      "**Claude's client.** On the local sign-in server, `npm run client:add -- --env local --client-id brightline-claude "
      "--name \"Claude (lab)\" --redirect https://claude.ai/api/mcp/auth_callback` printed `client ID: brightline-claude`. "
      "Signing Luis in through that client with Claude's return address (`npm run sign-in -- --client brightline-claude "
      "--email luis@cedarridge.example --company org_cedar --redirect https://claude.ai/api/mcp/auth_callback`) gave a token "
      "for `org_cedar` with `ap:read ap:vendors.read`, made for `http://127.0.0.1:8717/mcp`, with the client ID "
      "`brightline-claude`. The task's staging command is the same with `--env staging`.",
      NOT_IN_CLAUDE + f" They drew the page in {HOST}: as Luis, five rows, INV-6201 to INV-6205. The basic host's tool list "
      "left out `next_invoice_page`, as visibility asks.",
      "Your prediction: before a page first appears, Claude asks *Allow once*, or *Always allow* for a server you trust.",
      F("servers/ap-ts/src/server.ts", "servers/ap-ts/src/screen.ts", "servers/ap-ts/src/http.ts", "servers/ap-ts/src/node.ts",
        "servers/ap-ts/src/bundled.ts", "ui/open-invoices.src.html", "scripts/build-ui.ts", "servers/ap-ts/test/connector.test.ts",
        "servers/ap-ts/test/screen.test.ts", "servers/ap-ts/package.json", "package.json")],
"4": ["**What the authors saw.** The Python connector serves the same file, `ui/open-invoices.html`, byte for byte: a test "
      "compares them. The page goes in through `mcp.server.apps` (`Apps.add_html_resource`, with the same `ui.domain` rule). "
      "The authors registered `list_open_invoices` and `next_invoice_page` with `mcp.tool` and their `ui` keys, so the tools "
      "keep the order `docs/connector-spec.md` gives: an extension's own tools come before the server's, which would change "
      "the order the conformance suite compares. If you used `@apps.tool` instead, define those tools before you create the "
      "server object, or they do not appear.",
      "The Python `tools/list` test gained `next_invoice_page`, and nothing else in it changed. The Python suite passed: 53 "
      "tests at the end of the lab, and `npm run check:py` found 0 errors.",
      "Your prediction: yes, the same file, not a copy.",
      F("py/brightline_ap/screen_and_skills.py", "py/brightline_ap/connector.py", "py/brightline_ap/mcp_server.py",
        "py/tests/test_connector.py", "py/tests/test_screen.py")],
"5": ["**What the authors saw.** Every row passed on both connectors, and both gave the same answer on every row:",
      "- C1: INV-6206 to INV-6210.\n- C2: 403 `insufficient_scope`, with \"find_vendor needs ap:read ap:vendors.read. Your role in Cedar Ridge Supply does not include it.\"\n"
      "- C3: \"No invoice INV-8301 in the AP data. Check the number, or call list_open_invoices to see open invoices.\", word for word the reply for an invoice that exists nowhere.\n"
      "- C4: `total_count` 16, Cedar Ridge's.\n- C5: \"This page handle belongs to another person or company. Call again without page.\"\n"
      "- C6: answered, INV-6206 to INV-6210, and 401 with no token.\n- C7: 401 and no rows. With a fresh token, the same handle gave INV-6206 to INV-6210.\n"
      "- C9: the same refusal as C5. Page one again: 16, Cedar Ridge's.",
      "Before Task 6 the matrix has these eight rows on each connector. At the end of the lab, with C8, it ended "
      "`matrix:screen: 19 rows passed, 0 failed`.",
      NOT_IN_CLAUDE + f" In {HOST}: as Luis, *Next page* drew INV-6206 to INV-6210. As Marco, *Vendor details* on V102 showed "
      "\"Your role does not include vendor details.\"",
      F("scripts/screen-matrix.ts", "docs/screen-matrix.md", "package.json")],
"6": ["**What the authors saw.** Reloading Cedar Ridge into `dev`: `vendors 9, invoices 20, purchase_orders 8, "
      "policy_documents 3, policy_passages 12`, with `old-email-approvals-2024.md` reported as not loaded. Staging was not run "
      "by the authors.",
      "Row C8, on both connectors: the note came back unchanged, as data. Drawn in a headless browser with each connector's "
      "answers, the details box held three `p` elements and the note as characters, `<img src=x onerror=alert(1)>` and all, "
      "with no request and no pop-up. The authors then broke the page on purpose, drawing the note as page code, and C8 failed: "
      "an `img` element appeared. Put back, it passed.",
      NOT_IN_CLAUDE + f" In {HOST}, as Luis, *Vendor details* on V102 showed the note as characters, with no element made from "
      "it, no pop-up and no request outside the computer. A request the authors made from inside the page to an outside "
      "address was blocked by the frame's content rules (`connect-src 'self'`).",
      "Your prediction: Luis sees the note's characters, page code included, as plain text.",
      F("data-cedar/vendor-notes.csv", "scripts/screen-matrix.ts", "scripts/lib/draw-page.ts", "ui/open-invoices.src.html")],
"7": [NOT_IN_CLAUDE + " So the model's two answers were not run.",
      f"**What the authors checked instead.** In {HOST}, the page sent an update every time it changed, three in all: rows 1 to 5, "
      "rows 6 to 10, and rows 11 to 15. The third reads \"The open-invoices screen now shows rows 11 to 15 of 16: row 11 INV-6211, "
      "row 12 INV-6213, row 13 INV-6216, row 14 INV-6218, row 15 INV-6219.\" Row 12, INV-6213, is due March 28, 2027, so after "
      "the change the answer should name INV-6213.",
      "Your prediction: before the change the model has no picture of page three, so it may name page one's second row, "
      "INV-6202, ask which row you mean, or avoid naming one. Any of these is a pass.",
      F("ui/open-invoices.src.html") + " The function is `tellModel`."],
"8": [NOT_IN_CLAUDE + " The authors did not run ChatGPT or Goose either.",
      "**What to compare.** The same rows and the same refusals as Task 5's matrix. In OpenCode, which shows no screens, the "
      "text answer is Task 2's: five invoices, INV-6201 to INV-6205, the handle for the next page, and `total_count` 16.",
      "Your prediction: what can differ is how each AI app asks before it shows the page, whether it can sign in to the "
      "connector at all, and how its screen lays out. The connector's answers cannot differ, because the connector checks every "
      "call the same way.",
      F("docs/screen-spec.md") + " Its last section is where your differences go."],
"9": ["**What the authors saw, on their computer.** No pull request was run on GitHub. Locally, every check the workflow runs "
      "passed: `npm test`, `npm run typecheck`, `npm run test:py`, `npm run check:py`, `npm run test:servers`, `npm run "
      "conformance` (98 checks passed, 0 failed), `npm run matrix:data` (25 rows passed, 0 failed), `npm run matrix:screen` "
      "(19 rows passed, 0 failed) and `npm run check:deploy`. The sign-in matrix, `npm run matrix`, ended 12 rows passed, 0 "
      "failed, at the start of the lab and at the end. No row of it or of the data matrix changed.",
      "`tests-unchanged` fails on purpose, and names exactly two files: `py/tests/test_connector.py` and "
      "`servers/ap-ts/test/connector.test.ts`, the two `tools/list` tests that Tasks 3, 4 and 10 changed. Compare its list with "
      "those tasks. If nothing else is on it and every other check passes, merge.",
      "Your prediction: none of the first two should change. A screen adds a caller, not a new way into another company's data.",
      F(".github/workflows/ci.yml") + " It adds the screen matrix, and a step that fails when the built page or the Worker's "
      "copies are older than their sources."],
"10": ["**What the authors saw.** Both connectors list one skill, `brightline-invoice-triage`, with two files: `SKILL.md`, "
       "1,526 bytes, `sha256:9c079f4212291e8b8818c975f251709c88798ff2d73c694df3b5702966233f6c`, and `references/rules.md`, "
       "491 bytes, `sha256:75ca61e3c47ea0f83c878e601575591aef48d64af4d303e736e05185dd9eec12`. The served `SKILL.md` differs "
       "from the plugin's file only in its name line. Your fingerprints match these only if your files are byte for byte the kit's.",
       "`tools/list` now has six tools, in this order: `find_vendor`, `list_open_invoices`, `next_invoice_page`, "
       "`get_purchase_order`, `search_policy` and `brightline_invoice_triage`. The new test in the conformance suite passed, and "
       "the suite ended 98 checks passed, 0 failed.",
       "Your prediction: two files, `SKILL.md` and `references/rules.md`.",
       F("servers/ap-ts/src/skills.ts", "servers/ap-ts/src/server.ts", "py/brightline_ap/screen_and_skills.py",
         "py/brightline_ap/connector.py", "scripts/conformance.ts", "servers/ap-ts/test/skills.test.ts", "py/tests/test_skills.py",
         "servers/ap-ts/test/connector.test.ts", "py/tests/test_connector.py")],
"11": ["**What the authors saw.** The test passed: after one added line, only "
       "`skill://brightline-invoice-triage/references/rules.md` had a new fingerprint, and the file was put back.",
       NOT_IN_CLAUDE + " So whether Claude asked again after a change was not seen.",
       "Your prediction: one.",
       F("servers/ap-ts/test/skills.test.ts") + " The test is \"Task 11\"."],
"12": ["**What the authors saw.** The four layers: the four tools (and the page's own `next_invoice_page`), the served "
       "triage skill, the open-invoices screen, and Chapter 18's sign-in.",
       "Guarded, each with its test or its check: a screen with no text answer (Task 2's test), a screen for every answer and "
       "`window.openai` extras (Task 3's test), a hidden tool treated as protected (rows C2 and C6), generic skill names "
       "(Task 10's test), testing only that the screen appears (the screen matrix), and testing in one AI app (Task 8, by hand). "
       "Open: changing skill files often, linking accounts by email alone (unless you did Task 13), and a job that borrows a "
       "person's access (unless you did Task 14).",
       "Your prediction: those three.",
       F("docs/connector-spec.md") + " Its sections \"The four layers\" and the mistakes table under it."],
"13": ["**Not built or run by the authors.** Check your run against the task's \"What good looks like\".",
       "Two facts help. A person's access token works until it runs out, which is 10 minutes at most on the lab's sign-in "
       "server (`scripts/tenant-member.ts` says so), so the time you record should be close to that. And a new pass is refused "
       "at once, because disabling Luis at the identity provider stops it from vouching for him.",
       "Your prediction: until the token he already holds runs out."],
"14": ["**Not built or run by the authors.** Check your run against the task's \"What good looks like\".",
       "What to look for: the token's subject names the job's client, not a person, with `ap:read` only and Brightline as its "
       "company. `list_open_invoices` answers with Brightline's 13 open invoices. `find_vendor` answers 403, and its "
       "description names the missing `ap:vendors.read`.",
       "Your prediction: 403, because the job's token has no `ap:vendors.read`."],
"15": ["**What the authors saw.** The app tool lives in the page. In a headless browser, a small host called it the way an "
       "AI app does, with Luis's calls answered by the TypeScript connector. It answered \"14 overdue invoices, $17,980.25 in "
       "all. 2 have no due date.\" The screen then listed the 14 oldest first, from INV-6201 and INV-6208, due February 28, "
       "2027, to INV-6216, due March 29, and then INV-6210 and INV-6219 under \"No due date\".",
       "While it ran, the connector wrote three audit lines, all `next_invoice_page`, each naming Luis (`u_test_luis`) and "
       "Cedar Ridge, and none holding a token. Nothing was saved.",
       NOT_IN_CLAUDE + " So which AI apps called the app tool was not seen.",
       "Your prediction: only `next_invoice_page` calls, as Luis, for the pages the screen had not loaded yet.",
       F("ui/open-invoices.src.html") + " The tool is `show_overdue`."],
}
for n, parts in K.items():
    (OUT / f"task-{n}.md").write_text(f"# Lab 20, Task {n}: answer key\n\n{HEAD}\n\n" + "\n\n".join(parts) + "\n")
print(len(K), "keys")
