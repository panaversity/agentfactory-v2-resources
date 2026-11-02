# Lab 16 answer key: Task 1. Set up, and your first skill

The answers for Task 1 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

## The start

`git log --oneline` shows one commit, "Start from the lab's files". The agent's git name and email are set for this project only.

From a fresh unzip, `npm ci`, `uv sync` in `py/`, and the four checks pass: 42 TypeScript tests and 27 Python tests. `npm run typecheck` prints nothing. `npm run check:py` prints `0 errors, 0 warnings, 0 informations` from Pyright and `All checks passed!` from Ruff.

## The agent's summary

It should name:

- `src/due-date.ts` and `py/brightline_ap/due_date.py` as the one place due dates come from
- the four checks
- the rules in `AGENTS.md`: every change needs a passing test, never change a test to make it pass, money in whole cents, never write to `data/`, never print `.env` or any key, and never push to `main`
- `due-by-friday` as a skill that runs the due list

## Your first skill

`/due-by-friday 2027-03-12` runs `npm run due -- 2027-03-12`, then `npm test`. The command prints:

```text
2027-02-26  INV-8304  Scioto Office Products  $234.50
2027-03-01  INV-8307  Ohio Valley Electric  $2,411.33
2027-03-03  INV-8301  Midwest Packaging Co.  $4,825.00
2027-03-03  INV-8302  Buckeye Janitorial Supply  $618.75
2027-03-03  INV-8314  Lakefront Labels Inc.  $2,265.00
2027-03-04  INV-8315  Cardinal Forklift Service  $1,325.00
2027-03-05  INV-8305  Hocking Valley Pallets  $7,350.00
2027-03-05  INV-8312  Scioto Office Products  $199.95
2027-03-06  INV-8303  Great Lakes Freight  $12,900.00
2027-03-06  INV-8308  Cardinal Forklift Service  $980.00
2027-03-08  INV-8306  Lakefront Labels Inc.  $1,582.00
2027-03-09  INV-8311  Buckeye Janitorial Supply  $442.10
2027-03-10  INV-8310  Great Lakes Freight  $8,700.00
13 invoices, total $43,833.63
```

The agent reports 13 invoices, $43,833.63, and that every test passed. If it gives another number without running the command, the skill did not run. Start a new session and send it again.

You started this skill by name. Its frontmatter has `disable-model-invocation: true`, so the agent does not load it by itself. Task 7 looks at that line again.
