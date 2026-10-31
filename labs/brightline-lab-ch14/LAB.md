# Lab 14: models and an async client in two languages

Chapter 14 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 14: models and an async client in two languages](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/lab/), so you can do the lab without the book.

*Time: about 4 hours. Lab files: `brightline-lab-ch14.zip`, standalone. The same steps are in `LAB.md` inside the zip.*

### Before you start

**What you need.** The same apps and tools as Lab 13: the Claude desktop app with a paid plan, the ChatGPT desktop app, OpenCode Desktop, Git, Node.js 24 or later, and uv. You also need `curl`, which comes with macOS, Linux and Windows 10 or later, for Task 7. If a tool is missing, Lab 13's "Before you start" has the install steps.

**The core path and the extensions.** The core path is Tasks 1 to 9, at least one port, and Task 12. Task 9 can be done on another day.

**Python only.** Do the Python half of each task. In Task 3, add `open_total_cents`. In Tasks 4 to 6, write the Pydantic model and loader only. In Task 8, write the httpx client and its tests. In Tasks 10 and 11, make the remit email change in `py/brightline_ap/schemas.py`, with tests in `py/tests/test_schemas.py`: a vendor with no `remit_email` passes, `"ap@buckeye.example"` passes, and `"ap@@buckeye"` and `""` fail.

**Without a paid Claude plan.** Do Tasks 1 to 9 in Codex or OpenCode, with its safety settings set first, and port to the agent you did not use.

**The lab files.** Download [brightline-lab-ch14.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14.zip) and unzip it into a new folder. It contains:

- `brightline-ap/`, a plain copy of the repository at the end of Lab 13, with no git history. An agent has split it into modules and classes, which you read in Task 1. It also holds the lab's starting files: `data/invoices-messy.csv`, the sample API in `scripts/ap-api.ts`, `.env.example`, a planted call in `exercises/`, a wrong call put there on purpose, and the made-up SDK in `exercises/sdk-shaped/`. Task 1 puts it under git. Give only this folder to an agent.
- `concept-blocks/`, every code block from Chapter 14, ready to run.
- `LAB.md` and `field-guide-code-toolchain.md`.

Each task with an answer key links it as a separate download. Open a key in a text editor, never in the agent. An agent that can read the answers is not tested by them.

**The date in this lab.** Today is still Wednesday, March 3, 2027.

### The job

An agent split Brightline's scripts into modules and classes. Nobody has read the result. Meanwhile, the AP team wants to stop trusting the exports without checking them. Last month, an export from a new vendor portal had a negative amount, and nobody noticed for a week.

Ana wants three things, in both languages. Types that say exactly which terms exist. Schemas that check every record at the edge and report every bad row. And a small client for the AP system's API. It fetches vendors and every page of open invoices at once, retries once when the server is busy, and gives up when the server hangs. In the lab, a server on your own computer takes the place of the AP system. As in Lab 13, every total and every check comes from tested code, never from an AI's reply.

### How each task works

As in Lab 13. Work in *Manual* mode unless a task says otherwise, read every command before you approve it, predict before you run, and commit when a task's **Checkpoint** is true. Approve a package install only for the exact names a task lists.

### Task 1. Read the shape (20 minutes)

**Goal:** know the repository's structure before you change it.

1. Put the folder under git yourself, as in Lab 13. In a terminal, in `brightline-ap`, run `git init -b main`, then `git add .` and `git commit -m "Start from the end of Lab 13"`. `git log --oneline` now shows one commit.
2. Run `npm ci`, then in `py/` run `uv sync`. Run the four checks from Lab 13. They all pass.
3. From the file names in `src/` alone, predict which files import which, and draw it in `NOTES.md` as a list of arrows, such as `invoice-book -> due-date`.
4. Now read the import lines at the top of each file in `src/` and `scripts/`, and correct your graph. Then ask the agent: "List each file in `src/` and `scripts/` with the local files it imports. Change nothing."
5. Mark the edges in your graph before the foundations: each file that reads `data/`, and the function that turns each row into a record. For each, write in `NOTES.md` what it does with an amount it does not expect, such as a blank one.
6. Read `package.json` and `py/pyproject.toml`. Note each dependency and what the lock files are for.

**Checkpoint:** your graph in `NOTES.md` matches the answer key, with the edges marked, and you can name the two files most others import.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-1.md) and open it in a text editor, not in the agent.

### Task 2. Write the types (20 minutes)

**Goal:** a literal type for terms, in both languages, and the type checkers catching a wrong call.

1. Read `exercises/wrong-call.ts` and `exercises/wrong_call.py`. Run `npm run typecheck` and `npm run check:py`. Predict first, in `NOTES.md`: will either catch `"Net 10"`? Then compare with what the type checkers print.
2. Send:

   > In `src/due-date.ts`, add `export type Terms` as the five known terms, a type guard `isTerms(text: string): text is Terms`, and `parseTerms(text: string): Terms`, which throws `Unknown terms: <text>` for anything else. Change `termsDays` and `dueDate` to take `Terms`. Do the same in `py/brightline_ap/due_date.py` with `Literal`, `TypeGuard`, `is_terms` and `parse_terms`. Then run `npm run typecheck` and `npm run check:py` and show me every error. Do not fix anything yet.

3. Read the errors. Sort them into three kinds: raw text from a file, the test that checks unknown terms on purpose, and the planted call. Write the count of each in `NOTES.md`.
4. Send: "Fix each error where raw text enters, with `parseTerms` or `parse_terms`. In the tests, mark the unknown-terms call as expected to fail type checking, with `// @ts-expect-error` and `# pyright: ignore[reportArgumentType]`, and do not change what the tests check. Leave the planted calls alone." Run the checks again. Only the two planted calls should fail.
5. Change both planted calls from `"Net 10"` to `"Net 15"` yourself, and run every check.

**Checkpoint:** in step 1, neither type checker caught `"Net 10"`, because `terms` was only a `string`. Before step 5, both named the planted call. After it, all checks pass, and `git diff` on the tests shows only the two marking comments. Commit.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-2.md) and open it in a text editor, not in the agent.

### Task 3. Read and change a class (25 minutes)

**Goal:** read a class by its methods, then add one, test first.

1. Read `src/invoice-book.ts` and `py/brightline_ap/invoice_book.py`. For each method, write one sentence in `NOTES.md` saying what it returns.
2. Predict: for the real data, how many invoices does `open()` return, and how many does `dueBy("2027-03-05")` return? Check with the tests in `tests/invoice-book.test.ts`.
3. Write a test first, in both languages: `openTotalCents()`, `open_total_cents()` in Python, returns the total of the open invoices in cents. The answer is in the answer key, but work it out from the data first. Run it and watch it fail.
4. Ask the agent to add the method without changing the test.

**Checkpoint:** the new test passes in both languages and the tests are unchanged. Commit.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-3.md) and open it in a text editor, not in the agent.

### Task 4. Schemas, tests first (30 minutes)

**Goal:** an `Invoice` and a `Vendor` schema in each language that refuse bad values.

1. Write `tests/schemas.test.ts` and `py/tests/test_schemas.py` first. Use one good invoice, INV-8301 from the data, with fields named `number`, `vendorId`, `invoiceDate`, `dueDate`, `terms`, `amountCents` and `status` (`vendor_id` and so on in Python). Test that it passes, and that a null due date passes. In Python, also test an empty due date, which the model turns into `None`. Then test that each of these fails: an amount of `-23450`, an amount of `4825.5`, terms `"Net 10"`, and an invoice date of `"2026-13-02"`. Add one test that a vendor with an empty name fails. Run them. They fail because Zod, Pydantic and the schema files do not exist yet. Read the error and check that this is the reason.
2. Commit the failing tests.
3. Send:

   > Add the package `zod` with npm, and `pydantic` with `uv add` in `py/`. Ask before each command. Then create `src/schemas.ts` with `InvoiceSchema` and `VendorSchema`, and `py/brightline_ap/schemas.py` with `InvoiceModel` and `VendorModel`, so my tests pass. Each rule gets a short message that says what is allowed. Do not change the tests.

4. Approve only `zod` and `pydantic`. Compare each schema rule with Concept 14.4's table.
5. In `NOTES.md`, write one wrong value your schema would pass, and the check that would catch it.

**Checkpoint:** every test passes in both languages, the tests are unchanged, and `git show --stat` for the commit lists `package-lock.json` and `py/uv.lock`. Commit.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-4.md) and open it in a text editor, not in the agent.

### Task 5. Collect the errors (25 minutes)

**Goal:** a loader that reports every bad row, not only the first.

1. Write tests first. `data/invoices.csv` loads with 15 valid rows and no errors. `data/invoices-messy.csv` gives 11 valid rows and an error for each bad line, with its line number and invoice number. Find the four bad lines yourself by reading the file. Line 1 is the header. Add one more test: rows whose amount is blank, only spaces, `4825.0` or `12.5` are all errors, never a zero or a rounded number.
2. Send:

   > Create `src/load-invoices.ts`, run as `npm run check-invoices -- <file>`, and `py/brightline_ap/load_invoices.py`. Check every row with the schema, and also check that its vendor id is in `vendors.csv`. Turn an amount into a number only when it is a plain whole number, and pass anything else to the schema as a value it will refuse. Collect every problem with the line number, the invoice number and a message. Print one line per bad row and a count, and exit with a failure code when any row is bad. Do not stop at the first bad row. Make my tests pass without changing them.

3. Run it on both files, in both languages.
4. Read the import lines of `src/due-by-friday.ts` again. Does the Friday list read its invoices through your loader? Write what you find in `NOTES.md`, and leave the file as it is.

**Checkpoint:** 11 valid, 4 errors, on the four lines in the answer key, in both languages, and `NOTES.md` says how the Friday list reads its invoices. Commit.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-5.md) and open it in a text editor, not in the agent.

### Task 6. JSON and JSON Schema (15 minutes)

**Goal:** see your records as JSON, and see each schema as JSON Schema.

1. Ask the agent for `src/export-json.ts` and `py/brightline_ap/export_json.py`. Each writes the valid invoices from `data/invoices.csv` to a JSON file in `out/`, which git ignores. Each also prints its schema as JSON Schema, with `z.toJSONSchema(InvoiceSchema)` and `InvoiceModel.model_json_schema()`.
2. Run both. Open the two JSON files and the two JSON Schemas side by side.
3. Write in `NOTES.md` at least one difference between the two JSON Schemas, and say whether it would matter to a program that reads them.

**Checkpoint:** two JSON files of 15 invoices each, and at least one real difference written down. Commit.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-6.md) and open it in a text editor, not in the agent.

### Task 7. Call the API by hand (15 minutes)

**Goal:** read status codes and headers before any code depends on them.

1. Copy `.env.example` to `.env`, and replace the placeholder with a made-up key of your own. Run `git status`: `.env` must not appear.
2. In a second terminal, run `npm run api`. Leave it running.
3. In the first terminal, run each command, and predict the status code first:

   ```bash
   curl -i http://localhost:4010/vendors
   curl -i -H "X-API-Key: <your key>" http://localhost:4010/vendors
   curl -i -H "X-API-Key: <your key>" http://localhost:4010/vendors
   curl -i -H "X-API-Key: <your key>" "http://localhost:4010/invoices?status=open&page=2"
   curl -i -H "X-API-Key: <your key>" "http://localhost:4010/invoices?status=open&page=9"
   ```

4. Run `git log -p -S "<your key>" --oneline`. It must print nothing.

In Windows PowerShell, type `curl.exe` instead of `curl`, because `curl` there is another command.

**Checkpoint:** you saw 401, then 503, then 200, then 200 with INV-8306 first, then 400, and your key is in no commit. Leave the API running for Task 8.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-7.md) and open it in a text editor, not in the agent.

### Task 8. The async client, tests first (35 minutes)

**Goal:** a client that fetches vendors and every page of open invoices at the same time, retries once on 503, and times out.

1. Write the tests first, in both languages. Each test must fail if the behavior it names is removed, so count requests, and do not only check the final answer. They must check five things:
   - each page of open invoices is requested once, and no invoice comes back twice
   - a first 503 is retried exactly once (two requests), and a server that stays busy fails after two
   - a 401 is sent only once
   - the vendors and invoices requests arrive at about the same time
   - the client's own deadline stops a slow answer

   In TypeScript, log the requests with `server.on("request", ...)`. In Python, the fake API can log them itself. In TypeScript, start the sample API inside the test with `createApApi` from `scripts/ap-api.ts`, on port 0 so the system picks a free port. In Python, use `httpx.MockTransport`, a fake network inside the test. The answer key shows one way to write each test.
2. Commit the failing tests.
3. Send:

   > Create `src/ap-client.ts` with `fetchVendors`, `fetchOpenInvoices` and `fetchVendorsAndOpenInvoices`, using `fetch` with a two-second timeout, one retry on 503 and no retry on any other error, and check every response body with the schemas. Add `npm run fetch-ap`, which reads the key from `.env` and prints the counts and the time. Then write `py/brightline_ap/api_client.py` the same way with httpx, after adding `httpx` with `uv add`, with a two-second `asyncio.timeout` deadline on every call. Make my tests pass without changing them.

4. Predict in `NOTES.md`: now that the tests against your fake API pass, will both clients pass against the real one? Say why. Then, with the API still running, run `npm run fetch-ap`, and in `py/`, run `uv run --env-file ../.env python -m brightline_ap.api_client`. If the Python client fails on the first invoice, read the error before you ask for help: compare the field names in the error with the JSON from Task 7. Concept 14.6 says what to ask for.
5. Stop the API with Ctrl+C.

**Checkpoint:** both clients print 8 vendors and 13 open invoices, in about one second, not one and a half. Every test passes, and the tests are unchanged. Commit.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-8.md) and open it in a text editor, not in the agent.

### Task 9. Read SDK-shaped code (15 minutes)

**Goal:** name the shapes in code you did not write and will not write.

1. Open `exercises/sdk-shaped/ap-sdk.ts` and `exercises/sdk-shaped/ap_sdk.py`. They are reading samples with weaknesses put there on purpose, so read them as code under review.
2. Copy each file's line numbers into `NOTES.md` next to the shape on that line: the class, each async method, the generator or async generator, the async loop, the context manager, and the decorator or wrapper function.
3. Start the API again, run `uv run --env-file ../.env python ../exercises/sdk-shaped/ap_sdk.py` from `py/`, and explain which line handled the first `503`.
4. Review both files against Concepts 14.4 to 14.7. Find at least four weaknesses, starting with the retry: what does it do on a `401`? Then look for a missing timeout, answers used without a schema, a missing status check, and a dispose method that closes nothing. Write in `NOTES.md` what you would ask the SDK's authors to change.

**Checkpoint:** your labels and your list of weaknesses match the answer key. You can say which line runs when each client's block ends, and what it really does.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-9.md) and open it in a text editor, not in the agent.

### Task 10. Port to Codex (20 minutes)

**Goal:** one tests-first change, made by a second agent.

**The change.** Vendors may carry a remit email, the address that receives notice of each payment. When it is there, it must be a valid email address.

1. Run `git switch -c remit-tests`. Add tests to `tests/schemas.test.ts`: a vendor with no remit email passes, `remitEmail: "ap@buckeye.example"` passes, and `"ap@@buckeye"` and `""` fail. Run them, watch the two new failures, and commit.
2. Run `git switch -c port14-codex remit-tests`. Open the folder in Codex in *Ask for approval* mode.
3. Send: "Make the remit email tests in `tests/schemas.test.ts` pass by adding an optional `remitEmail` to `VendorSchema` in `src/schemas.ts`. Do not add any package. Do not change any test. Run `npm test` and `npm run typecheck`."
4. Type `/review` and choose to review your uncommitted changes. Then run `git diff remit-tests -- tests/`, which must be empty.
5. Commit on `port14-codex`, and check that `git status` shows a clean working tree before you switch branches.

**Checkpoint:** every test passes on `port14-codex`, the tests are unchanged, and your notes say what Codex asked before acting.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-10.md) and open it in a text editor, not in the agent.

### Task 11. Port to OpenCode (20 minutes)

**Goal:** the same change on an open-source agent.

1. If you skipped Task 10, do its step 1 first, so the branch `remit-tests` exists. Then run `git switch -c port14-opencode remit-tests`. Create `opencode.jsonc` with the rules from Lab 12, Task 11, because the zip does not include one. Make sure auto-accept is off.
2. In OpenCode Desktop, use the *plan* agent first, then the *build* agent with the same brief as Task 10, step 3.
3. Read the review panel or `git diff`, and run `git diff remit-tests -- tests/`.
4. Commit on `port14-opencode`, and check that `git status` shows a clean working tree.

**Checkpoint:** every test passes on `port14-opencode`, the tests are unchanged, and OpenCode asked before each edit and command.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-11.md) and open it in a text editor, not in the agent.

### Task 12. Hand over and tag (10 minutes)

**Goal:** the next chapter starts from a tag that passes every check.

1. Run `git switch main`. Make sure no API server is still running.
2. Update `NOTES.md` with the modules, the schemas, the loader, the API and the client. Write `ports/ch14.md`: for each agent, whether it could reach the API on `localhost`, what it asked before installing or running, whether it tried to change a test, and what its review found. End with the next change and why it comes first: the Friday list you checked in Task 5.
3. Commit, then run `git tag ch14`.
4. Check the tag from a clean copy, as in Lab 13: `git clone --branch ch14 brightline-ap ch14-check`, then in `ch14-check` run `npm ci`, `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py`.

**Checkpoint:** every command passes in `ch14-check`, and `git tag` lists `ch14`.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-12.md) and open it in a text editor, not in the agent.

### If something goes wrong

| Problem | What to try |
| --- | --- |
| `npm run api` says to set `AP_API_KEY` | Copy `.env.example` to `.env` and put a key in it. |
| `curl` gets "connection refused" | The API is not running, or runs on another port. Start it in a second terminal with `npm run api`. |
| The second terminal says the port is in use | An earlier API is still running. Stop it with Ctrl+C in its terminal, or ask the agent to list and stop background commands. |
| Every `/vendors` call gives 503 | Only the first call after a start gives 503. Restart the API to see it again. |
| The Python client refuses every invoice from the API | The JSON names are camelCase and the model expects snake_case. Ask for the model to accept both, with Pydantic aliases. |
| The concurrency test fails on a slow computer | Run it again with nothing else running. If it still fails, check that the two calls are passed to `Promise.all` or `asyncio.gather`, not awaited one by one. |
| Node reports a parameter property or `enum` error | Ask for the plain form: declare the field, then assign it in the constructor. |
| The agent wants to install a package the task does not list | Say no, and ask what it needs it for. |
| Codex cannot reach `localhost` | Its network proxy may block local addresses. Allow `localhost` in its settings for this project, or run the client yourself in a terminal. |
| `git log -p` shows your key | The key was committed. Change the key in `.env`, and treat the old one as leaked. In real work, revoke it with whoever issued it. |
| `uv run` cannot find `httpx` or `pydantic` | Run `uv sync` in `py/`. |

### Apply it to your vertical

Take one export or API from your own work and write a schema for one record: every field, its type, and what makes a value invalid. Write three bad records by hand, each wrong in a different way, and a loader test that expects all three to be reported. Then ask any coding agent to write the loader. Name who receives the loader's report when it refuses a record, and what the run does then. If the data comes from an API, write down the status codes it can return, and what your client should do for each, before any code exists.

*Domain expert and builder.* The domain expert says what makes a record invalid, including the rules that compare records, such as an unknown vendor, and who must hear when a record is refused. The builder writes them as a schema and checks, and keeps the keys out of the repository.

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
- [ ] Tag `ch14`, checked from a clean clone
- [ ] Extension: the second port, and a schema for one record from your own work
