# Change brief: the weekend rule

**Risk tier:** high (it changes which invoices are paid, and when). **PR:** weekend rule. **Owner:** the person who directed the agent.

## Intent
- Outcome: when finance turns the rule on, an invoice due on a Saturday or Sunday is paid in the Friday run before it.
- Out of scope: holidays, and any change to the due dates stated in exports.
- Acceptance: with the flag off, `npm run due -- 2027-03-05` prints 8 invoices, $19,229.53, exactly as on `main`. With `PAY_WEEKEND_RULE=on`, it prints 10 invoices, $33,109.53.
- Open decision: whether to adopt the policy. AP's decision, not the builder's. Until then the flag stays off.

## Investigation
- Confirmed: INV-8303 (stated 2027-03-06, a Saturday) and INV-8308 (Net 15 from 2027-02-19, so 2027-03-06) move into the March 5 run.
- Confirmed: the rule also touched reconciliation, which compares stated dates with the rule. See Review.

## Evidence
| Claim | Expected result from | Command | Result | Commit |
| --- | --- | --- | --- | --- |
| Tests came first, and failed for the right reason | Lab 13's tests-first rule | `git switch --detach weekend-rule-start~1`, then `npm test` and `npm run typecheck` | only `tests/weekend.test.ts` fails: `payBy` does not exist yet | 08b904a |
| Off by default, answer unchanged | `main`, Chapter 12 | `npm run due -- 2027-03-05` | 8 invoices, $19,229.53 | tested on the PR head |
| On, two invoices move to Friday | The AP team's proposal, worked by hand | `PAY_WEEKEND_RULE=on npm run due -- 2027-03-05` | 10 invoices, $33,109.53 | tested on the PR head |
| Reconciliation unaffected | The export's stated dates are contract dates | `PAY_WEEKEND_RULE=on npm run reconcile -- data/invoices.csv` | 0 mismatches | after the fix |
| Existing tests unchanged | `REVIEW.md` | `bash scripts/check-tests-unchanged.sh main` | unchanged | tested on the PR head |

## Review
- Important, fixed: `src/reconcile.ts` used the pay date when the flag was on, and reported INV-8303 and INV-8309 as false mismatches. Fixed, with a test that sets the flag.
- Nit, fixed: `expectedDue` was left unused after the fix, and was removed.
- Not tested: holidays, and a cutoff that is itself a weekend day.

## Delivery
- Merging changes nothing for the payment run while the flag is off.
- Turning the flag on is a separate, high-tier decision for AP.
- To undo: turn the flag off. To remove the code, revert the merge.
