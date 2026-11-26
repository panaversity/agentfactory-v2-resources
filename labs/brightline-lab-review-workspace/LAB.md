# Lab 20b: Cedar Ridge's review workspace, a full interactive app

Chapter 20 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 20b: Cedar Ridge's review workspace, a full interactive app](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/lab-review-workspace/), so you can do the lab without the book.

**What you will build.** A full interactive app inside the chat: Cedar Ridge's month-end review workspace. It opens full screen or beside the chat. On the left is the list of open invoices. In the middle is one invoice with its purchase order. On the right is a review note that Luis writes, with a status for each invoice. Claude works in the same workspace. It can pick an invoice, filter the list and draft a note, and Luis decides what to save. This is the kind of experience [20.3](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-an-mcp-app-works/) compares with Claude Docs.

**Why it is optional, and a separate connector.** Chapters 21 to 23 build on Lab 20's connector, with its four read-only tools. This lab adds the book's first tool that writes. It writes only review notes, never anything that moves money. Payments and their approvals stay in Chapter 28. So the workspace is a second connector with its own address, on its own branch. Lab 20's connector does not change. The sign-in server gains a second resource and the database a new table, both on that branch only. Its limits, kept in every task:

- It writes review notes only. It never changes vendors, invoices, payments or anything in Lab 19's AP tables.
- Saving needs its own scope, `review:write`, which an `auditor` never gets.
- Claude may draft on the screen, but only a person's *Save* writes.
- Every save writes an audit line, as in 18.16.
- The workspace matrix tries every write that should fail, and each must fail.
- It is never merged into the main branch. Chapters 21 to 23 do not depend on it.

**Sittings.** Three. On a free plan, your coding agents' limits can spread them over several days.

## Before you start

- **The lab's files.** `brightline-lab-review-workspace.zip` ([download it here](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace.zip)) holds `brightline-ap` as it stands at the end of [Lab 20](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/lab/), with every row of its screen matrix passing. You need no earlier lab. If you did Lab 20 in your own repository, you can work there instead. Either way, make a branch `review-app` from that point and push it, then do this lab's work on a branch from it, `review-app-work`.
- **A connector that runs.** If you start from the zip, follow the "Set up" section of the zip's `README.md` first, until Lab 20's screen matrix ends `0 failed`.
- The test people from Lab 18: Luis (`owner`, Cedar Ridge), Marco (`auditor`), Priya (`member` of both) and Ana (`owner`, Brightline).
- Claude on the web or the desktop app. App tools are in public preview for developers in Claude.[^claude-full-apps] If your account does not show them yet, do every task except the app-tool checks, and write down what you could not test. This lab adds a second custom connector, and Claude's free plan allows one: remove Lab 20's connector while you work here, or use a paid plan ([20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#how-to-show-your-connectors-screen-in-your-app)).

**What this lab needs, as of November 26, 2026.** App tools are the newest part. [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/) has the details.

| Feature | Status | Needed for | If you do not have it |
| --- | --- | --- | --- |
| Screens in Claude, full screen or beside the chat | Screens on all plans. Full apps rolling out on the web and desktop | Tasks 5 to 7 | The workspace works inline, smaller. Note it |
| App tools | Public preview in Claude, few other AI apps | Task 6 and row W5 | Test the page's tools with the workspace matrix, and skip the check in Claude |
| A second AI app | ChatGPT with custom connectors, or Goose | Task 9 | Use OpenCode's text answers only |

**The date in this lab** is Tuesday, March 30, 2027, as in Lab 20. "Overdue" means due before that day.

**How every task runs.** As in Lab 20: a fresh session with the named agent, the prompt in the block, then you check the result. Claude Code builds the TypeScript side, Codex builds the Python side, and OpenCode writes the tests.

**If what you see differs** from a task, trust what you see, and write the difference in `docs/review-spec.md`.

**The answer key** is in `answer-key/` at the top of the zip, outside `brightline-ap/`. Never give it to an agent. Each task also links its own key as a separate download. Open a key in a text editor, never in the agent.

## Sitting 1: notes on the server

### Task 0. The workspace spec, with the expert (Claude Code)

**Goal:** `docs/review-spec.md`, agreed with Ana.

**Predict:** who at Cedar Ridge should be able to save a note, and who should only read them?

> Interview me as if I were Ana Morales, one question at a time. Stop when you can write `docs/review-spec.md`. It must cover the three panels, the statuses a note can have, who may read and who may save, what Claude may do on the screen, and what the screen must never show. Read 20.2, 20.4 and 20.5 first, and `docs/auth-spec.md` from Lab 18.

**What good looks like:** the statuses are `open`, `reviewed` and `follow up`. Roles `owner`, `admin` and `member` may read and save notes. `auditor` may only read them. Claude may pick an invoice, filter the list and draft a note, but only a person's *Save* saves it. The bank account ending is on the "never" list again.

**Check it now.** Download [Task 0's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-0.md).

### Task 1. The notes table (Claude Code)

**Goal:** a `review_notes` table that keeps each company's notes apart, as in Chapter 19.

**Predict:** with nothing set for the company, how many notes will the new role see?

**In plain words.** The coding agent adds one new table for review notes to Chapter 19's database, with the same company-by-company protection as the other tables. A new database role may write to that table only.

> Read 19.4, 19.8 and `docs/data-spec.md`. Write migration `0005` for a `review_notes` table: company, invoice, note text, status, version number, who saved it and when. Put the company in the key. Force row-level security on it. Add a role, `review_writer`, that may read the AP tables through their policies and may insert and update `review_notes` only, one company at a time. It must not skip row-level security. Run it on `dev` and show me each role's rights.

**What good looks like:** `review_writer` has no bypass right. As `review_writer` with Cedar Ridge set, an insert for Brightline's company fails. With nothing set, the table shows 0 rows.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-1.md).

### Task 2. A second door at the sign-in server (Claude Code)

**Goal:** tokens made for the workspace connector, with their own scopes.

**Predict:** will a token made for Lab 20's connector work at the workspace connector?

**In plain words.** The sign-in server learns about the second connector. It gets its own address and two new permissions, one to read notes and one to save them.

> Read 18.6 and 18.7. Add the workspace connector's address to the sign-in server as a second resource, on port 8757 locally, and its Python copy's address, on 8758, as its own resource. Workspace tokens also carry the person's name, so a refused save can say who saved first. Add two scopes, `review:read` and `review:write`. Give `owner`, `admin` and `member` both, and `auditor` only `review:read`. Do not change any scope of the AP connector. Then run Lab 20's Task 3 `client:add` command again, so `brightline-claude` is linked to the new addresses too. Show me the claims of one token for each connector, without the tokens themselves.

**What good looks like:** each token's audience is its own connector's address. Marco's workspace token has `review:read` only.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-2.md).

### Task 3. The workspace tools in TypeScript (Claude Code)

**Goal:** `servers/review-ts/`, a connector with five tools and a text answer for each.

**Predict:** what should `save_review_note` say when the note changed after you opened it?

**In plain words.** The coding agent builds the second connector's five tools. Saving checks that nobody changed the note since you opened it. Every save is logged.

> Read 20.3 to 20.5 and `docs/review-spec.md`. Build the workspace connector on Lab 20's sign-in and database code. Its tools are `open_review_workspace`, `review_list`, `get_review_note`, `save_review_note` and `export_review`. Every call needs `review:read`, and `save_review_note` also needs `review:write`. Each call is one transaction for the token's company, as in 19.9. `save_review_note` takes the version the person last saw. If the note has changed since, it refuses and says who saved it and when. Every save writes an audit line, as in 18.16. Mark `save_review_note` as callable by the page only. `export_review` returns the month's notes as Markdown text. Write the tests first.

**What good looks like:** the tests pass with no page yet. `export_review` gives a useful answer in plain text.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-3.md).

### Task 4. The same tools in Python (Codex)

**Goal:** the Python copy, on port 8758, answering the same as TypeScript.

**Predict:** which part is the easiest to get different between the two copies?

> Read Task 3's changes and `docs/review-spec.md`. Build the same five tools in the Python connector's style, with the same scopes, the same version check and the same words in every refusal.

**What good looks like:** both copies pass the same tests.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-4.md).

## Sitting 2: the app

### Task 5. The workspace page (Claude Code)

**Goal:** the three-panel workspace, full screen or beside the chat.

**Predict:** if the AI app refuses full screen, what should the page do?

**In plain words.** The coding agent builds the workspace page. It starts as a small card, opens wide after a click, and tells Claude which invoice you selected.

> Read 20.3, 20.6 and 20.7. Make the page for `open_review_workspace`. It starts inline as a small card with an *Open workspace* button. After a click, it asks for full screen, and it must still work if the AI app keeps it inline. Show every value as text. Bundle the page's code and declare no outside address. Use the colors and fonts the AI app hands the page when it starts, its style variables, so the page fits light and dark mode. When the person selects an invoice, send the AI app what is on the screen with `ui/update-model-context`. Deploy the workspace connector to staging.

**Then, by hand,** add the workspace connector to Claude as a second custom connector, as [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#how-to-show-your-connectors-screen-in-your-app) shows. Under *OAuth client*, choose *Use your own OAuth client* and enter `brightline-claude`, the client Lab 20's Task 3 registered. Sign in as Luis, and pick Cedar Ridge.

**What good looks like:** in Claude, as Luis, "Open the review workspace" draws the card. *Open workspace* moves it beside the chat or full screen. Ask "Which invoice am I looking at?" and Claude names the one selected.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-5.md).

### Task 6. Claude works in the workspace (Claude Code)

**Goal:** three app tools, so Claude can drive the screen but never save.

**Predict:** after Claude drafts a note, what is in the database?

**In plain words.** The page gets three tools that Claude can call to move around and to draft a note. None of them can save. Only your click on Save does.

> Read 20.3 and 20.4. Claude calls a page's own tools only when its connector runs online, so work on the staging connector. In the page, register three app tools with `app.registerTool()`: `select_invoice`, `filter_list` (overdue, by vendor, or by status) and `draft_note`. `draft_note` puts text in the editor and marks it "Draft by Claude, not saved". None of them calls `save_review_note`. Then I will ask Claude: "Show the overdue ones, open the oldest, and draft a note about its missing purchase order."

**What good looks like:** the screen changes while you watch. The editor shows the draft, marked as not saved. The database has no new row until you press *Save*. The audit line for that save names Luis, not Claude.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-6.md).

### Task 7. Two people, one note (Claude Code)

**Goal:** a conflict that loses nobody's work.

**Predict:** after Luis's save is refused, where is his text?

> Read Task 3's version check. Make the page keep the person's text when a save is refused, show who saved first and when, and offer *Reload and compare*. Deploy to staging.

Then, by hand:

1. Open an invoice as Luis in Claude, and type a note. Do not save yet.
2. Save a note on the same invoice as Priya, signed in for Cedar Ridge: from a second Claude account in another browser, or from a script with her test token.
3. Now press *Save* as Luis, without reloading.

**What good looks like:** Luis's save is refused, and his text is still in the editor. The page names Priya and the time she saved. After *Reload and compare*, he sees her note beside his own and saves again with the new version.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-7.md).

## Sitting 3: proof

### Task 8. The workspace matrix (OpenCode, then you)

**Goal:** `docs/workspace-matrix.md`, each row a test against both copies.

**Predict** each row's answer before you run it.

**In plain words.** OpenCode writes a test for each row of the table below, against both copies of the connector. You guess each answer first.

> Read 20.4 and 20.5. Write `scripts/workspace-matrix.ts` (`npm run matrix:workspace`), which sends each row's call to both copies with the row's person's test token:

| Row | Who | Does | Expects |
| --- | --- | --- | --- |
| W1 | Luis | Saves a note on INV-6201 | Saved as version 1, with an audit line naming Luis |
| W2 | Marco (`auditor`) | Presses *Save* | 403, and "Your role can read notes but not save them." on the screen |
| W3 | Priya, for Cedar Ridge | Saves a note on INV-8301 | "not found" |
| W4 | Luis, then Priya | Save the same version | The second save is refused, and names Luis and the time |
| W5 | Claude, through `draft_note` | Drafts a note | No new row in `review_notes` |
| W6 | Luis, from a script with no AI app | Calls `save_review_note` | Checked like any call, and saved, because Luis may save |
| W7 | Luis | Saves a note that holds page code | Shown later as characters, and nothing runs |
| W8 | Ana, for Brightline | Calls `review_list` | None of Cedar Ridge's notes |
| W9 | Luis | Sends his AP connector token to the workspace | Refused, because the token was made for another address |

The script checks what each copy of the connector answers, and what the database holds after each row. What a screen shows, such as W2's words and W7's characters, is yours to check by eye in Claude.

**What good looks like:** every row passes on both copies. Lab 20's screen matrix, the data matrix and the sign-in matrix still end `0 failed`. Row W6 is the lesson of 20.5 again: marking a tool for the page only does not protect it. The scope check does.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-8.md).

### Task 9. Other AI apps

**Goal:** what works where, written down.

**Predict:** in an AI app without app tools, what can Claude still do with the workspace?

**By hand.** No coding agent writes anything here.

1. Add the workspace connector to ChatGPT or to Goose, with the steps in [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#how-to-show-your-connectors-screen-in-your-app).
2. Open the workspace as Luis, and run W1, W2 and W5 by hand.
3. In OpenCode, which shows no screens, ask the workspace connector for the month's review as Markdown.

If the second AI app cannot sign in to the connector, write that down and do step 3 only.

**What good looks like:** the screen and *Save* work in the second AI app. If it does not support app tools, Claude there cannot drive the screen, but the person still can. OpenCode gets the Markdown from `export_review`. Write each difference in `docs/review-spec.md`.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-9.md).

### Task 10. Review (Codex reviews TypeScript, Claude Code reviews Python)

**Goal:** a reviewed pull request on `review-app`, with all four matrices passing.

**Predict:** which of the four matrices could the workspace break?

Give Claude Code this prompt:

> Open the pull request from `review-app-work` into `review-app` with the template. Its checks must run the sign-in, data, screen and workspace matrices on both copies. I will merge into `review-app` only, never into the main branch.

Then, in a fresh session of each, give Codex "Review this pull request's TypeScript changes against 20.4, 20.5, 19.8 and 18.7." and Claude Code "Review this pull request's Python changes against 20.4, 20.5, 19.8 and 18.7."

**What good looks like:** all four matrices end `0 failed`. Lab 20's connector shows no change in the diff. The reviewers find no tool that saves without `review:write`.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-10.md).

### Task 11. Decide what ships (you, with Ana)

**Goal:** `docs/review-app-decision.md`, a short note on what Brightline sells.

**Predict:** what is the one thing Brightline must now protect that it did not before?

> Read 20.3's comparison with Claude Docs, then help me write a one-page decision for Ana. What does the workspace give Cedar Ridge that Lab 20's screen does not? What does Brightline now store and protect that it did not before? What would make us merge it into the product, and what waits for Chapter 28?

**What good looks like:** the note names the new data Brightline keeps, the new scope, the AI apps where Claude can drive the screen, and one condition for merging.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-review-workspace-key-task-11.md).

## Core and extensions

**The whole lab is optional.** Inside it, Tasks 0 to 8 and 10 are its core. Task 9, other AI apps, and Task 11, the decision, are its extensions. Do Task 9 if you sell into more than one AI app.

## Apply it to your vertical (optional)

Pick a business you know with at least two customers. Name one thing its people write while they review work, such as a clinician's note on a lab result or a teacher's comment on an assignment. Write its `review-spec.md`: who may read, who may save, what the AI may draft, and what only a person may save. Then write three rows of its workspace matrix, one of them a save by someone whose role only reads.

## If something goes wrong

| What you see | Why | What to do |
| --- | --- | --- |
| Claude never calls the app tools | The AI app does not offer app tools to the model yet, or the page registered them before connecting | Check the AI app's support in [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/). Register the tools, then connect |
| `review_writer` sees no rows at all | No company was set for the transaction | Expected with nothing set. Set the company inside the transaction, as in 19.9 |
| Marco's save succeeds | His role's scopes were not changed at the sign-in server | Check that `auditor` gets `review:read` only (Task 2), and sign him in again |
| A save overwrites someone else's note | The version check is missing in one copy | Ask Codex to compare its check with Task 3's |
| The page stays small after *Open workspace* | The AI app refused full screen, for example without a recent click | Expected sometimes. The page must work in the space it has |
| Claude's draft appears in the database | `draft_note` calls a server tool | Make `draft_note` change only the editor. Saving is the *Save* button's job |

## Exam notes

These notes are not part of the lab. No exam objective is assigned to this chapter, and none is claimed. The lab supports CCDV-F's MCP server development and its identity, secrets and keys (supporting): a separate token per connector, a scope per action, a company per transaction, and every save checked ([20.4](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/who-a-click-acts-as/), [20.5](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/hidden-is-not-protected/), [18.7](https://agentfactory.panaversity.org/building-ai-workers/securing-connectors/permission-per-tool/), [19.9](https://agentfactory.panaversity.org/building-ai-workers/business-data-and-retrieval/one-company-per-transaction/)). CCDV-F asks about Claude's behavior. The other products are not examined.

## Artifact checklist

- [ ] `docs/review-spec.md`, agreed with Ana, with the differences between AI apps
- [ ] Migration `0005`, the `review_notes` table with row-level security forced, and the `review_writer` role
- [ ] The sign-in server's second resource, with `review:read` and `review:write`
- [ ] `servers/review-ts/` and the Python copy, five tools each, with tests
- [ ] The workspace page, with three app tools that never save
- [ ] `docs/workspace-matrix.md` and `scripts/workspace-matrix.ts`, rows W1 to W9 passing on both copies
- [ ] `docs/review-app-decision.md`
- [ ] A reviewed pull request on `review-app`, never merged into the main branch

**You are done when:** every row of the workspace matrix passes on both copies, Claude's drafts never reach the database without a person's *Save*, a conflict keeps both people's text, and Lab 20's connector is unchanged.

[^claude-full-apps]: Your apps can now open in Claude, and Claude can work in them, Claude, 10 November 2026.

