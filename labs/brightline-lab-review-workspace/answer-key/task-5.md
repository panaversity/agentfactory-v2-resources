# Lab 20b, Task 5: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository on branch `review-app`. The authors ran every local step on November 26, 2026. They had no Claude account to test with, so they drew the page in the MCP project's basic host (version 2.1.0, in headless Chrome), with a small helper that added each test person's token, as an AI app does. The checks in Claude below are what to look for.

**What the authors built.** `ui/review-workspace.src.html`, built by `npm run build:review-ui` into one file, `ui/review-workspace.html`, with the MCP Apps page library inside it. The page declares no outside address (`connectDomains` and `resourceDomains` empty) and holds no key. Every value goes on the screen with `textContent` or a field's `value`, never as page code. The build also writes `servers/review-ts/src/page-html.ts`, the same page as a string, so the Worker bundle carries it.

**What the authors saw in the basic host, as Luis.**

- The card: "Cedar Ridge Supply: month-end review", "16 open invoices, $21,329.00, 14 overdue as of 2027-03-30", and *Open workspace*.
- *Open workspace*: the host granted full screen, and the three panels opened side by side. The page used the host's colors (the host hands over its style variables, so light and dark mode follow it).
- Picking INV-6201: the middle panel showed vendor V001 Treasure Valley Lumber, $4,120.75, due 2027-02-28, Net 30, purchase order PO-3101. The page sent the AI app an update naming the invoice (`ui/update-model-context`), one for each pick or filter: 11 in the whole run.

**In Claude.** Add the workspace connector as a second custom connector, with *Use your own OAuth client* and `brightline-claude`. That works only after Task 2's last step linked `brightline-claude` to the workspace's addresses. Then "Open the review workspace" draws the card after *Allow once*. *Open workspace* moves it beside the chat or full screen. Ask "Which invoice am I looking at?" and Claude names the one selected, because the page told it.

**If Claude keeps it inline,** the page says "This AI app keeps the workspace here, in the chat." and still works.

**Online,** set `REVIEW_UI_DOMAIN` in `servers/review-ts/wrangler.jsonc` to the first 32 hex characters of the SHA-256 of the staging address, then `.claudemcpcontent.com`, as Lab 20's Task 3 did for the AP connector.

**Compare with** `answer-key/files/ui/review-workspace.src.html`, `answer-key/files/scripts/build-review-ui.ts`, `answer-key/files/servers/review-ts/src/server.ts` (the page's resource and its `_meta.ui`).
