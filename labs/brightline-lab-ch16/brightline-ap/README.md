# brightline-ap

Accounts payable scripts for Brightline Wholesale Supply, a made-up company, the running project of *The AI Agent Factory*, Part III. Every name, invoice and amount here is made up. You do not need any earlier chapter to use it.

## What is here

- `src/`: TypeScript tools. `src/due-date.ts` works out each invoice's due date, and every other tool uses it. `npm run due -- <YYYY-MM-DD>` lists the invoices due by a date, with the total.
- `py/`: Python versions of the same tools, run with uv.
- `tests/` and `py/tests/`: the tests.
- `data/`: the AP export: `vendors.csv` and `invoices.csv`, plus batches to check. Tools read it. Nothing writes to it.
- `docs/`: rules from the AP team.
- `schemas/`: the Agent Plugins 1.0.0 JSON Schemas, copied from the standard's repository.
- `.claude/skills/due-by-friday/`: a small skill that runs the due list.
- `.github/`: continuous integration with three checks (`checks`, `tests-unchanged` and `no-secrets`), a pull request template, and code owners.
- `AGENTS.md` and `CLAUDE.md`: the rules every coding agent follows here. `REVIEW.md`: the rules for reviewing a pull request.
- `NOTES.md`, `ports/` and `changes/`: notes and change briefs from earlier work. Add your own below them.
- `exercises/`: practice material. Read it, never run it.

## Set up and check

Run `npm ci` and `cd py && uv sync`, then the four checks: `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py`. All four pass before you change anything.
