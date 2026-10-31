# Lab 13: the due-date calculator in two languages

Chapter 13 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 13: the due-date calculator in two languages](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/lab/), so you can do the lab without the book.

*Time: about 3 hours 40 minutes. Lab files: `brightline-lab-ch13.zip`, standalone. The same steps are in `LAB.md` inside the zip.*

### Before you start

*What you need.*

- The Claude desktop app with a Pro, Max, Ultra, Team or Enterprise plan, for Tasks 1 to 9 and 12.
- The ChatGPT desktop app with any plan, for Task 10, and OpenCode Desktop with a model connected, for Task 11, as in [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/).
- Git, Node.js 24 or later, and uv, the Python project tool.

**Set up the tools.** If they are not on your computer yet, follow Concept [13.2](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/the-workbench/#how-do-i-set-up-the-workbench) before Task 1. It gives the official page for each one, and a prompt that has the agent check the versions and install nothing without your yes.

The field guide for the code toolchain has more detail and a table for fixing problems. A copy, `field-guide-code-toolchain.md`, comes with the lab download.

**The core path and the extensions.** The core path is Tasks 1 to 9, at least one port (Task 10 or 11), and Task 12. A port makes the same change with a second agent. The second port is an extension.

**Python only.** If you want Python and not TypeScript, do the Python half of each task and use this table for the rest.

| Task | Swap |
| --- | --- |
| 1 | Send only items 3 and 4 of the prompt. Skip the TypeScript packages and `tsconfig.json`. Ask the agent to run the Python checks from `py/` with `uv run pytest`, `uv run pyright` and `uv run ruff check` |
| 2 to 4 | Predict the Python version only, and ask the agent to run only that one |
| 5 to 7 | In Task 5, ask for the Python tests only. Skip Task 6, and do Task 7 |
| 8, 9 | Choose Python for the reconciliation tests and script |
| 10, 11 | Give the agent the same four `payBy` cases, for `py/tests/test_weekend.py`, and ask for the weekend rule in `py/brightline_ap/due_date.py` as `pay_by(due: str) -> str`. Skip the due-by-Friday test and the due-by-Friday change. You are done when the `pay_by` tests pass and `git diff weekend-tests -- py/tests/`, run by the agent, prints nothing |
| 12 | Ask the agent to check the tag with the Python commands only |

**Without a paid Claude plan.** Do Tasks 1 to 9 and 12 in Codex or OpenCode, with its safety settings from [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/) set first. Your port is the agent you did not use. Say which in `ports/ch13.md`.

**The lab files.** Download [brightline-lab-ch13.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13.zip) and unzip it into a new folder. It contains:

- `brightline-ap/`, a plain copy of the repository at the end of [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/), with no git history. It also holds the lab files: a Python version of the vendor list in `py/`, `data/invoices-check.csv`, `data/invoices-no-terms.csv`, and two scripts in `exercises/`. In Task 1, the agent puts it under git. This is the only folder you give an agent.
- `concept-blocks/`, every runnable code block from the chapter.
- `LAB.md` and `field-guide-code-toolchain.md`.

Each task with an answer key links it as a separate download. Open a key in a text editor, never in the agent. An agent that can read the answers is not tested by them.

Use the zip's copy for this lab, even if you finished Lab 12 in your own repository. The answer keys match the zip's files exactly.

**The date in this lab.** Today is still Wednesday, March 3, 2027, and the payment run is Friday, March 5.

### The job

Brightline's due-date rule is the invoice date plus the days in the terms. It is hidden inside the [Chapter 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/) script. Nobody has tested it on a month end, a year end or a leap day, and nobody knows what it does with terms it has never seen. Ana wants it moved out into its own function, with a contract and full tests, in both languages, so the team can trust it and reuse it. Then she wants a script that checks every stated due date in an export against the rule.

Ana's note from [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/) is still your check: after every change on `main`, `npm run due -- 2027-03-05` must still print 8 invoices and $19,229.53, as her note says. Reading the rule lines shows you the rule itself, which that check cannot see. You will read the code the agent wrote and predict what it does, decide the test cases before the agent writes new code, and port one change to two other agents. No number in this lab comes from an AI's reply. Every date, count and total is printed by a command you approved, and you read it in that command's output.

### How each task works

Each task has a goal, steps and a **Checkpoint**. Do not start the next task until the checkpoint is true. Work in *Manual* mode unless a task says otherwise.

The agent runs every command in this lab, such as git, npm and uv, and you never type one in a terminal. Before you approve a command, read what the agent says it will do, and say no to anything you do not understand. Asking "What does this command do?" is always fine. Then read what the command prints, not only the agent's summary of it. Write each prediction in `NOTES.md` before the agent runs anything.

You decide every test case and its answer. That is the first 10 percent of [10-80-10](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/you-read-the-agent-writes/#what-is-my-job-when-an-agent-writes-the-code), where you say what correct means. The agent writes the test code from your list. Read each test against your list before you approve it. Once a test is approved, the agent never changes it.

### Task 1. Set up the workbench (20 minutes)

*Goal:* one command checks each language.

1. Open `brightline-ap` in the Claude desktop app's *Code* tab, in a *Local* session, in *Manual* mode.
2. Send:

   > Put this folder under git, with a main branch, and make a first commit of everything here, with the message "Start from the end of Lab 12". Then show me `git log --oneline`.

   Approve each command when you agree with what it does. Expect `git init -b main`, `git add .`, `git commit` and `git log --oneline`, which shows one commit. If the agent wants to change your git settings for the whole computer, say no. Ask it to set the name and email for this project only.
3. Send this, then approve each command only after you have read it. The only packages it should add are `typescript`, `@types/node`, `pytest`, `pyright` and `ruff`. Say no to anything else. These are **dev dependencies**: packages the project needs only while you develop and check it, not when it runs. A package is other people's code published under one name. [Chapter 14](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/modules/#should-i-let-the-agent-add-a-package) covers packages and dependencies in full.

   > Set up the type checker and the Python tools. Ask before each command.
   >
   > 1. Add `typescript` and `@types/node@24` as dev dependencies. Create `tsconfig.json` for type checking only, with `target` esnext, `module` and `moduleResolution` nodenext, `strict`, `noEmit`, `allowImportingTsExtensions`, `erasableSyntaxOnly`, `verbatimModuleSyntax`, `skipLibCheck`, and `types` set to node. Include `src`, `tests` and `scripts`.
   > 2. Add three npm scripts: `typecheck` runs `tsc --noEmit`, `test:py` runs `cd py && uv run pytest`, and `check:py` runs `cd py && uv run pyright && uv run ruff check`.
   > 3. `py/` already holds the package `brightline_ap` and its tests. Write `py/pyproject.toml` yourself, and do not run `uv init`. Name the project `brightline-ap`, require Python 3.12 or later, with no dependencies. Set pytest's `testpaths` to `tests` and `pythonpath` to `.`, Pyright's `typeCheckingMode` to `strict`, and its `include` to `brightline_ap` and `tests`. Then add pytest, pyright and ruff with `uv add --dev`.
   > 4. Add `node_modules/`, `py/.venv/`, `__pycache__/`, `.pytest_cache/`, `.ruff_cache/`, `.env` and `out/` to `.gitignore`.

4. Ask the agent to run `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py`, and read the output of each.
5. Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-1.md) and open it in a text editor, not in the agent. Compare `tsconfig.json` and `py/pyproject.toml`, the Python project's settings, with it. Then ask the agent to commit with the message "Set up the workbench", and to list the files in the commit. Make sure the lock files, `package-lock.json` and `py/uv.lock`, are among them. They record the exact version of every package.

**Checkpoint:** all four commands pass, with no failed test and no errors from the checkers. `npm test` shows 7 tests and `npm run test:py` shows 2.

### Task 2. Predict, run, investigate (20 minutes)

*Goal:* read both vendor scripts before you run them.

1. Open `src/list-vendors.ts` and `py/brightline_ap/list_vendors.py` in a text editor. Read them side by side.
2. In `NOTES.md`, under a heading "Task 2", write what each one prints: how many lines, which vendor first and last, and exactly how one line looks.
3. Ask the agent to run `npm run vendors`, and then, in `py/`, `uv run python -m brightline_ap.list_vendors`. Read what each one prints.
4. Mark each part of your prediction right or wrong. For the first thing you got wrong, ask the agent about that line, with its number in place of N: "Explain line N of this file, and why it prints what it prints." If you got everything right, ask instead: "What input would make this script print something wrong?"
5. Paste the real output under your prediction.

**Checkpoint:** `NOTES.md` holds your prediction, the real output, and one question you asked with its answer in your own words.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-2.md) and open it in a text editor, not in the agent.

### Task 3. Modify (15 minutes)

*Goal:* change one thing and predict the result first.

1. Predict the new order and write it in `NOTES.md`. The vendors are sorted by the days in their terms, fewest first, with "Due on receipt" as 0 days. Vendors with the same terms stay in file order.
2. Send:

   > In `src/list-vendors.ts` and `py/brightline_ap/list_vendors.py`, print the vendors sorted by the number of days in their terms, fewest first. "Due on receipt" is 0 days. Keep vendors with the same terms in the order they appear in the file. Do not change the tests. Show me the diff before you run anything.

3. Read the diff. Find the sort line in each language, and write in `NOTES.md` what each one compares, before anything runs. Then ask the agent to run both scripts, and then `npm test` and `npm run test:py`. Read the output.

**Checkpoint:** both print the same order, which matches the answer key. `npm test` and `npm run test:py` still pass. Ask the agent to commit.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-3.md) and open it in a text editor, not in the agent.

### Task 4. The text-or-number trap (15 minutes)

*Goal:* see a type mistake run in one language, stop in the other, and get caught by both type checkers.

1. Read `exercises/total-open.ts` and `exercises/total_open.py`. Predict what each prints, and write it down.
2. Send: "Run `node exercises/total-open.ts`. Then, in `py/`, run `uv run python ../exercises/total_open.py`. Show me both outputs, and do not explain or fix anything yet."
3. In `NOTES.md`, explain in two sentences why the two languages behave differently. Concept [13.3](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/values-types-variables/#why-is-an-amount-from-a-file-still-text) has the reason.
4. Send: "Add `exercises` to the folders `tsconfig.json` includes, and `../exercises` to Pyright's include in `py/pyproject.toml`. Then run `npm run typecheck` and `npm run check:py` and show me the output. Do not fix anything yet." Read both errors. Each names the file, the line and the problem.
5. Now ask the agent to fix both scripts by converting the amount to a number where it is read, and run them again.

**Checkpoint:** both scripts print the total in the answer key, and both type checks pass. Ask the agent to commit.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-4.md) and open it in a text editor, not in the agent.

### Task 5. Write the tests first (25 minutes)

*Goal:* the specification for the due-date calculator, as failing tests, in both languages.

1. Decide the cases, and the due date each one must give. These cases are the minimum:

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

   Add one more case, for `tests/due-by-friday.test.ts`: an open invoice with an empty due date and terms `Net 10` must stop with `Unknown terms: Net 10`. Today `src/due-by-friday.ts` has its own date code, which reads any number after "Net" and accepts Net 10 without any warning. This test fails until that script uses the one tested engine, `dueDate`.

   Write your cases in `NOTES.md`, under a heading "Task 5", with any more you want to add.
2. Send:

   > Write failing tests from my cases in `NOTES.md`, under "Task 5". The functions are `dueDate(invoiceDate, terms)` in `src/due-date.ts` and `due_date(invoice_date, terms)` in `py/brightline_ap/due_date.py`, and neither exists yet. Put their tests in `tests/due-date.test.ts` and `py/tests/test_due_date.py`, and the Net 10 case in `tests/due-by-friday.test.ts`. Use my dates and answers exactly. Write only the tests, and change no other file.

   Read each test against your list before you approve it: the same date and terms, the same answer, and no case you did not list. Concept [13.9](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/tests-first/) shows the shape of each test file.
3. Ask the agent to run `npm test` and `npm run test:py`. The new due-date tests must fail because the module does not exist yet, and the new due-by-friday test must fail because no error was raised. Read each error in the output, and make sure that is the reason.
4. Ask the agent to commit the three test files with the message "Failing tests for dueDate". Then ask it to print the commit's short id with `git log -1 --format=%h`. Write that id in `NOTES.md`, or ask the agent to write it there. That commit is your tests' baseline. In Tasks 6 and 7 you compare against it.
5. Impossible dates are not in this table, on purpose. After Task 7, ask the agent to run each due-date function on `2026-02-30` and show you the result. Python refuses it, and a JavaScript `Date` turns it into March 2 without any warning. In [Chapter 14](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/data-models-and-schemas/#why-check-at-the-edge), the program refuses bad dates where the data comes in, with a schema, a description of what valid data looks like. As an extension, add the case to your list, and have the agent write and commit its test first. Then ask it to make the TypeScript version refuse the date too.

**Checkpoint:** the commit holds the three test files, its id is in `NOTES.md`, and the test runs fail for the reasons above, not because of a mistake in a test.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-5.md) and open it in a text editor, not in the agent.

### Task 6. Generate in TypeScript (20 minutes)

*Goal:* the agent writes the code that passes your tests, and leaves the tests alone.

1. Send:

   > Create `src/due-date.ts` so the tests in `tests/due-date.test.ts` pass. Export `dueDate(invoiceDate: string, terms: string): string` and `termsDays(terms: string): number`. The known terms are Net 15, Net 30, Net 45, Net 60 and Due on receipt. Any other terms throw an `Error` with the message `Unknown terms: <terms>`. Do the date math in UTC. Then make `src/due-by-friday.ts` use `dueDate` in place of its own `addDays` and `termsDays`, and delete those two, so the payment report and the calculator are one engine. Make `src/list-vendors.ts` sort with `termsDays` too. Do not change any test. Run `npm test` and `npm run typecheck` and show me the output.

2. Ask the agent to run `git diff <baseline> -- tests/` and `git status --short`, with your own id from Task 5 in place of `<baseline>`. Read the output. The diff must be empty, and `git status --short` must list no file under `tests/`.
3. Read `src/due-date.ts`. Say its promise in one sentence, and find the line that does the UTC math.
4. Ask the agent to run the tests in two more time zones, with `TZ=America/Los_Angeles npm test` and `TZ=Asia/Tokyo npm test`. Ask it to run `npm run due -- 2027-03-05` in all three time zones too, with the same `TZ=` in front.

**Checkpoint:** `npm test` and `npm run typecheck` pass, and `src/due-by-friday.ts` imports `dueDate` and has no date code of its own. `npm run due -- 2027-03-05` still prints 8 invoices and $19,229.53, in all three time zones. `git diff <baseline> -- tests/` is empty. Ask the agent to commit.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-6.md) and open it in a text editor, not in the agent.

### Task 7. The same in Python (20 minutes)

*Goal:* the Python version, from the Python tests.

1. Send the Task 6 brief, changed for Python: `py/brightline_ap/due_date.py`, with `due_date(invoice_date: str, terms: str) -> str` and `terms_days(terms: str) -> int`, raising `ValueError` for unknown terms, and `list_vendors.py` sorting with `terms_days`. Leave out the `due-by-friday` part, which has no Python version. Ask it to run `npm run test:py` and `npm run check:py`.
2. When it is done, check the Python tests as in Task 6. Ask the agent to run `git diff <baseline> -- py/tests/`, with the same id, and `git status --short`, and read the output. The diff must be empty, and no file under `py/tests/` may be listed.
3. Read both files side by side. Find one place where the two languages do the same thing differently, and note it.

**Checkpoint:** every Python test passes, including all your due-date cases, `npm run check:py` passes, and `git diff <baseline> -- py/tests/` is empty. Ask the agent to commit.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-7.md) and open it in a text editor, not in the agent.

### Task 8. Reconcile the export (20 minutes)

*Goal:* a script that checks every stated due date against the rule.

1. Choose a language. Then decide your cases, and write them in `NOTES.md`, under a heading "Task 8". These four are the minimum. A row whose stated date matches is not reported. A row whose stated date is wrong is reported with the invoice number, the stated date and the computed date. A row with an empty `due_date` is skipped. And the same file with Windows line endings gives the same result. Send, for TypeScript:

   > Write `tests/reconcile.test.ts` from my cases in `NOTES.md`, under "Task 8". The tests are for a script that does not exist yet, `src/reconcile.ts`. Write only the tests.

   For Python, name `py/tests/test_reconcile.py` and `py/brightline_ap/reconcile.py`. Read each test against your cases before you approve it.
2. Send, for TypeScript:

   > Create `src/reconcile.ts`, run as `npm run reconcile -- <file>`. For each row with a stated `due_date`, compute the due date with `dueDate` from `src/due-date.ts`, and report each row where they differ, then a count. Skip rows with an empty `due_date`. Find each column by its name in the header row. Make my tests pass without changing them.

   For Python, ask for `py/brightline_ap/reconcile.py`, run as `uv run python -m brightline_ap.reconcile <file>` from `py/`. If the agent asks to edit a test file, say no.
3. Predict the result on `data/invoices.csv`. Then ask the agent to run the script on it, and then on `data/invoices-check.csv`.

**Checkpoint:** 0 mismatches in `invoices.csv`, and exactly 2 in `invoices-check.csv`, with the invoice numbers in the answer key. Ask the agent to commit.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-8.md) and open it in a text editor, not in the agent.

### Task 9. Read an error (10 minutes)

*Goal:* name an error precisely before you ask for help.

1. Send: "Run the reconciliation script on `data/invoices-no-terms.csv`, and show me the whole output. Do not explain it or fix anything yet."
2. Read the error report. In Python start at the bottom, and in TypeScript start at the top. Find the first line in a file you own, then follow the bad value back to where it came from.
3. Before you ask the agent anything about it, write one sentence in `NOTES.md` that names the file, the line and the cause.
4. Now ask the agent what it thinks, and compare.

**Checkpoint:** your sentence names the file and line in your own code, and the missing `terms` column as the cause. Update `NOTES.md` with what the due-date function and the reconciliation script do, and ask the agent to commit.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-9.md) and open it in a text editor, not in the agent.

### Task 10. Port to Codex (25 minutes)

*Goal:* one tests-first change, made by a second agent, with a review before the commit.

**The change.** The finance team is considering a new policy: a due date that falls on a Saturday or Sunday is paid on the Friday before. It is a proposal, so it lives on its own branches, and `main` keeps the [Chapter 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/) answer. After each port, ask the agent to run `git switch main`. Then write your notes on the port in `NOTES.md`, and ask the agent to commit them, so Task 12 can use them.

1. Decide the weekend cases. These are the minimum:
   - `2026-11-07`, a Saturday, gives `2026-11-06`
   - `2026-11-01`, a Sunday, gives `2026-10-30`
   - `2026-11-04`, a Wednesday, does not move
   - `2026-08-01`, a Saturday, gives `2026-07-31` (across a month end)
   - with the rule, `dueBy` in `src/due-by-friday.ts` gives 10 invoices and 3,310,953 cents for the cutoff 2027-03-05

   In the agent you used for Tasks 1 to 9, send this, with your cases pasted under it:

   > Make a new branch called `weekend-tests` and switch to it. Then write `tests/weekend.test.ts` from my cases below, for a function `payBy(due)` in `src/due-date.ts`. Write only the tests, and change no other file.

   Approve each command when you agree with what it does. Expect `git switch -c weekend-tests`. Read each test against your cases before you approve it.
2. Ask the agent to run `npm test`. The new tests must fail because `payBy` does not exist. Then ask it to commit with the message "Failing tests for the weekend rule".
3. Open the folder in Codex, set *Work in* to *This computer* and the mode to *Ask for approval*. Send: "Make a new branch called `port-codex` from `weekend-tests`, and switch to it." Approve the command when you agree with what it does. Expect `git switch -c port-codex weekend-tests`.
4. Send: "Make the tests in `tests/weekend.test.ts` pass. Add `payBy(due: string): string` to `src/due-date.ts`, and use it in `src/due-by-friday.ts` so a weekend due date counts as the Friday before. Do not change any test. Run `npm test` and `npm run typecheck`."
5. Before you ask for a commit, type `/review` and choose to review your uncommitted changes. Read the findings. Then ask Codex to run `git diff weekend-tests -- tests/` and `npm run due -- 2027-03-05`, and read the output. The diff must be empty.
6. Ask Codex to commit on `port-codex`, and then to run `git status`. It must say the working tree is clean, with nothing left to commit, before you switch branches.

**Checkpoint:** 10 invoices, $33,109.53, on the `port-codex` branch, with the tests unchanged. Your notes say what Codex asked before acting and what `/review` found.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-10.md) and open it in a text editor, not in the agent.

### Task 11. Port to OpenCode (20 minutes)

*Goal:* the same change on an open-source agent, with its safety rules set first.

1. If you skipped Task 10, do its steps 1 and 2 first, so the branch `weekend-tests` exists.
2. In `brightline-ap`, create `opencode.jsonc` with the rules from [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/), Task 8. The rules make OpenCode ask before every edit, every shell command and any folder outside the project, and refuse every edit under `data/`. Make sure auto-accept is off.
3. Open the folder in OpenCode Desktop. Send: "Make a new branch called `port-opencode` from `weekend-tests`, and switch to it." Approve the command when you agree with what it does. Expect `git switch -c port-opencode weekend-tests`. Then switch to the *plan* agent, and send: "Read `tests/weekend.test.ts` and plan the change that makes it pass. Do not edit anything."
4. Switch to the *build* agent and send the same brief as Task 10, step 4. Approve each edit and command.
5. OpenCode's version 2 documentation names no review command. Read the review panel, or ask OpenCode to show you `git diff`. Then ask it to run `git diff weekend-tests -- tests/`, and read the output. It must be empty.
6. Ask OpenCode to commit on `port-opencode`, with `opencode.jsonc`, and then to run `git status`. Check that it shows a clean working tree.

**Checkpoint:** 10 invoices, $33,109.53, on the `port-opencode` branch, with the tests unchanged, and OpenCode asked before every edit and command.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-11.md) and open it in a text editor, not in the agent.

### Task 12. Hand over and tag (10 minutes)

*Goal:* the next session, and the next chapter, can start from a tag that passes every check.

1. In the agent you used for Tasks 1 to 9, ask it to run `git switch main`. Then ask it to write `ports/ch13.md` from your notes, with a section for each agent you used. Each section says what the agent asked before acting, whether it tried to change a test, whether its first attempt passed, what its review found, and what you had to say to it. Tell it which agent you would give the next tests-first change to, and why, and have it end the file with that.
2. Ask the agent to commit, and then to tag the commit with `git tag ch13`.
3. Check the tag from a clean copy. Send: "Clone the tag `ch13` into a new folder, `ch13-check`, next to this folder. In `ch13-check`, install the packages from the lock file and run every check. Show me the output of each command." This is the one step where the agent works outside `brightline-ap`. Approve each command when you agree with what it does. Expect commands like these, run from the folder that holds `brightline-ap`:

   ```bash
   git clone --branch ch13 brightline-ap ch13-check
   cd ch13-check
   npm ci
   npm test
   npm run typecheck
   npm run test:py
   npm run check:py
   ```

   `npm ci` installs exactly the package versions the lock file records.

**Checkpoint:** every command passes in `ch13-check`, and `git tag` in `brightline-ap`, run by the agent, lists `ch13`. You can delete `ch13-check` afterwards.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-12.md) and open it in a text editor, not in the agent.

### If something goes wrong

| Problem | What to try |
| --- | --- |
| `git commit` says "Please tell me who you are" | Git does not know your name yet. Ask the agent to set your name and email for this project only, then to commit again. If it adds `--global`, which changes them for the whole computer, say no. |
| `npm run typecheck` says `tsc` is not found | The dev dependencies are not installed. Ask the agent to run `npm install`. |
| The type checker cannot find `node:fs` | `@types/node` is missing, or `types` in `tsconfig.json` does not list node. Ask the agent to check both. |
| Node warns that the module type is not specified (`MODULE_TYPELESS_PACKAGE_JSON`) | `package.json` lost `"type": "module"`. Ask the agent to put it back. |
| Node reports a syntax error in a `.ts` file | The agent used TypeScript that Node cannot run directly, such as an `enum` or a constructor parameter property. `erasableSyntaxOnly` makes the type checker catch it. Ask the agent to rewrite that part without them. |
| `uv run` says no project was found | It ran outside `py/`, where `pyproject.toml` is. Ask the agent to run it from `py/`. The npm scripts do this for you. |
| pytest says `No module named 'brightline_ap'` | `pythonpath` in `[tool.pytest.ini_options]` must be `["."]`. Ask the agent to set it. |
| `uv` downloads Python on the first run | That is normal when no Python 3.12 or later is installed. Let it finish. |
| A due date is off by one day on some computers | The code mixed local time and UTC. Ask the agent to build dates as `new Date("YYYY-MM-DDT00:00:00Z")` and use the `getUTC` and `setUTC` functions. |
| The reconciliation finds 4 mismatches, not 0 | It compared rows with an empty `due_date`. Ask the agent to skip those rows. |
| The agent edited a test to make it pass | Ask it to run `git restore tests/` or `git restore py/tests/`, and tell it in one sentence that the tests are the specification. |
| Codex cannot install a package | Its sandbox blocks the network by default and asks. No package is needed for the ports. |
| `TZ=...` does not work in PowerShell | Ask the agent to run that step in Git Bash or WSL, or skip it and say so in your notes. |

### Apply it to your vertical

Pick one calculation from your own work that you check by hand today, such as a deadline from a start date, a late fee, a commission or a tax line. Decide five test cases for it first, each with its answer, including one month or year end and one input that must be refused. Give them to any coding agent, and ask it to write the tests in the language you prefer. Read each test against your cases before you approve it. Have the agent commit the tests, then ask it for the function that passes them. Before you accept the function, ask the agent to show `git diff` on the tests, which must be empty, and write a sentence for each line that carries a rule.

*Domain expert and builder.* The domain expert decides the cases and their answers, especially the strange ones, such as the terms nobody uses anymore. The agent writes the tests and the function. The builder reads each test against the cases, and keeps the agent from changing the tests.

### Artifact checklist

- [ ] `tsconfig.json`, the three new npm scripts, `py/pyproject.toml` and both lock files, committed
- [ ] `NOTES.md` with your predictions and real outputs from Tasks 2 to 4, your cases from Tasks 5 and 8, and your error sentence from Task 9
- [ ] The vendor list sorted by terms in both languages
- [ ] The fixed total scripts, with the type checkers reading `exercises/`
- [ ] The commit "Failing tests for dueDate", before the commits that make them pass
- [ ] `src/due-date.ts` and `py/brightline_ap/due_date.py`, with every test passing and the tests unchanged
- [ ] The reconciliation script with its tests: 0 mismatches, then 2
- [ ] The branch `weekend-tests`, and at least one of `port-codex` and `port-opencode` with 10 invoices and $33,109.53 (for Python only, with the `pay_by` tests passing)
- [ ] `ports/ch13.md` on main
- [ ] Tag `ch13`, checked from a clean clone
- [ ] Extension: the second port branch
- [ ] Extension: five test cases for one calculation from your own work, and the tests the agent wrote from them
