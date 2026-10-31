# brightline-ap

Scripts the accounts payable (AP) team at Brightline Wholesale Supply runs on invoice exports. TypeScript on Node.js 24, run directly with no build step. Python versions of the same scripts live in `py/`, run with uv.

## Build and test

- `npm test` runs every test in `tests/`. Every change needs a passing test.
- `npm run typecheck` checks the TypeScript types. Node does not check them when it runs a file.
- `npm run test:py` runs the Python tests, and `npm run check:py` runs Pyright and Ruff.
- Never change a test to make it pass. If you think a test is wrong, stop and say why.
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
- Python in `py/brightline_ap/`, tests in `py/tests/`, named `test_<module>.py`. Add Python packages with `uv add`, never `pip install`, and only after asking.
- `NOTES.md` is the handover for the next session. `ports/` records what changed on each agent.
