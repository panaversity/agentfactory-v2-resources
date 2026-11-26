# Lab 20: Cedar Ridge's open-invoices screen

Chapter 20 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 20: Cedar Ridge's open-invoices screen](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/lab/), so you can do the lab without the book.

**What you will build.** A read-only screen for `list_open_invoices` on both connectors, one tool only the page may call, a screen matrix that proves whose call each button makes, and Chapter 16's triage skill served over MCP. As in Labs 17 to 19, Claude Code builds the TypeScript connector, Codex builds the Python one, and OpenCode writes the suite that proves both behave the same. Then the same screen opens in a second AI app.

**Sittings.** Three, plus three optional tasks. On a free plan, your coding agents' limits can spread them over several days. Claude's free plan allows one custom connector, which is all this lab needs.

## Before you start

- **The lab's files.** `brightline-lab-mcp-apps.zip` ([download it here](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps.zip)) holds `brightline-ap` as it stands at the end of [Lab 19](https://agentfactory.panaversity.org/building-ai-workers/business-data-and-retrieval/lab/), at tag `ch19`, with two files this lab adds: the rules file Chapter 16's triage skill reads, `plugin/skills/invoice-triage/references/rules.md` (the same text as `docs/policies/ap-triage-rules.md`), and, beside `brightline-ap/`, Task 6's test note, `lab-files/v102-test-note.txt`. You need no earlier lab. If you did Lab 19 in your own repository, you can work there instead: copy the rules file in at the same path, and keep the zip's `lab-files/` beside your repository.
- **A connector that runs.** The TypeScript connector deployed to staging, as in Lab 19's Task 16, signed in through [Chapter 18](https://agentfactory.panaversity.org/building-ai-workers/securing-connectors/overview/)'s sign-in server and reading [Chapter 19](https://agentfactory.panaversity.org/building-ai-workers/business-data-and-retrieval/overview/)'s database. The Python connector runs on your computer: Chapter 19 leaves its staging copy answering 503 until it has a database connection, an extension. If you start from the zip, follow the "Set up" section of the zip's `README.md` first. The sign-in matrix (`npm run matrix` in the authors' build, from Lab 18's Task 10) and the data matrix (`npm run matrix:data`) must both end `0 failed` before Task 0.
- Everything Lab 19 needed: Node, uv, git, the GitHub CLI (`gh`), and the desktop apps of Claude Code, Codex and OpenCode, each signed in.
- Test people from Lab 18: Luis (`owner`, Cedar Ridge), Marco (`auditor` since Lab 18's Task 11), Priya (`member` of both) and Ana (`owner`, Brightline). Their passwords are in `.secrets/test-users.local.env`, and the matrices sign them in with Lab 18's `npm run sign-in` script.
- Cedar Ridge's data from Lab 19's Task 4: 16 open invoices, $21,329.00 in all.
- For Task 8, a second AI app that shows MCP Apps: ChatGPT on a plan that allows custom connectors, or Goose, which is free and open source.

**What this lab needs, as of November 26, 2026.** Check each line again before you start. [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/) has the details.

| Feature | Status | Needed for | If you do not have it |
| --- | --- | --- | --- |
| Screens in Claude (interactive connectors) | Available on all plans, web, desktop and phones | Tasks 3 to 8 | Use Goose, and note it. The MCP project's basic host sends no sign-in token, so it cannot open this connector |
| A second AI app that shows screens | ChatGPT on a plan with custom connectors, or Goose, free | Task 8 | Skip the second app, and run the rows in OpenCode as text |
| Skills served over MCP | Beta. In public beta in Claude and Claude Code since November 24, 2026, and partial in ChatGPT | Tasks 10 and 11 | The tests still run. Skip the approval check in an AI app |
| App tools | Public preview in Claude, few other AI apps | Task 15 | Skip Task 15, or note that Claude answered from text |
| Company sign-in and job sign-in | Stable extensions. Support depends on the AI app and the sign-in server | Tasks 13 and 14 | Skip them. Both are optional |

**The date in this lab** is Tuesday, March 30, 2027, the day after [Lab 19](https://agentfactory.panaversity.org/building-ai-workers/business-data-and-retrieval/lab/).

**How every task runs.** Chapter 12's routine, as in Labs 17 to 19. Open a fresh session with the named agent and give it the prompt in the block. Then check the result before you go on. OpenCode shows no screens, so it works through the connectors' text answers and the test suite.

**Acting as a test person in Claude.** When Claude opens Brightline's sign-in page, sign in as the person the task names and pick the company it names. Each test person's password is in `.secrets/test-users.local.env`: open it in your own editor, never in a chat. Claude then acts as that person until you change it. To act as someone else, sign out on the sign-in server's page, remove the connector in Claude, add it again with [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#how-to-show-your-connectors-screen-in-your-app)'s steps, and sign in as the new person. Claude needs only the TypeScript connector: the Python connector serves the same page file, and the matrices test it.

**If what you see differs** from a task, trust what you see, and write the difference in `docs/screen-spec.md`.

**The answer key** is in `answer-key/` at the top of the zip, outside `brightline-ap/`. Never give it to an agent. Each task also links its own key as a separate download. Open a key in a text editor, never in the agent.

## Sitting 1: a screen, and whose call it makes

### Task 0. Set up (Claude Code)

**Goal:** the MCP Apps skills installed, and the extensions each connector declares written down.

**Predict:** will the section name any sign-in extension yet?

**In plain words.** Install the helper skills for building screens, then write down in the connector's spec which extension it uses and what happens in an AI app without screens.

**By hand first.** In Claude Code, type these two commands yourself, one at a time:

```text
/plugin marketplace add modelcontextprotocol/ext-apps
/plugin install mcp-apps@mcp-apps
```

Then give Claude Code this prompt:

> Read 20.1, 20.3 and the field guide's F0. Show me that the `mcp-apps` plugin is installed and name its skills. Then read `docs/connector-spec.md`, Lab 17's contract, and add a section, "Extensions": the screens extension, its stage, and the fallback when an AI app does not support it. Explain in five lines which tool gets a screen and why.

**What good looks like:** the plugin list shows `mcp-apps`, with a skill for creating an MCP App among its skills. The section names `io.modelcontextprotocol/ui`, Stable, and "text answer" as the fallback. It names no sign-in extension yet.

**Check it now.** Download [Task 0's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-0.md).

### Task 1. The screen spec, with the expert (Claude Code)

**Goal:** `docs/screen-spec.md`, agreed with Ana.

**Predict:** which of the four tools does the page call, and with which scopes?

> Interview me as if I were Ana Morales, one question at a time. Stop when you can write `docs/screen-spec.md`: the table's columns, the two buttons, what each button calls, what each refusal says on the screen, where the screen is shown, and what the screen must never show. Use 20.2's line between the screen and the chat, and its note on size.

**What good looks like:** columns are invoice number, vendor, amount and due date. The screen starts inline, and the spec says why the extra buttons are accepted. Each refusal has plain words, such as "Your role does not include vendor details." for a person without `ap:vendors.read`. The bank account ending is on the "never" list. *Vendor details* calls `find_vendor`, which needs `ap:vendors.read`. Typed questions stay in the chat.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-1.md).

### Task 2. Text first (Claude Code)

**Goal:** a test of the text answer, passing before any page exists.

**Predict:** will this test need to change when Task 3 adds the page?

> Write a test that calls `list_open_invoices` as Luis on the TypeScript connector and checks the text answer: five invoices, a handle for the next page, and the count of all 16. Run it.

**What good looks like:** the test passes now, and keeps passing after Task 3.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-2.md).

### Task 3. The TypeScript page (Claude Code)

**Goal:** the screen on the TypeScript connector, in Claude.

**Predict:** what will Claude ask Luis before the screen appears for the first time?

**In plain words.** The coding agent adds a page to the TypeScript connector and points `list_open_invoices` at it. It also adds one small tool that only the page may call, for the next page of rows. The page carries all its own code and holds no key.

**Read first.** This task uses three things that come later in the chapter: the sandbox's rule of no outside address ([20.6](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/the-sandbox/)), and Claude's *Allow once* question and its `ui.domain` value ([20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#how-to-show-your-connectors-screen-in-your-app)). Read those parts now.

> Read 20.3 to 20.6 and `docs/screen-spec.md`. With `@modelcontextprotocol/ext-apps`, register the page with `registerAppResource()` and the pointer on `list_open_invoices`. Keep every tool's scope check. If `registerAppTool()` will not accept the connector's scope check in its type, register the tool with `registerTool()` as before and add the pointer in its `_meta.ui.resourceUri`. Add `next_invoice_page`, with visibility `["app"]` and the same scope check as `list_open_invoices`. Lab 17's `tools/list` test expects four tools: show me the change before you make it, add `next_invoice_page` to what it expects, and change no other test. Bundle the page's code, declare no outside address, and set `ui.domain` for the staging address. Deploy to staging. Then register Claude as a client of the staging sign-in server, the way Lab 18 registered the coding agents: `npm run client:add -- --env staging --client-id brightline-claude --name "Claude (lab)" --redirect https://claude.ai/api/mcp/auth_callback`.

**Then, by hand,** add the staging connector to Claude, as [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#how-to-show-your-connectors-screen-in-your-app) shows. Brightline's sign-in server fetches app documents only from the hosts on its allowlist, and Claude's is not one of them, so under *OAuth client* choose *Use your own OAuth client* and enter the client ID `brightline-claude`. Sign in as Luis, and pick Cedar Ridge.

**What good looks like:** signed in as Luis, "show my open invoices" draws five rows after *Allow once*. *Inspect:* the page's resource declares no outside address, the page holds no key, and every tool still has its scope check.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-3.md).

### Task 4. The Python page (Codex)

**Goal:** the same screen on the Python connector.

**Predict:** will the Python page's HTML be the same file as the TypeScript one?

**In plain words.** Codex does the same for the Python connector, using the same page file, so both connectors show the same screen.

> Read 20.3, 20.9 and the TypeScript changes from Task 3. In the Python connector, use `mcp.server.apps` to serve the same `ui://brightline/open-invoices.html` and the same pointer, and add `next_invoice_page` with the same visibility and scope check. Register the page's tools before you create the server object, or they will not appear. The Python `tools/list` test expects four tools too: show me the change first, then add `next_invoice_page` to it. Reuse the page file. Do not change any tool's text answer.

**What good looks like:** the Python tests pass, and the page file is shared, not copied.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-4.md).

### Task 5. The screen matrix (OpenCode, then you)

**Goal:** `docs/screen-matrix.md`, with each row run as a test against both connectors.

**Predict:** cover the Expects column, and say what each row should get.

**In plain words.** OpenCode writes a test for each row of the table below. Each test makes one click as one person, against both connectors, and checks the answer. You guess each answer first.

> Read 20.4 and 20.5. Write `docs/screen-matrix.md` and `scripts/screen-matrix.ts` (`npm run matrix:screen`), which sends each row's call to both connectors on your computer, as the AI app would send it, with the row's person's test token:

| Row | Who | Does | Expects |
| --- | --- | --- | --- |
| C1 | Luis | Next page | Rows 6 to 10, Cedar Ridge's |
| C2 | Marco (`auditor`) | Vendor details on V102 | 403, and "Your role does not include vendor details." on the screen |
| C3 | Luis | The page asks `get_purchase_order` for Brightline's INV-8301 | "not found" |
| C4 | Priya, signed in for Cedar Ridge | Opens the screen | Cedar Ridge's 16 only |
| C5 | Luis | Next page with Ana's handle | Refused, start again from page one |
| C6 | Marco | `next_invoice_page` from a script, no AI app | Checked like any call: answered for Cedar Ridge |
| C7 | Luis, with the screen open | Next page after his token expired | 401, and no rows reach the page. After he signs in again, Next page works |
| C9 | Priya, now signed in for Cedar Ridge | Next page on a screen she opened while signed in for Brightline | Refused, because the handle was made for Brightline. Start again from page one, with Cedar Ridge's rows |

Row C8 comes in Task 6. C7 tests an expired token, not a removed person: removing someone stops their next sign-in, but a token they already hold works until it expires ([18.14](https://agentfactory.panaversity.org/building-ai-workers/securing-connectors/a-companys-life/)).

**What good looks like:** every row passes on both connectors. The script checks what each connector answers. What the screen shows is yours to check: run C1 by hand in Claude as Luis, and C2 as Marco, and check that the screen shows what the matrix expects, such as C2's words. C3 has no button, so only the matrix can run it.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-5.md).

## Sitting 2: the page in its box

### Task 6. Untrusted text (Claude Code)

**Goal:** row C8 passes.

**Predict:** when the note's page code reaches the screen, what will Luis see?

**In plain words.** A test note with hidden page code is put on one vendor in Cedar Ridge's practice data. Then a new test row opens that vendor and checks that the code shows as plain characters and never runs.

> Read 20.7. Replace V102's note in `data-cedar/vendor-notes.csv` with the lab's test note, `../lab-files/v102-test-note.txt`. It keeps the old note and adds a planted instruction and hidden page code. Then reload Cedar Ridge with Lab 19's loader, into `dev` for the tests and into `staging` for Claude: `npm run tenant:load -- --env dev --company org_cedar --folder data-cedar --policies data-cedar/policies --replace`, then the same with `--env staging`. Show me the counts, never the rows. Then add row C8 to the matrix: Luis opens V102's details. In a headless browser, draw the page with what each connector returns, and check that the note appears as characters, that the page makes no new element from it, and that the page sends no request.

**Then, by hand,** open the screen in Claude as Luis and press *Vendor details* on V102. Open the page's developer tools ([20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#how-to-show-your-connectors-screen-in-your-app)) and watch the Console.

**What good looks like:** row C8 passes on both connectors. In Claude, the note appears on the screen as characters, page code and all. Nothing runs: no pop-up, no change to the page, and nothing new in the Console.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-6.md).

### Task 7. What the model knows (Claude Code)

**Goal:** the page sends what it shows, and the answers prove it matters.

**Predict:** before the change, which invoice will the answer be about?

**In plain words.** First you see what the model gets wrong when it does not know which page you are on. Then the page starts telling the AI app what is showing, and you ask again.

1. **By hand, in Claude.** As Luis, open the screen, page to page three, and ask "Why is the second row late?". Write down the answer.
2. **Then give Claude Code this prompt:**

   > Read 20.8. Make the page send `ui/update-model-context` with the rows showing whenever the page changes, in the one page file both connectors serve, and log each update it sends to the browser's console. Deploy to staging.

3. **By hand again.** In a new chat, open the screen, page to page three, and ask the same question. Write down the answer. Open the page's developer tools, as [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#how-to-show-your-connectors-screen-in-your-app) shows, and find the update it sent.

**What good looks like:** check what the AI app was given, not only what the model said. Before the change, the page sends nothing about page three, so the model has no reliable picture of it. Its first answer may name page one's second row, ask which row you mean, or avoid naming one. Any of these is a pass. After the change, the page's console shows the update it sent, with the invoice numbers of rows 11 to 15. The second answer names the invoice in row 12.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-7.md).

### Task 8. A second AI app

**Goal:** the same screen, the same answers, in a second AI app.

**Predict:** which rows could behave differently in the second AI app, and why?

**By hand.** No coding agent writes anything here.

1. Add the staging connector to ChatGPT or to Goose, with the steps in [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#how-to-show-your-connectors-screen-in-your-app).
2. Open the screen, and run row C1 by hand as Luis and row C2 as Marco.
3. In OpenCode, which shows no screens, sign in to your own computer's connector as Lab 18 did: in your own terminal, `opencode mcp auth apts`, then sign in as Luis and pick Cedar Ridge. Ask for Cedar Ridge's open invoices, and check the text answer.

If the second AI app cannot sign in to the connector, write that down and do step 3 only.

**What good looks like:** the same rows, the same refusals, and in OpenCode the five invoices as text, with the handle for the next page and the count of all 16. *Port:* note in `docs/screen-spec.md` what differed, such as how each AI app asked before showing the page.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-8.md).

### Task 9. Review (Codex reviews TypeScript, Claude Code reviews Python)

**Goal:** a reviewed pull request, merged only when every matrix row passes.

**Predict:** which of the three matrices could adding a screen break?

Give Claude Code this prompt:

> Open the pull request with the template. Its checks must run all three matrices on both connectors: the sign-in matrix, the data matrix and the screen matrix. I will merge.

Then, in a fresh session of each, give Codex "Review this pull request's TypeScript changes against 20.4, 20.5 and 18.11." and Claude Code "Review this pull request's Python changes against 20.4, 20.5 and 18.11."

**What good looks like:** all three matrices end `0 failed`. Adding a screen changed no row of the first two. One check, `tests-unchanged`, fails on purpose: it names the two `tools/list` tests that Tasks 3, 4 and 10 changed, so that a person reads them, as in Lab 18. Compare its list with those tasks. If nothing else is on it, and every other check passes, merge.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-9.md).

## Sitting 3: skills over MCP

### Task 10. Serve the skills (Claude Code for TypeScript, Codex for Python)

**Goal:** `invoice-triage` served from both connectors, with its manifest.

**Predict:** how many files will `invoice-triage`'s manifest list?

**In plain words.** Both connectors start offering Chapter 16's triage skill to any AI app, with a list of its files and their fingerprints. For AI apps that cannot load skills yet, the skill is also offered as a plain tool.

> Read 20.11 and 20.12. Declare `io.modelcontextprotocol/skills` and serve Chapter 16's `invoice-triage` from `plugin/skills/invoice-triage/`, with every file in its folder, through `skills/list`, `skills/get` and `resources/read`. Serve it under the name `brightline-invoice-triage`. Compute the manifest from the bytes served. Until AI apps load skills natively, also offer the skill as a tool that returns its instructions. Say in its description that it has no manifest check, and, after showing me the change, add the tool to what the `tools/list` tests expect, in both connectors.

Then give OpenCode this prompt:

> Add a test to the conformance suite that lists the skills on both connectors and checks that every name, size and fingerprint is the same.

**What good looks like:** both connectors list the same skill with the same two files and the same fingerprints, and OpenCode's new test passes.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-10.md).

### Task 11. A changed rule (OpenCode)

**Goal:** proof that a changed file changes the manifest.

**Predict:** how many fingerprints in the manifest will change?

> Read 20.12. Write a test that lists the skills, changes one line of the triage skill's `references/rules.md`, lists them again, checks that only that file's fingerprint changed, and puts the file back.

**What good looks like:** one fingerprint changed, and the test names the file. The test proves what the connector does. Whether an AI app then asks again depends on that AI app. If yours loads skills from a connector ([20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#product-reference) lists the plans), deploy the changed rule to staging, ask Claude for a triage, and write down whether it asked you again. Then put the rule back.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-11.md).

### Task 12. How the pieces fit (you, with Claude Code)

**Goal:** `docs/connector-spec.md` updated for every layer.

**Predict:** which mistakes in 20.15's list are still open for Brightline after Task 11?

> Read 20.15. Add the four layers to `docs/connector-spec.md`, with Brightline's own example for each. Then go through 20.15's list of mistakes and mark each as "guarded" (name the test) or "open".

**What good looks like:** four layers, each with Brightline's example. They are the four tools, the served triage skill, the open-invoices screen, and Chapter 18's sign-in. Each guarded mistake names its test, such as "Treating a hidden tool as protected" and row C6. A mistake with no test stays open, such as "Linking accounts by email alone" unless you did Task 13, and "A job that borrows a person's access" unless you did Task 14.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-12.md).

## Optional tasks

### Task 13. Cedar Ridge's identity provider (Claude Code)

**Goal:** Luis connects through Cedar Ridge's own identity provider, and removing him there stops him.

**Predict:** after Luis is disabled at the identity provider, how long will his last token keep working?

**In plain words.** You add a practice company login for Cedar Ridge, let it vouch for Luis, then switch him off there and time how long until his calls stop working.

> Read 20.13. Add a test identity provider for Cedar Ridge to the sign-in server, accept ID-JAGs from it, and link people by issuer and subject. Sign Luis in, then disable him at the test identity provider, and record how long his last call keeps working.

**What good looks like:** Luis connects with no consent screen, and the connector checks his token as in Chapter 18. After he is disabled, he gets no new pass at once, but his last access token works until it expires. The time you record is close to the token lifetime you set in Lab 18. Write it in `docs/connector-spec.md`.

**Check it now.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-13.md).

### Task 14. The month-end report job (Codex)

**Goal:** the report job signs in as itself, with the least scope it needs.

**Predict:** what will `find_vendor` answer the job, and why?

**In plain words.** The month-end report job gets its own sign-in, with read-only access, and you check that its token names the job, not a person.

> Read 20.14. Give the report job its own client credentials with a signed assertion and the scope `ap:read` only, for Brightline as its company. Check that its token names the job, not a person, and that `find_vendor` refuses it.

**What good looks like:** no browser opens. The token names the job's client, not a person, with `ap:read` and Brightline. `list_open_invoices` answers. `find_vendor` answers 403, because the job has no `ap:vendors.read`.

**Check it now.** Download [Task 14's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-14.md).

### Task 15. Claude jumps to the overdue invoices (Claude Code)

**Goal:** an app tool, so Claude can change what the screen shows without a new screen.

**Predict:** when Luis asks "Jump to the overdue ones", which calls reach the connector?

**In plain words.** The page gets a small tool of its own that Claude can call. It changes what the screen shows and saves nothing.

> Read 20.3 and 20.4. In the page, register an app tool, `show_overdue`, with `app.registerTool()`. It needs version 1.7.0 or later of `@modelcontextprotocol/ext-apps`. When the model calls it, the page fetches the remaining pages with `next_invoice_page` and shows only the invoices due before March 30, 2027, oldest first. Invoices with no due date go in their own group at the end. The tool returns a short text answer with the number of overdue invoices and their total. Add nothing to the connector. Then I will open the screen in Claude as Luis and ask "Jump to the overdue ones."

**What good looks like:** the same screen changes, and no new screen appears. The connector's audit lines show only `next_invoice_page` calls, each naming Luis. Nothing was saved anywhere. In an AI app without app tools, Claude answers from the text answer instead. Write down which AI apps called the app tool.

**Check it now.** Download [Task 15's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-mcp-apps-key-task-15.md).

## Core and extensions

**What is optional:** Tasks 13, 14 and 15, and the whole of [Lab 20b](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/lab-review-workspace/).

**Core:** Tasks 0 to 12. Task 9, the review, is core: it is the only check that adding a screen changed no row of the sign-in and data matrices.

## Apply it to your vertical (optional)

Pick a business you know with at least two customers, such as a clinic group or a school district. Choose one tool that deserves a screen by 20.2's test, and one that should stay text. Write its `screen-spec.md`: the columns, the buttons, what each button calls, the words of each refusal, and the "never" list. Then write three rows of its screen matrix, one of them a button pressed by the wrong person.

## If something goes wrong

| What you see | Why | What to do |
| --- | --- | --- |
| The tool answers in Claude, but no screen appears | The page's type or address does not match the pointer | Check that the page's type is `text/html;profile=mcp-app` and that the pointer names the page's exact address. Then connect again |
| An empty box, and the console says an address was blocked | The page loads code from an address it did not declare | Bundle the code into the page ([20.6](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/the-sandbox/)) |
| Claude reports a problem with `ui.domain` | The value was computed from another server address | Compute it again from the staging address ([20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#product-reference)) |
| Claude says it cannot reach the connector | The address is on your own computer, a private network or a port other than 443 | Use the staging address, as [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/#how-to-show-your-connectors-screen-in-your-app) says |
| The page's call is refused before it reaches the connector | The tool is not marked for the page | Add `"app"` to its visibility ([20.5](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/hidden-is-not-protected/)) |
| The screen still shows the old page after a deploy | The AI app kept an earlier copy of the page | Restart the desktop app, or open a new chat |
| Row C5 passes in TypeScript but fails in Python | The Python handle check skips the person | Ask Codex to check the company and the person in every handle, as 18.12's rule 4 says |
| The two connectors list different fingerprints | The fingerprints were made from different bytes, such as other line endings | Make each fingerprint from the bytes served, and compare file by file |
| In Task 7, the second answer is still about page one | The page sends its update only when it first loads | Send it on every page change |

## Exam notes

These notes are not part of the lab. No exam objective is assigned to this chapter, and none is claimed. It supports these, without covering any of them on its own:

- **CCDV-F, MCP server development (supporting).** An extension used only when both sides declare it, a page pointer on a tool, visibility, and a text answer behind every screen ([20.1](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/what-an-mcp-extension-is/), [20.3](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-an-mcp-app-works/), [20.5](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/hidden-is-not-protected/), [20.9](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/a-text-answer-behind-every-screen/)). Skills served with a manifest ([20.11](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/skills-that-travel-with-the-server/)).
- **CCDV-F, injection, untrusted input and leakage (supporting).** The sandbox, data shown as text, and approving a skill from a server ([20.6](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/the-sandbox/), [20.7](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/untrusted-text-on-the-screen/), [20.12](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/approving-a-skill-from-a-server/)).
- **CCDV-F, identity, secrets and keys (supporting).** A click acts as the person signed in, and a page never holds a key ([20.4](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/who-a-click-acts-as/), [20.6](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/the-sandbox/)). Company sign-in and a job's own sign-in go further ([20.13](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/employees-through-their-company/), [20.14](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/machines-with-no-person/)).
- **OpenAI map, building (supporting).** ChatGPT shows the same standard's screens ([20.9](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/a-text-answer-behind-every-screen/), [20.16](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/how-todays-tools-realize-it/)).
- CCDV-F asks about Claude's behavior. Where an AI app differs from the MCP specification, the exam follows Claude. The other products are not examined.

## Artifact checklist

- [ ] `docs/connector-spec.md` with its "Extensions" section and the four layers
- [ ] `docs/screen-spec.md`, agreed with Ana, with the differences between AI apps
- [ ] The page, `ui://brightline/open-invoices.html`, one file shared by both connectors
- [ ] `next_invoice_page` in both connectors, marked for the page only
- [ ] The text-answer test from Task 2, passing
- [ ] `docs/screen-matrix.md` and `scripts/screen-matrix.ts`, rows C1 to C9 passing on both connectors
- [ ] `brightline-invoice-triage` served from both connectors, with its rules file and the changed-rule test
- [ ] A merged, reviewed pull request, with all three matrices passing

**You are done when:** the text answer passes without the page, and every row of the screen matrix passes on both connectors. The page declares no outside address and holds no key. The second AI app gives the same answers, or you wrote down why it could not sign in. Both connectors serve the same skill with the same manifest.

**Then, if you want the full app:** [Lab 20b](https://agentfactory.panaversity.org/building-ai-workers/mcp-apps/lab-review-workspace/) builds a complete interactive app, an editor that Claude and the person use together.
