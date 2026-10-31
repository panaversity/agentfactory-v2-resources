# brightline-ap

Scripts the accounts payable (AP) team at Brightline Wholesale Supply runs on invoice exports. TypeScript on Node.js 24, run directly with no build step.

## Build and test

- `npm test` runs every test in `tests/`. Every change needs a passing test.
- `npm run vendors` lists the vendors. `npm run due -- 2027-03-05` lists the open invoices due by a cutoff date.

## House rules

- Dates are ISO, such as 2027-03-05, in code and output.
- Amounts are whole cents. Never use floating-point money.
- Every new script gets a test in `tests/`, and `npm test` must pass before you say you are done.
- Do not install packages without asking.
- Node runs the TypeScript files directly, with no build step. Use only type annotations, no `enum` or `namespace`, and import local files with the `.ts` extension.
- Split lines on `\r?\n`. The exports may have Windows line endings.

## Never

- Never write to `data/`. The scripts and tests depend on it.
- Never print bank account numbers.

## Where things go

- Scripts in `src/`, one script per file. Tests in `tests/`, named `<script>.test.ts`.
- `NOTES.md` is the handover for the next session. `ports/` records what changed on each agent.
