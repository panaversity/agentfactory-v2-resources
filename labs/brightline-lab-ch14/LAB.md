# Lab 14: models and an async client in two languages

Chapter 14 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 14: models and an async client in two languages](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/lab/), so you can do the lab without the book.

*Time: about 4 hours. Lab files: `brightline-lab-ch14.zip`, standalone. The same steps are in `LAB.md` inside the zip.*

### Before you start

*What you need.*

- The Claude desktop app with a Pro, Max, Ultra, Team or Enterprise plan, for Tasks 1 to 9 and 12.
- The ChatGPT desktop app with any plan, for Task 10, and OpenCode Desktop with a model connected, for Task 11, as in [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/).
- Git, Node.js 24 or later, and uv, as in [Lab 13](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/lab/). You also need `curl` for Task 7, a small tool most computers already have. Your agent can check with `curl --version`.

**Set up the tools.** If a tool is missing, follow Concept [13.2](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/the-workbench/#how-do-i-set-up-the-workbench) before Task 1. 

**The core path and the extensions.** The core path is Tasks 1 to 9, at least one port (Task 10 or 11), and Task 12. A port makes the same change with a second agent. The second port is an extension. Task 9 can be done on another day.

For [Python only](#python-only), or [without a paid Claude plan](#without-a-paid-claude-plan), see the two sections near the end of this page.

**The lab files.** Download [brightline-lab-ch14.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14.zip) and unzip it into a new folder. It contains:

- `brightline-ap/`, a plain copy of the repository at the end of [Lab 13](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/lab/), with no git history. It also holds the lab's starting files: `data/invoices-messy.csv`, the sample API in `scripts/ap-api.ts`, `.env.example`, two planted calls in `exercises/`, wrong calls put there on purpose, and the made-up SDK in `exercises/sdk-shaped/`. In Task 1, the agent puts it under git. This is the only folder you give an agent.
- `concept-blocks/`, every code block from Chapter 14, ready to run.
- `LAB.md`, and `field-guide-code-toolchain.md`, the field guide for the code toolchain, with more detail and a table for fixing problems.

Each task with an answer key links it as a separate download. Open a key in a text editor, never in the agent. An agent that can read the answers is not tested by them.

Use the zip's copy for this lab, even if you finished Lab 13 in your own repository. The answer keys match the zip's files exactly.

**The date in this lab.** Today is still Wednesday, March 3, 2027, and the payment run is Friday, March 5.

### The job

An agent split Brightline's scripts into modules and classes. Nobody has read the result. Meanwhile, the AP team wants to stop trusting the exports without checking them. Last month, an export from a new vendor portal had a negative amount, and nobody noticed for a week.

Ana wants three things, in both languages. Types that say exactly which terms exist. Schemas that check every record at the edge and report every bad row. And a small client for the AP system's API. It fetches vendors while it fetches every page of open invoices, retries once when the server is busy, and gives up when the server hangs. In the lab, a server on your own computer takes the place of the AP system.

As in Lab 13, every count and total comes from tested code, never from an AI's reply.

### How each task works

Each task has a goal, steps and a **Checkpoint**. Do not start the next task until the checkpoint is true. In the Claude desktop app, work in *Manual* mode.

The agent runs every command in this lab, such as git, npm, uv and curl, and you never type one in a terminal. Before you approve a command, read what the agent says it will do, and say no to anything you do not understand. Asking "What does this command do?" is always fine. Approve each command when you agree with what it does, and then read what it prints. Approve a package install only for the exact names a task lists. Write each prediction in `NOTES.md` before the agent runs anything.

You decide every test case and its answer. That is the first 10 percent of [10-80-10](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/you-read-the-agent-writes/#what-is-my-job-when-an-agent-writes-the-code), where you say what correct means. The agent writes the test code from your list. Read each test against your list before you approve it. Once a test is approved, the agent never changes it.

### Task 1. Read the shape (20 minutes)

*Goal:* know the repository's structure before you change it.

1. Open `brightline-ap` in the Claude desktop app's *Code* tab, in a *Local* session, in *Manual* mode.
2. Send:

   > Please put this folder under git, with a main branch, and make a first commit of everything here, with the message "Start from the end of Lab 13". Then show me `git log --oneline`.

   Expect `git init -b main`, `git add .`, `git commit` and `git log --oneline`, which shows one commit. If the agent wants to change your git settings for the whole computer, say no. Ask it to set the name and email for this project only.
3. Send: "Please install the packages from the lock files, with `npm ci` and, in `py/`, `uv sync`. Then run `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py`, and show me what each one prints." All four pass.
4. From the file names in `src/` alone, predict which files import which, and draw it in `NOTES.md` as a list of arrows, such as `invoice-book -> due-date`.
5. Now read the import lines at the top of each file in `src/` and `scripts/`, and correct your graph.
6. Mark the edges in your graph, the places where data comes in. The edges are every file that reads `data/`, and the functions that turn rows into records. For each edge that reads an amount, write in `NOTES.md` what it does with an amount it does not expect, such as a blank one. Then find the foundations, the files that many others import.

**Checkpoint:** your graph in `NOTES.md` matches the answer key, with the edges marked, and you can name the two files most others import.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-1.md).

### Task 2. Write the types (20 minutes)

*Goal:* a literal type for terms, in both languages, and the type checkers catching a wrong call.

1. Read `exercises/wrong-call.ts` and `exercises/wrong_call.py`. Predict first, in `NOTES.md`: will either type checker catch `"Net 10"`? Then ask the agent to run `npm run typecheck` and `npm run check:py`, and compare with what they print.
2. Predict in `NOTES.md` which files will get a type error once `termsDays` and `dueDate` take only `Terms`. Then send:

   > In `src/due-date.ts`, please make the five known terms a type, `Terms`. Add `isTerms`, a type guard that says whether some text is one of them, and `parseTerms`, which returns `Terms` or throws `Unknown terms: <text>`. Change `termsDays` and `dueDate` to take `Terms`. Do the same in `py/brightline_ap/due_date.py` with `Literal`, `TypeGuard`, `is_terms` and `parse_terms`. Then run `npm run typecheck` and `npm run check:py` and show me every error. Please don't fix anything yet.

3. Read the errors, and compare them with your prediction. Sort them into three kinds: raw text from a file, the test that checks unknown terms on purpose, and the planted call. Write the count of each in `NOTES.md`. For each raw-text error, follow the text back to the edge you marked in Task 1, where it is read from the file, and write that place down.
4. Send:

   > Please fix the raw-text errors by checking the text once, at the places I listed in `NOTES.md`, with `parseTerms` or `parse_terms`. In the tests, mark the unknown-terms call as expected to fail type checking, with `// @ts-expect-error` and `# pyright: ignore[reportArgumentType]`, and don't change what the tests check. Leave the planted calls alone for now. Then run `npm run typecheck` and `npm run check:py` again.

   When the agent asks to edit a test, make sure it adds only the marking comment. A cast such as `as Terms` is no fix, as [14.2](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/types-you-write-down/#where-does-text-from-a-file-become-a-type) says. Compare the places the agent changed with your list. Only the two planted calls should still fail.
5. You decide the fix for the planted calls. Send: "Please change `"Net 10"` to `"Net 15"` in both planted calls, and change nothing else. Then run `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py`."

**Checkpoint:** in step 1, neither type checker caught `"Net 10"`, because `terms` was only a `string`. Before step 5, both named the planted call. After it, all four commands pass, and `git diff` on the tests shows only the two marking comments. Ask the agent to commit.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-2.md).

### Task 3. Read and change a class (25 minutes)

*Goal:* read a class by its methods, then add one, test first.

1. Read `src/invoice-book.ts` and `py/brightline_ap/invoice_book.py`. For each method, write one sentence in `NOTES.md` saying what it returns.
2. Predict: for the real data, how many invoices does `open()` return, and how many does `dueBy("2027-03-05")` return? Then open `tests/invoice-book.test.ts`, which states both numbers, and compare.
3. Decide the new case. `openTotalCents()`, or `open_total_cents()` in Python, returns the total of the open invoices in `data/invoices.csv`, in cents. Work it out from the data, then compare it with Task 3's answer key before you send this. Write the case and your number in `NOTES.md`, under a heading "Task 3". Then send:

   > Please write a failing test from my case in `NOTES.md`, under "Task 3". Put it in `tests/invoice-book.test.ts` and `py/tests/test_invoice_book.py`. The method is `openTotalCents()` in `src/invoice-book.ts` and `open_total_cents()` in `py/brightline_ap/invoice_book.py`, and neither exists yet. Use my number exactly. Write only the tests, and don't change any other file.

   Then ask the agent to run `npm test` and `npm run test:py`. The new test fails in both, because the method does not exist yet.
4. Send: "Please add both methods so my new tests pass, without changing any test. Then run the tests in both languages and show me the output." Then read the new method in each language. In `NOTES.md`, write how it leaves out the paid invoices, and whether it returns cents or dollars.

**Checkpoint:** the new test passes in both languages and the tests are unchanged. Ask the agent to commit.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-3.md).

### Task 4. Schemas, tests first (30 minutes)

*Goal:* an `Invoice` and a `Vendor` schema in each language that refuse bad values.

1. Decide the cases, and what each must do. These are the minimum:

   | Case | Must |
   | --- | --- |
   | INV-8301 from `data/invoices.csv`, with fields named `number`, `vendorId`, `invoiceDate`, `dueDate`, `terms`, `amountCents` and `status` (`vendor_id` and so on in Python) | Pass |
   | INV-8301 with a null due date | Pass |
   | In Python only, INV-8301 with an empty due date, which the model turns into `None` | Pass |
   | INV-8301 with an amount of `-23450` | Fail |
   | INV-8301 with an amount of `4825.5` | Fail |
   | INV-8301 with terms `"Net 10"` | Fail |
   | INV-8301 with an invoice date of `"2026-13-02"` | Fail |
   | V001 from `data/vendors.csv`, with an empty name | Fail |

   Copy INV-8301's values from the file yourself. Write your cases in `NOTES.md`, under a heading "Task 4", with any more you want to add.
2. Send:

   > Please write failing tests from my cases in `NOTES.md`, under "Task 4", in `tests/schemas.test.ts` and `py/tests/test_schemas.py`. They are for `InvoiceSchema` and `VendorSchema` in `src/schemas.ts`, and `InvoiceModel` and `VendorModel` in `py/brightline_ap/schemas.py`, and none of them exists yet. Use my values exactly. Write only the tests, and don't change any other file.

   Then ask the agent to run `npm test` and `npm run test:py`. The new tests fail because Zod, Pydantic and the schema files do not exist yet. Read the error, and make sure that is the reason. Then ask the agent to commit the failing tests.
3. Send:

   > Please add the package `zod` with npm, and `pydantic` with `uv add` in `py/`, and ask me before each command. Then write the four schemas my tests name, so they pass. Give each rule a short message that says what is allowed. Don't change the tests. Run `npm test` and `npm run test:py` and show me the output.

   Before you approve each install, ask the three questions from [14.1](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/modules/#should-i-let-the-agent-add-a-package). Is the name spelled exactly right, is it the well-known package with that name, and is it needed at all?
4. Read both schema files. Compare each rule with [14.4's table](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/data-models-and-schemas/#what-is-a-schema), and write one sentence in `NOTES.md` for each line that carries a rule. Then ask the agent to run `git diff -- tests/ py/tests/`. It must print nothing, because no test has changed since your commit.
5. Now try a wrong value your tests never tried. A CSV file gives every amount as text. Predict what each schema does with INV-8301's amount as the text `"4825.0"`, and write it in `NOTES.md`. Then ask the agent to run each schema on it, and to show you the results. Last, write in `NOTES.md` one wrong value your schemas would pass, and what would catch it.

**Checkpoint:** every test passes in both languages, the tests are unchanged, and your prediction for `"4825.0"` and the real results are in `NOTES.md`. Ask the agent to commit, and then to run `git show --stat`. It must list `package-lock.json` and `py/uv.lock`.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-4.md).

### Task 5. Collect the errors (25 minutes)

*Goal:* a loader that reports every bad row, not only the first.

1. Decide the cases, and write them in `NOTES.md`, under a heading "Task 5". Cover at least these three:
   - `data/invoices.csv` loads with 15 valid rows and no errors.
   - `data/invoices-messy.csv` gives 11 valid rows and an error for each bad line, with its line number and invoice number. Open the file in a text editor, and find the four bad lines yourself. Line 1 is the header.
   - Rows whose amount is blank, only spaces, `4825.0` or `12.5` are all errors, never a zero or a rounded number.

   Send:

   > Please write tests from my cases in `NOTES.md`, under "Task 5", in `tests/load-invoices.test.ts` and `py/tests/test_load_invoices.py`. They are for a loader that doesn't exist yet, `src/load-invoices.ts` and `py/brightline_ap/load_invoices.py`. Use my line numbers and counts exactly. Write only the tests.

2. Send:

   > Now please write the loader in both languages, so I can run `npm run check-invoices -- <file>` on any export, and, from `py/`, `uv run python -m brightline_ap.load_invoices <file>`. Check every row with the schema, and also check that its vendor id is in `vendors.csv`. Turn an amount into a number only when it is a plain whole number, and pass anything else to the schema as a value it will refuse. Collect every problem with the line number, the invoice number and a message. Print one line per bad row and a count, and exit with a failure code when any row is bad. Don't stop at the first bad row. Make my tests pass without changing them.

3. Read the new loader. Find the lines that decide these three things, and write each one as a sentence in `NOTES.md`:
   - how the text of an amount becomes a number
   - where a bad row's problems are collected, so the run does not stop at the first
   - when the run exits with a failure code

   Then predict what the loader prints for each file, and ask the agent to run it on both files, in both languages.
4. Read the import lines of `src/due-by-friday.ts` again. Does the Friday list read its invoices through your loader? Write what you find in `NOTES.md`, and leave the file as it is.

**Checkpoint:** 11 valid, 4 errors, on the four lines in the answer key, in both languages, and `NOTES.md` says how the Friday list reads its invoices. Ask the agent to commit.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-5.md).

### Task 6. JSON and JSON Schema (15 minutes)

*Goal:* see your records as JSON, and see each schema as JSON Schema.

1. Send:

   > Please write `src/export-json.ts` and `py/brightline_ap/export_json.py`. Each reads `data/invoices.csv` through my loader, and writes the valid invoices to a JSON file in `out/`. Each also prints its schema as JSON Schema, with `z.toJSONSchema(InvoiceSchema)` and `InvoiceModel.model_json_schema()`. Please don't run them yet.

   Git ignores the `out/` folder.
2. Predict in `NOTES.md`: will the two JSON files name the fields the same way? Then ask the agent to run both. Expect a command such as `node src/export-json.ts` and, in `py/`, `uv run python -m brightline_ap.export_json`. Open the two JSON files in a text editor, and read the two JSON Schemas the agent shows you, side by side.
3. Write in `NOTES.md` at least one difference between the two JSON Schemas, and say whether it would matter to a program that reads them.

**Checkpoint:** two JSON files of 15 invoices each, and at least one real difference written down. Ask the agent to commit.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-6.md).

### Task 7. Call the API by hand (15 minutes)

*Goal:* read status codes and headers before any code depends on them.

By hand means one call at a time, with `curl`, a tool that sends one request and prints the answer.

1. Make up a key, any short text, such as `ana-test-42`. Send this, with your key in place of `<your key>`: "Please copy `.env.example` to `.env`, and put my made-up key, `<your key>`, in place of the placeholder. Then run `git status`." `.env` must not appear in what it prints, because git ignores it. The key is made up, so it does no harm when the agent reads it. If you ever use a real key, put it in `.env` yourself, in a text editor, and never paste it into a chat.
2. Send: "Please start the sample API with `npm run api`, in the background, and leave it running." In the background means it keeps running while the agent does other work.
3. Predict the status code of each call below, and write it in `NOTES.md`. Then ask the agent to run the calls one at a time, exactly as written, with your key in place of `<your key>`, and to show you the status line and the body of each.

   ```bash
   curl -i http://localhost:4010/vendors
   curl -i -H "X-API-Key: <your key>" http://localhost:4010/vendors
   curl -i -H "X-API-Key: <your key>" http://localhost:4010/vendors
   curl -i -H "X-API-Key: <your key>" "http://localhost:4010/invoices?status=open&page=2"
   curl -i -H "X-API-Key: <your key>" "http://localhost:4010/invoices?status=open&page=9"
   ```

   On Windows, if the agent uses PowerShell, the command is `curl.exe`, because `curl` there is another command. For each answer, write in `NOTES.md` what a client should do with it, from [14.6's table](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/json-and-rest-apis/#what-should-the-client-do-for-each-status-code).
4. Ask the agent to run `git log -p -S "<your key>" --oneline`, with your key. It must print nothing.

**Checkpoint:** you saw 401, then 503, then 200, then 200 with INV-8306 first, then 400, and your key is in no commit. Leave the API running for Task 8.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-7.md).

### Task 8. The async client, tests first (35 minutes)

*Goal:* a client that fetches vendors while it fetches every page of open invoices, retries once on 503, and times out.

1. Decide the cases, and write them in `NOTES.md`, under a heading "Task 8". Each test must fail if the behavior it names is removed. So each case counts the requests the server receives, and does not only look at the final answer. Your Task 7 calls showed how many pages there are. These are the minimum:
   - Each page of open invoices, 1, 2 and 3, is requested exactly once, and no invoice number comes back twice.
   - A first `503` is retried exactly once, so the server receives two requests. A server that stays busy fails after two requests.
   - A request that gets a `401` is not retried, so the server receives one request.
   - When each answer takes 200 milliseconds, the vendors request and the first invoices request arrive less than 100 milliseconds apart.
   - With a server that takes 500 milliseconds and a client deadline of 100 milliseconds, the call fails with a timeout.

   Send:

   > Please write failing tests from my cases in `NOTES.md`, under "Task 8", in `tests/ap-client.test.ts` and `py/tests/test_api_client.py`. They are for a client that doesn't exist yet, with `fetchVendors`, `fetchOpenInvoices` and `fetchVendorsAndOpenInvoices` in `src/ap-client.ts`, and `fetch_vendors`, `fetch_open_invoices` and `fetch_vendors_and_open_invoices` in `py/brightline_ap/api_client.py`. In TypeScript, have each test start its own copy of the sample API from `scripts/ap-api.ts`, on a free port, and count the requests it receives. In Python, use a fake API inside the test that counts its own requests. Write only the tests.

   After the task, the answer key shows one way to write each test.
2. Ask the agent to run `npm test` and `npm run test:py`. The new tests fail because `src/ap-client.ts` and `httpx` do not exist yet. Then ask it to commit the failing tests.
3. Send:

   > Now please create `src/ap-client.ts` with those three functions, using `fetch`. Give every call a two-second deadline, retry once on a 503, and never retry any other error. Validate every response body with the schemas. Add `npm run fetch-ap`, which reads the key from `.env` and prints the counts and the time. Then add `httpx` with `uv add` in `py/`, and write `py/brightline_ap/api_client.py` the same way with httpx, using `asyncio.timeout` for the deadline. Make my tests pass without changing them.

   Before you approve `uv add httpx`, ask the three questions from Task 4. When the tests pass, read the client. Find the lines that decide which errors are retried and how often, the deadline on each call, and where the two calls start together. Write each as a sentence in `NOTES.md`.
4. Predict in `NOTES.md`: now that your tests pass, will both clients pass against the real API, and how long will each run take? Say why. Then, with the API still running, ask the agent to run `npm run fetch-ap`, and then, in `py/`, `uv run --env-file ../.env python -m brightline_ap.api_client`. If the Python client fails on the first invoice, read the error before you ask for help. Compare the field names in the error with the JSON from Task 7. [14.6](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/json-and-rest-apis/#why-did-the-tests-pass-and-the-live-run-fail) says what to ask for.
5. Ask the agent to stop the API, and then to run `git diff -- tests/ py/tests/`. It must print nothing.

**Checkpoint:** both clients print 8 vendors and 13 open invoices, in about one second. One after the other, the calls would take 1.2 seconds or more. Every test passes, and the tests are unchanged. Ask the agent to commit.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-8.md).

### Task 9. Read SDK-shaped code (15 minutes)

*Goal:* name the shapes in code you did not write and will not write.

1. Open `exercises/sdk-shaped/ap-sdk.ts` and `exercises/sdk-shaped/ap_sdk.py` in a text editor. They have weaknesses put there on purpose.
2. In `NOTES.md`, list each shape from [14.8's table](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/reading-sdk-code/#which-shapes-will-i-meet), with the line where each file uses it.
3. Predict which line of `ap_sdk.py` will handle the first `503`, and write it in `NOTES.md`. Then ask the agent to start the API again with `npm run api`, in the background, and to run `uv run --env-file ../.env python ../exercises/sdk-shaped/ap_sdk.py` in `py/`. It prints 8 vendors, though the first call got a `503`. Name the lines that raised that error and called again, and compare them with your prediction. Then ask the agent to stop the API.
4. Review both files with the questions of [14.8](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/reading-sdk-code/#what-does-it-check-for-me-and-what-does-it-leave-to-me). Does it check each answer? Which errors does it retry, and how often? Does every call have a deadline, and does it close what it opens? Find at least four weaknesses, starting with the retry. What does it do on a `401`? Write in `NOTES.md` what you would ask the SDK's authors to change.

**Checkpoint:** your labels and your list of weaknesses match the answer key. You can say which line runs when each client's block ends, and what it really does.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-9.md).

### Task 10. Port to Codex (20 minutes)

*Goal:* one tests-first change, made by a second agent.

**The change.** Vendors may carry a remit email, the address that receives notice of each payment. When it is there, it must be a valid email address.

1. Decide the cases. These are the minimum:
   - a vendor with no remit email passes
   - `remitEmail: "ap@buckeye.example"` passes
   - `"ap@@buckeye"` fails
   - `""` fails

   In the agent you used for Tasks 1 to 9, send this, with your cases pasted under it:

   > Please make a new branch called `remit-tests` and switch to it. Then add tests to `tests/schemas.test.ts` from my cases below, for an optional `remitEmail` on `VendorSchema` in `src/schemas.ts`. Write only the tests, and don't change any other file.

   Expect `git switch -c remit-tests`. Predict which two of the new tests fail before the change, and why the other two already pass. Then ask the agent to run `npm test`, and watch the two new failures. Ask it to commit with the message "Failing tests for the remit email".
2. Open the folder in Codex, set *Work in* to *This computer* and the mode to *Ask for approval*. Send: "Please make a new branch called `port14-codex` from `remit-tests`, and switch to it." Expect `git switch -c port14-codex remit-tests`.
3. Send: "Please make the remit email tests in `tests/schemas.test.ts` pass by adding an optional `remitEmail` to `VendorSchema` in `src/schemas.ts`. Don't add any package, and don't change any test. Run `npm test` and `npm run typecheck`."
4. Before you ask for a commit, type `/review` and choose to review your uncommitted changes. Read the findings. Then read the diff yourself, find the line that adds `remitEmail`, and write one sentence about it in `NOTES.md`. Ask Codex to run `git diff remit-tests -- tests/`, which must print nothing.
5. Ask Codex to commit on `port14-codex`, and then to run `git status`. It must say the working tree is clean before you switch branches.
6. Ask Codex to run `git switch main`. Then write four notes on this port in `NOTES.md`:
   - what it asked before installing or running anything
   - whether it could reach `localhost`, where the client tests start their server
   - whether it tried to change a test
   - what its review found

   Ask Codex to commit them, so Task 12 can use them.

**Checkpoint:** every test passes on `port14-codex`, the tests are unchanged, and your notes say what Codex asked before acting. Your notes are committed on `main`.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-10.md).

### Task 11. Port to OpenCode (20 minutes)

*Goal:* the same change on an open-source agent.

1. If you skipped Task 10, do its step 1 first, so the branch `remit-tests` exists.
2. In a plain-text editor, not a word processor, create `opencode.jsonc` in `brightline-ap`, with the rules from [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/), Task 8. The zip does not include one.
3. Open the folder in OpenCode Desktop. Before you send anything, turn auto-accept off for this project, under Settings, then Projects.
4. Send: "Please make a new branch called `port14-opencode` from `remit-tests`, and switch to it." Expect `git switch -c port14-opencode remit-tests`. Then switch to the *plan* agent, and send: "Please read the remit email tests in `tests/schemas.test.ts`, and plan the change that makes them pass. Don't edit anything yet."
5. Switch to the *build* agent, and send the same brief as Task 10, step 3.
6. OpenCode's version 2 documentation names no review command. Read the review panel, or ask OpenCode to show you `git diff`. Then ask it to run `git diff remit-tests -- tests/`, which must print nothing.
7. Ask OpenCode to commit on `port14-opencode`, with `opencode.jsonc`, and then to run `git status`. It must show a clean working tree.
8. Ask OpenCode to run `git switch main`. Write the same four notes on this port in `NOTES.md`, and ask OpenCode to commit them.

**Checkpoint:** every test passes on `port14-opencode`, the tests are unchanged, and OpenCode asked before each edit and command. Your notes are committed on `main`.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-11.md).

### Task 12. Hand over and tag (10 minutes)

*Goal:* the next chapter starts from a tag on which every command passes.

1. Go back to the agent you used for Tasks 1 to 9. Ask it to run `git switch main`.
2. Update `NOTES.md` with the modules, the schemas, the loader, the API and the client. Then ask the agent to write `ports/ch14.md` from your notes, with a section for each agent you used, from your four notes on it. Tell the agent the next change, making the Friday list read its invoices through your loader, and why it comes first. Have it end the file with that.
3. Ask the agent to commit, and then to tag the commit with `git tag ch14`.
4. Try the tag in a clean copy, as in Lab 13. Send: "Please clone the tag `ch14` into a new folder, `ch14-check`, next to this folder. In `ch14-check`, install the packages from the lock files, and run the tests and the type checkers for both languages. Show me the output of each command." This is the one step where the agent works outside `brightline-ap`. Expect `git clone --branch ch14 brightline-ap ch14-check`, run from the folder that holds `brightline-ap`. Then expect the commands from Task 1, step 3. Git may say "detached HEAD" after the clone, which is normal for a tag.

**Checkpoint:** every command passes in `ch14-check`, and `git tag` in `brightline-ap` lists `ch14`. You can delete `ch14-check` afterwards.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-12.md).

### If something goes wrong

| Problem | What to try |
| --- | --- |
| `curl` gets "connection refused" | The API is not running, or runs on another port. Ask the agent to start it in the background with `npm run api`. |
| `npm run api` says to set `AP_API_KEY` | `.env` is missing. Ask the agent to copy `.env.example` to `.env`, with your made-up key in place of the placeholder, as in Task 7. |
| `npm run api` says the port is in use | An earlier API is still running. Ask the agent to list the commands it has running in the background, and to stop the old API. |
| The `503` never comes | Only the first vendors call with your key, after each start, gives 503. Ask the agent to restart the API to see it again. |
| The concurrency test fails on a slow computer | Ask the agent to run it again with nothing else running. If it still fails, read the client. The two calls must go to `Promise.all` or `asyncio.gather`, not be awaited one by one. |
| The type checker or Node refuses an `enum` or a parameter property | Ask for the plain form, as [14.3](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/classes-and-objects/#which-typescript-will-node-refuse) shows. |
| The agent edited a test to make it pass | Ask the agent to undo its change to the test. Then tell it in one sentence that the tests are the specification. |
| Codex cannot reach `localhost` | Its network proxy may block local addresses. Allow `localhost` in its settings for this project. If it still cannot, ask the agent you used for Tasks 1 to 9 to run the tests on `port14-codex`, and say so in your notes. |
| `git log -p` shows your key | The key was committed. Ask the agent to put a new made-up key in `.env`, and treat the old one as leaked. In real work, revoke it with whoever issued it. |
| `uv run` cannot find `httpx` or `pydantic` | Ask the agent to run `uv sync` in `py/`. |

### Python only

If you want Python and not TypeScript, do the Python half of each task and use this table for the rest.

| Task | Swap |
| --- | --- |
| 3 | Ask for `open_total_cents` and its test only |
| 4 to 6 | Ask for the Pydantic models, the loader and the export in Python only |
| 8 | Ask for the httpx client and its tests only |
| 10, 11 | Give the agent the same four cases, for `py/tests/test_schemas.py`, and ask for the remit email change in `py/brightline_ap/schemas.py`. You are done when those tests pass and `git diff remit-tests -- py/tests/` prints nothing |

### Without a paid Claude plan

Do Tasks 1 to 9 and 12 in Codex or OpenCode, with its safety settings from [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/) set first. Your port is the agent you did not use. Say which in `ports/ch14.md`. Codex may block `localhost`, so before Task 7, make sure it can reach the sample API, as [14.9](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/both-ai-vendors/) explains.

### Apply it to your vertical

Take one export or API from your own work, and describe one record in your own words: every field, its type, and what makes a value invalid. Write three bad records by hand, each wrong in a different way. Ask any coding agent to write a loader test from them that expects all three to be reported, and read the test against your records before you approve it. Then ask it to write the loader. Name who receives the loader's report when it refuses a record, and what the run does then. If the data comes from an API, write down the status codes it can return, and what your client should do for each, before any code exists.

*Domain expert and builder.* The domain expert says what makes a record invalid, including the rules that compare records, such as an unknown vendor, and who must hear when a record is refused. The agent writes them as a schema and checks. The builder reads each rule against the expert's list, and keeps the keys out of the repository.

### Artifact checklist

- [ ] Your import graph with its edges marked, and your method sentences, in `NOTES.md`
- [ ] `Terms` as a literal type in both languages, narrowed where text enters, and the planted calls fixed
- [ ] `openTotalCents` with its test, in both languages
- [ ] `src/schemas.ts` and `py/brightline_ap/schemas.py` with their tests, both lock files committed, and one wrong value they pass in `NOTES.md`
- [ ] The loader reporting 11 valid rows and 4 errors with line numbers, in both languages
- [ ] Two JSON exports and one JSON Schema difference in `NOTES.md`
- [ ] `.env` ignored by git, and your key in no commit
- [ ] The API client in both languages, with tests for pages, retry, no retry on 401, concurrency and timeout
- [ ] Your SDK shape labels in `NOTES.md`
- [ ] The branch `remit-tests`, and at least one of `port14-codex` and `port14-opencode`
- [ ] `ports/ch14.md` on main, ending with the next change
- [ ] Tag `ch14`, with every command passing in a clean clone
- [ ] Extension: the second port, and a schema for one record from your own work
