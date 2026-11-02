# Lab 15 answer key: Task 2. Read the history through the agent

The answers for Task 2 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

- `lab15-start` points to commit `5297ed8`, "Lab 15 starting files: a stub workflow and the change brief convention". `ch14` is the commit before it, `f66221b`.
- `weekend-rule` adds 2 commits: "Failing tests for the weekend rule" and "Add the weekend rule behind PAY_WEEKEND_RULE, off by default". It changes 6 files: `src/due-date.ts`, `src/due-by-friday.ts`, `src/reconcile.ts`, `tests/weekend.test.ts`, `py/brightline_ap/due_date.py` and `py/tests/test_weekend.py`.
- `agent-speedup` adds 1 commit, "Speed up the due list with a single pass". It changes 3 files: `src/due-by-friday.ts`, `tests/due-by-friday.test.ts` and `src/ap-client.ts`.
- The character: `<=` became `<` in the cutoff comparison in `src/due-by-friday.ts`. An invoice due exactly on the cutoff day is now left out.
