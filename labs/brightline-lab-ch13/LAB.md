# Lab 13: the due-date calculator in two languages

Chapter 13 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 13: the due-date calculator in two languages](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/lab/), so you can do the lab without the book.

*Time: about 3 hours 40 minutes. Lab files: `brightline-lab-ch13.zip`, standalone. The same steps are in `LAB.md` inside the zip.*

### Before you start

*What you need.*

- The Claude desktop app with a Pro, Max, Team or Enterprise plan, for Tasks 1 to 9 and 12.
- The ChatGPT desktop app with any plan, for Task 10, and OpenCode Desktop with a model connected, for Task 11, as in Lab 12.
- Git, Node.js 24 or later, and uv, the Python project tool. Install these yourself before Task 1. The agent installs only the project's packages, with your approval.

**Install the tools.** Open a terminal: Terminal on macOS, PowerShell or Git Bash on Windows, or any terminal on Linux. Run `git --version`, `node --version` and `uv --version`. `node --version` must print `v24` or higher. Install only what is missing or too old, then close and reopen the terminal and check again.

- *Git.* Download it for your system from [git-scm.com](https://git-scm.com).
- *Node.js.* Go to [nodejs.org/en/download](https://nodejs.org/en/download), choose the LTS version and your operating system, and use the installer or the commands the page shows.
- *uv.* On macOS and Linux, run `curl -LsSf https://astral.sh/uv/install.sh | sh`. On Windows, in PowerShell, run `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`. With a package manager, run `brew install uv` on macOS or `winget install --id=astral-sh.uv -e` on Windows.
- *Python.* You do not need to install it. uv downloads Python 3.12 or later the first time the project needs it.

The field guide for the code toolchain has more detail and a table for fixing problems. A copy, `field-guide-code-toolchain.md`, comes with the lab download.

**The core path and the extensions.** The core path is Tasks 1 to 9, at least one port (Task 10 or 11), and Task 12. A port makes the same change with a second agent. The second port is an extension.

**Python only.** If you want Python and not TypeScript, do the Python half of each task and use this table for the rest.

| Task | Swap |
| --- | --- |
| 1 | Do prompt items 3 and 4. Skip the TypeScript packages and `tsconfig.json`. Run the Python checks from `py/` with `uv run pytest`, `uv run pyright` and `uv run ruff check` |
| 2 to 4 | Predict and run the Python version only |
| 5 to 7 | Write the Python tests in Task 5, skip Task 6, and do Task 7 |
| 8, 9 | Write the reconciliation script in Python |
| 10, 11 | Add the weekend rule to `py/brightline_ap/due_date.py` as `pay_by(due: str) -> str`, with the same four `payBy` test cases in `py/tests/test_weekend.py`. Skip the due-by-Friday test and the due-by-Friday change. You are done when the `pay_by` tests pass and `git diff weekend-tests -- py/tests/` is empty |
| 12 | Check the tag with the Python commands only |

**Without a paid Claude plan.** Do Tasks 1 to 9 in Codex or OpenCode, with its safety settings from Lab 12 set first. Your port is the agent you did not use. Say which in `ports/ch13.md`.

**The lab files.** Download [brightline-lab-ch13.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13.zip) and unzip it into a new folder. It contains:

- `brightline-ap/`, a plain copy of the repository at the end of Lab 12, with no git history. It also holds the lab files: a Python version of the vendor list in `py/`, `data/invoices-check.csv`, `data/invoices-no-terms.csv`, and two scripts in `exercises/`. Task 1 puts it under git. This is the only folder you give an agent.
- `concept-blocks/`, every runnable code block from the chapter.
- `LAB.md` and `field-guide-code-toolchain.md`.

Each task with an answer key links it as a separate download. Open a key in a text editor, never in the agent. An agent that can read the answers is not tested by them.

Use the zip's copy for this lab, even if you finished Lab 12 in your own repository. The answer keys match the zip's files exactly.

**The date in this lab.** Today is still Wednesday, March 3, 2027, and the payment run is Friday, March 5.

### The job

Brightline's due-date rule is the invoice date plus the days in the terms. It is hidden inside the Chapter 12 script. Nobody has tested it on a month end, a year end or a leap day, and nobody knows what it does with terms it has never seen. Ana wants it moved out into its own function, with a contract and full tests, in both languages, so the team can trust it and reuse it. Then she wants a script that checks every stated due date in an export against the rule. Your check from Lab 12 stays: after every change on `main`, `npm run due -- 2027-03-05` must still print 8 invoices and $19,229.53. Reading adds the rule, which the check cannot see. You will read the code the agent wrote, predict what it does, test it first, and port one change to two other agents. No number in this lab comes from an AI's reply. Every date, count and total is printed by code your tests have checked.

### How each task works

Each task has a goal, steps and a **Checkpoint**. Do not start the next task until the checkpoint is true. Work in *Manual* mode unless a task says otherwise, read every command before you approve it, and write each prediction in `NOTES.md` before you run anything.

### Task 1. Set up the workbench (20 minutes)

*Goal:* one command checks each language.

1. Put the folder under git yourself. In a terminal, in `brightline-ap`, run `git init -b main`, then `git add .` and `git commit -m "Start from the end of Lab 12"`. `git log --oneline` now shows one commit.
2. Open `brightline-ap` in the Claude desktop app's *Code* tab, in a *Local* session, in *Manual* mode.
3. Send this, then approve each command only after you have read it. The only packages it should add are `typescript`, `@types/node`, `pytest`, `pyright` and `ruff`. Say no to anything else. These are **dev dependencies**: packages the project needs only while you develop and check it, not when it runs. A package is other people's code published under one name. Chapter 14 covers packages and dependencies in full.

   > Set up the type checker and the Python tools. Ask before each command.
   >
   > 1. Add `typescript` and `@types/node@24` as dev dependencies. Create `tsconfig.json` for type checking only, with `target` esnext, `module` and `moduleResolution` nodenext, `strict`, `noEmit`, `allowImportingTsExtensions`, `erasableSyntaxOnly`, `verbatimModuleSyntax`, `skipLibCheck`, and `types` set to node. Include `src`, `tests` and `scripts`.
   > 2. Add three npm scripts: `typecheck` runs `tsc --noEmit`, `test:py` runs `cd py && uv run pytest`, and `check:py` runs `cd py && uv run pyright && uv run ruff check`.
   > 3. `py/` already holds the package `brightline_ap` and its tests. Write `py/pyproject.toml` yourself, and do not run `uv init`. Name the project `brightline-ap`, require Python 3.12 or later, with no dependencies. Set pytest's `testpaths` to `tests` and `pythonpath` to `.`, Pyright's `typeCheckingMode` to `strict`, and its `include` to `brightline_ap` and `tests`. Then add pytest, pyright and ruff with `uv add --dev`.
   > 4. Add `node_modules/`, `py/.venv/`, `__pycache__/`, `.pytest_cache/`, `.ruff_cache/`, `.env` and `out/` to `.gitignore`.

4. Run `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py` yourself.
5. Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-1.md) and open it in a text editor, not in the agent. Compare `tsconfig.json` and `py/pyproject.toml` with it, then commit with the message "Set up the workbench". Make sure `package-lock.json` and `py/uv.lock` are in the commit.

**Checkpoint:** all four commands pass. `npm test` shows 7 tests and `npm run test:py` shows 2.

### Task 2. Predict, run, investigate (20 minutes)

*Goal:* read both vendor scripts before you run them.

1. Open `src/list-vendors.ts` and `py/brightline_ap/list_vendors.py` in a text editor. Read them side by side.
2. In `NOTES.md`, under a heading "Task 2", write what each one prints: how many lines, which vendor first and last, and the exact shape of one line.
3. Run `npm run vendors`. Then, in `py/`, run `uv run python -m brightline_ap.list_vendors`.
4. Mark each part of your prediction right or wrong. For the first thing you got wrong, ask the agent: "Explain line N of this file, and why it prints what it prints." If you got everything right, ask instead: "What input would make this script print something wrong?"
5. Paste the real output under your prediction.

**Checkpoint:** `NOTES.md` holds your prediction, the real output, and one question you asked with its answer in your own words.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-2.md) and open it in a text editor, not in the agent.

### Task 3. Modify (15 minutes)

*Goal:* change one thing and predict the result first.

1. Predict the new order and write it in `NOTES.md`. The vendors are sorted by the days in their terms, fewest first, with "Due on receipt" as 0 days. Vendors with the same terms stay in file order.
2. Send:

   > In `src/list-vendors.ts` and `py/brightline_ap/list_vendors.py`, print the vendors sorted by the number of days in their terms, fewest first. "Due on receipt" is 0 days. Keep vendors with the same terms in the order they appear in the file. Do not change the tests. Show me the diff before you run anything.

3. Read the diff. Find the sort line in each language, and write in `NOTES.md` what each one compares, before you run anything. Then run both scripts.

**Checkpoint:** both print the same order, which matches the answer key. `npm test` and `npm run test:py` still pass. Commit.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-3.md) and open it in a text editor, not in the agent.

### Task 4. The text-or-number trap (15 minutes)

*Goal:* see a type mistake run in one language, stop in the other, and get caught by both type checkers.

1. Read `exercises/total-open.ts` and `exercises/total_open.py`. Predict what each prints, and write it down.
2. Run `node exercises/total-open.ts`. Then, in `py/`, run `uv run python ../exercises/total_open.py`.
3. In `NOTES.md`, explain in two sentences why the two languages behave differently. Concept 13.3 has the reason.
4. Send: "Add `exercises` to the folders `tsconfig.json` includes, and `../exercises` to Pyright's include in `py/pyproject.toml`. Then run `npm run typecheck` and `npm run check:py` and show me the output. Do not fix anything yet." Read both errors. Each names the file, the line and the problem.
5. Now ask the agent to fix both scripts by converting the amount to a number where it is read, and run them again.

**Checkpoint:** both scripts print the total in the answer key, and both type checks pass. Commit.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-4.md) and open it in a text editor, not in the agent.

### Task 5. Write the tests first (25 minutes)

*Goal:* the specification for the due-date calculator, as failing tests, in both languages.

1. Create `tests/due-date.test.ts` and `py/tests/test_due_date.py`. You choose the cases. Write the tests yourself, or give each case to the agent in *Manual* mode and read every line before you approve it. These cases are the minimum:

   | Invoice date | Terms | Due date |
   | --- | --- | --- |
   | 2026-10-23 | Net 15 | 2026-11-07 |
   | 2026-10-07 | Net 30 | 2026-11-06 |
   | 2026-09-15 | Net 45 | 2026-10-30 |
   | 2026-09-05 | Net 60 | 2026-11-04 |
   | 2026-11-02 | Due on receipt | 2026-11-02 |
   | 2026-10-20 | Net 15 | 2026-11-04 (a month end) |
   | 2026-12-20 | Net 30 | 2027-01-19 (a year end) |
   | 2028-02-15 | Net 15 | 2028-03-01 (a leap year) |
   | 2026-10-01 | Net 10 | an error with the message "Unknown terms: Net 10" |

   The function is `dueDate(invoiceDate, terms)` in `src/due-date.ts`, and `due_date(invoice_date, terms)` in `py/brightline_ap/due_date.py`. Concept 13.9 shows the shape of each test file.

   Add one more test, to `tests/due-by-friday.test.ts`: an open invoice with an empty due date and terms `Net 10` must stop with `Unknown terms: Net 10`. Today the payment script has its own date code, which reads any number after "Net" and accepts Net 10 without any warning. This test makes the script use the one tested engine.
2. Run `npm test` and `npm run test:py`. The new due-date tests must fail because the module does not exist yet, and the new due-by-friday test must fail because nothing was thrown. Read each error and make sure that is the reason.
3. Commit with the message "Failing tests for dueDate". Then run `git log -1 --format=%h` and write the short id it prints in `NOTES.md`. That commit is your tests' baseline. In Tasks 6 and 7 you compare against it.
4. Impossible dates are not in this table, on purpose. Try `2026-02-30` in each language once the code exists. Python refuses it, and a JavaScript `Date` turns it into March 2 without any warning. Chapter 14 refuses bad dates at the edge of the program, with a schema. As an extension, add the case here and ask the agent to make the TypeScript version refuse it too.

**Checkpoint:** the commit holds the three test files, its id is in `NOTES.md`, and the test runs fail for the reasons above, not because of a mistake in a test.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-5.md) and open it in a text editor, not in the agent.

### Task 6. Generate in TypeScript (20 minutes)

*Goal:* the agent writes the code that passes your tests, and leaves the tests alone.

1. Send:

   > Create `src/due-date.ts` so the tests in `tests/due-date.test.ts` pass. Export `dueDate(invoiceDate: string, terms: string): string` and `termsDays(terms: string): number`. The known terms are Net 15, Net 30, Net 45, Net 60 and Due on receipt. Any other terms throw an `Error` with the message `Unknown terms: <terms>`. Do the date math in UTC. Then make `src/due-by-friday.ts` use `dueDate` in place of its own `addDays` and `termsDays`, and delete those two, so the payment report and the calculator are one engine. Make `src/list-vendors.ts` sort with `termsDays` too. Do not change any test. Run `npm test` and `npm run typecheck` and show me the output.

2. Run `git diff <baseline> -- tests/`, with the id from Task 5. It must show nothing. Run `git status --short` too, and check that no file under `tests/` is listed.
3. Read `src/due-date.ts`. Say its promise in one sentence, and find the line that does the UTC math.
4. On macOS, Linux or Git Bash, run the tests in two more time zones: `TZ=America/Los_Angeles npm test` and `TZ=Asia/Tokyo npm test`. Run `npm run due -- 2027-03-05` in all three time zones too, with the same `TZ=` in front.

**Checkpoint:** `npm test` and `npm run typecheck` pass, and `src/due-by-friday.ts` imports `dueDate` and has no date code of its own. `npm run due -- 2027-03-05` still prints 8 invoices and $19,229.53, in all three time zones. `git diff <baseline> -- tests/` is empty. Commit.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-6.md) and open it in a text editor, not in the agent.

### Task 7. The same in Python (20 minutes)

*Goal:* the Python version, from the Python tests.

1. Send the same brief for `py/brightline_ap/due_date.py`, with `due_date(invoice_date: str, terms: str) -> str` and `terms_days(terms: str) -> int`, raising `ValueError` for unknown terms, and `list_vendors.py` sorting with `terms_days`. Ask it to run `npm run test:py` and `npm run check:py`.
2. Run `git diff <baseline> -- py/tests/`. It must show nothing.
3. Read both files side by side. Find one place where the two languages do the same thing differently, and note it.

**Checkpoint:** every Python test passes, including all your due-date cases, `npm run check:py` passes, and `git diff <baseline> -- py/tests/` is empty. Commit.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-7.md) and open it in a text editor, not in the agent.

### Task 8. Reconcile the export (20 minutes)

*Goal:* a script that checks every stated due date against the rule.

1. Choose a language. Write four tests first. A row whose stated date matches is not reported. A row whose stated date is wrong is reported with the invoice number, the stated date and the computed date. A row with an empty `due_date` is skipped. And the same file with Windows line endings gives the same result.
2. Send, for TypeScript:

   > Create `src/reconcile.ts`, run as `npm run reconcile -- <file>`. For each row with a stated `due_date`, compute the due date with `dueDate` from `src/due-date.ts`, and report each row where they differ, then a count. Skip rows with an empty `due_date`. Find each column by its name in the header row. Make my tests pass without changing them.

   For Python, ask for `py/brightline_ap/reconcile.py`, run as `uv run python -m brightline_ap.reconcile <file>` from `py/`.
3. Predict the result on `data/invoices.csv`, then run it. Then run it on `data/invoices-check.csv`.

**Checkpoint:** 0 mismatches in `invoices.csv`, and exactly 2 in `invoices-check.csv`, with the invoice numbers in the answer key. Commit.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-8.md) and open it in a text editor, not in the agent.

### Task 9. Read an error (10 minutes)

*Goal:* name an error precisely before you ask for help.

1. Run the reconciliation script on `data/invoices-no-terms.csv`.
2. Read the error report. In Python start at the bottom, and in TypeScript start at the top. Find the first line in a file you own.
3. Before you ask the agent anything, write one sentence in `NOTES.md` that names the file, the line and the cause.
4. Now ask the agent what it thinks, and compare.

**Checkpoint:** your sentence names the file and line in your own code, and the missing `terms` column as the cause. Update `NOTES.md` with what the due-date function and the reconciliation script do, and commit.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-9.md) and open it in a text editor, not in the agent.

### Task 10. Port to Codex (25 minutes)

*Goal:* one tests-first change, made by a second agent, with a review before the commit.

**The change.** The finance team is considering a new policy: a due date that falls on a Saturday or Sunday is paid on the Friday before. It is a proposal, so it lives on its own branches, and `main` keeps the Chapter 12 answer. Your notes on each port go in `NOTES.md` on `main`: switch back to it, write them, and commit, so Task 12 can use them.

1. Run `git switch -c weekend-tests`. Write `tests/weekend.test.ts` yourself, for a function `payBy(due)` in `src/due-date.ts`:
   - `2026-11-07`, a Saturday, gives `2026-11-06`
   - `2026-11-01`, a Sunday, gives `2026-10-30`
   - `2026-11-04`, a Wednesday, does not move
   - `2026-08-01`, a Saturday, gives `2026-07-31` (across a month end)
   - with the rule, `dueBy` in `src/due-by-friday.ts` gives 10 invoices and 3,310,953 cents for the cutoff 2027-03-05
2. Run `npm test`. The new tests must fail because `payBy` does not exist. Commit with the message "Failing tests for the weekend rule".
3. Run `git switch -c port-codex weekend-tests`. Open the folder in Codex, set *Work in* to *This computer* and the mode to *Ask for approval*.
4. Send: "Make the tests in `tests/weekend.test.ts` pass. Add `payBy(due: string): string` to `src/due-date.ts`, and use it in `src/due-by-friday.ts` so a weekend due date counts as the Friday before. Do not change any test. Run `npm test` and `npm run typecheck`."
5. Before you commit, type `/review` and choose to review your uncommitted changes. Read the findings. Run `git diff weekend-tests -- tests/`, which must be empty, and `npm run due -- 2027-03-05`.
6. Commit on `port-codex`. Run `git status`. It must say the working tree is clean before you switch branches.

**Checkpoint:** 10 invoices, $33,109.53, on the `port-codex` branch, with the tests unchanged. Your notes say what Codex asked before acting and what `/review` found.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-10.md) and open it in a text editor, not in the agent.

### Task 11. Port to OpenCode (20 minutes)

*Goal:* the same change on an open-source agent, with its safety rules set first.

1. If you skipped Task 10, do its steps 1 and 2 first, so the branch `weekend-tests` exists. Then run `git switch -c port-opencode weekend-tests`.
2. In `brightline-ap`, create `opencode.jsonc` with the rules from Lab 12, Task 11. Edits, shell commands and folders outside the project ask first, and edits under `data/` are denied. Make sure auto-accept is off.
3. Open the folder in OpenCode Desktop. Use the *plan* agent first: "Read `tests/weekend.test.ts` and plan the change that makes it pass. Do not edit anything."
4. Switch to the *build* agent and send the same brief as Task 10, step 4. Approve each edit and command.
5. We found no review command in OpenCode's version 2 documentation. Read the review panel or `git diff`, then run `git diff weekend-tests -- tests/`.
6. Commit on `port-opencode`, and check that `git status` shows a clean working tree.

**Checkpoint:** 10 invoices, $33,109.53, on the `port-opencode` branch, with the tests unchanged, and OpenCode asked before every edit and command.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-11.md) and open it in a text editor, not in the agent.

### Task 12. Hand over and tag (10 minutes)

*Goal:* the next session, and the next chapter, can start from a tag that passes every check.

1. Run `git switch main`. Ask the agent to write `ports/ch13.md` from your notes. For each agent, record what it asked before acting, whether it tried to change a test, whether its first attempt passed, what its review found, and what you had to say to it. End with which agent you would give the next tests-first change to, and why.
2. Commit, then run `git tag ch13`.
3. Check the tag from a clean copy. From the folder that holds `brightline-ap`, run:

   ```bash
   git clone --branch ch13 brightline-ap ch13-check
   cd ch13-check
   npm ci
   npm test
   npm run typecheck
   npm run test:py
   npm run check:py
   ```

**Checkpoint:** every command passes in `ch13-check`, and `git tag` in `brightline-ap` lists `ch13`. You can delete `ch13-check` afterwards.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-12.md) and open it in a text editor, not in the agent.

### If something goes wrong

| Problem | What to try |
| --- | --- |
| `npm run typecheck` says `tsc` is not found | The dev dependencies are not installed. Run `npm install`. |
| The type checker cannot find `node:fs` | `@types/node` is missing, or `types` in `tsconfig.json` does not list node. |
| A test file fails with "Cannot use import statement" | `package.json` lost `"type": "module"`. Put it back. |
| Node reports a syntax error in a `.ts` file | The agent used TypeScript that Node cannot run directly, such as an `enum` or a constructor parameter property. `erasableSyntaxOnly` makes the type checker catch it. |
| `uv run` says no project was found | Run it from `py/`, where `pyproject.toml` is. The npm scripts do this for you. |
| pytest says `No module named 'brightline_ap'` | `pythonpath` in `[tool.pytest.ini_options]` must be `["."]`. |
| `uv` downloads Python on the first run | That is normal when no Python 3.12 or later is installed. Let it finish. |
| A due date is off by one day on some computers | The code mixed local time and UTC. Build dates as `new Date("YYYY-MM-DDT00:00:00Z")` and use the `getUTC` and `setUTC` methods. |
| The reconciliation finds 4 mismatches, not 0 | It compared rows with an empty `due_date`. Skip those rows. |
| The agent edited a test to make it pass | Run `git restore tests/` or `git restore py/tests/`, and tell it in one sentence that the tests are the specification. |
| Codex cannot install a package | Its sandbox blocks the network by default and asks. No package is needed for the ports. |
| `TZ=...` does not work in PowerShell | Use Git Bash or WSL for that step, or skip it and say so in your notes. |

### Apply it to your vertical

Pick one calculation from your own work that you check by hand today, such as a deadline from a start date, a late fee, a commission or a tax line. Write five test cases for it first, including one month or year end and one input that must be refused. Then ask any coding agent to write the function that passes them, in the language you prefer. Before you accept it, check `git diff` on the tests, and write a sentence for each line that carries a rule.

*Domain expert and builder.* The domain expert supplies the cases, especially the strange ones, such as the terms nobody uses anymore. The builder turns them into tests and keeps the agent from changing them.

### Artifact checklist

- [ ] `tsconfig.json`, the three new npm scripts, `py/pyproject.toml` and both lock files, committed
- [ ] `NOTES.md` with your predictions and real outputs from Tasks 2 to 4, and your error sentence from Task 9
- [ ] The vendor list sorted by terms in both languages
- [ ] The fixed total scripts, with the type checkers reading `exercises/`
- [ ] The commit "Failing tests for dueDate", before the commits that make them pass
- [ ] `src/due-date.ts` and `py/brightline_ap/due_date.py`, with every test passing and the tests unchanged
- [ ] The reconciliation script with its tests: 0 mismatches, then 2
- [ ] The branch `weekend-tests`, and at least one of `port-codex` and `port-opencode` with 10 invoices and $33,109.53 (for Python only, with the `pay_by` tests passing)
- [ ] `ports/ch13.md` on main
- [ ] Tag `ch13`, checked from a clean clone
- [ ] Extension: the second port branch
- [ ] Extension: five test cases for one calculation from your own work
