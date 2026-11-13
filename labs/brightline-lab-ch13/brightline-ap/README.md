# brightline-ap

Scripts the accounts payable (AP) team at Brightline Wholesale Supply runs on invoice exports.

All names and numbers in this repository are invented for *The AI Agent Factory*.

- `data/` holds the exports: `invoices.csv`, `vendors.csv` and next week's `invoices-next-week.csv`. Amounts are in cents. The files have no quoted fields and no commas inside values, so a script can split each line on commas. Real exports often do have them, and need a proper CSV parser. Lines may end in Unix or Windows style, so split lines on `\r?\n`.
- `src/` holds the TypeScript scripts: `list-vendors.ts` lists the vendors, and `due-by-friday.ts` lists the open invoices due by a cutoff date. `tests/` holds their tests.
- `py/` holds the same two scripts in Python, in `py/brightline_ap/`, with their tests in `py/tests/`.

`AGENTS.md` has the command for each job in each language. The Friday list is `npm run due -- 2027-03-05` in TypeScript and `npm run due:py -- 2027-03-05` in Python. The `/due-by-friday` skill runs the TypeScript one in Claude Code.

This repository needs Node.js 24 or later, which runs TypeScript files directly, and uv for Python.
