# Notes

## What the repository does (at ch14)
- `src/due-date.ts` and `py/brightline_ap/due_date.py`: the one due-date engine, with `Terms` as a literal type.
- `src/due-by-friday.ts`: the payment list. `npm run due -- 2027-03-05` gives 8 invoices, $19,229.53.
- `src/reconcile.ts`: checks stated due dates against the rule. 0 mismatches in `invoices.csv`, 2 in `invoices-check.csv`.
- `src/schemas.ts`, `src/load-invoices.ts`: every record checked at the edge. `invoices-messy.csv` gives 11 valid, 4 errors.
- `scripts/ap-api.ts` and `src/ap-client.ts`: the local sample API and the async client. Key in `.env` only.

## How changes reach main (from Chapter 15)
- Every change is a pull request. `REVIEW.md` holds the review rules and the risk tiers. `.github/CODEOWNERS` names who must approve the high tier.
- Required checks in `.github/workflows/ci.yml`, three jobs: `checks` (both type checks, both test suites, Ruff), `tests-unchanged` and `no-secrets`.
- AI review gives findings. It never approves, and it never blocks on its own.
- A change that moves money gets a brief in `changes/`.

## Flags
- `PAY_WEEKEND_RULE=on` turns on the weekend rule: 10 invoices, $33,109.53 for March 5. It is off by default, so `main` gives 8 invoices, $19,229.53, until AP approves the policy.
