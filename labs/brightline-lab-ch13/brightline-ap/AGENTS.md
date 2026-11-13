# brightline-ap

Scripts the accounts payable (AP) team at Brightline Wholesale Supply runs on invoice exports. Every script is kept in two languages: TypeScript in `src/`, and Python in `py/`. Both versions follow the same rules and print the same output.

My language is: TypeScript

Work in my language. Leave the other language's files as they are, unless I ask you to change them.

## Build and test

| What | TypeScript | Python |
| --- | --- | --- |
| The tests | `npm test` | `npm run test:py` |
| The type checker | `npm run typecheck` | `npm run check:py` |
| Friday's list | `npm run due -- 2027-03-05` | `npm run due:py -- 2027-03-05` |
| The vendor list | `npm run vendors` | `npm run vendors:py` |

To run Friday's list on another export in `data/`, add its file name: `npm run due -- 2027-03-12 invoices-next-week.csv`.

Every change needs a passing test, and a clean type check.

## House rules

- Dates are ISO, such as 2027-03-05, in code and output.
- Amounts are whole cents. Never use floating-point money.
- Every new script gets a test, and the tests must pass before you say you are done.
- Do not install packages without asking.
- Node runs the TypeScript files directly, with no build step. Use only type annotations, no `enum` or `namespace`, and import local files with the `.ts` extension.
- Python has type hints on every function, and passes Pyright in strict mode.
- Split lines on `\r?\n`. The exports may have Windows line endings.

## Never

- Never write to `data/`. The scripts and tests depend on it.
- Never print bank account numbers.

## Where things go

- TypeScript scripts in `src/`, one script per file. Their tests in `tests/`, named `<script>.test.ts`.
- Python scripts in `py/brightline_ap/`. Their tests in `py/tests/`, named `test_<script>.py`.
- A rule that more than one script needs lives in its own file, named for the rule. The due-date rule, for example, would be `dueDate` in `src/due-date.ts`, and `due_date` in `py/brightline_ap/due_date.py`.
- `NOTES.md` is the handover for the next session.
