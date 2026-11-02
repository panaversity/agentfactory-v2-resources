# Lab 15 answer key: Task 7. Review before the pull request

The answers for Task 7 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Tests first: `git log --oneline --reverse lab15-start..weekend-rule-start` lists `bfc668f Failing tests for the weekend rule`, then `b1c6d2f Add the weekend rule behind PAY_WEEKEND_RULE, off by default`. At `weekend-rule-start~1`:

```text
$ npm test
SyntaxError: The requested module '../src/due-date.ts' does not provide an export named 'payBy'
✖ tests/weekend.test.ts
ℹ tests 36
ℹ pass 35
ℹ fail 1
$ npm run typecheck
tests/weekend.test.ts(5,10): error TS2305: Module '"../src/due-date.ts"' has no exported member 'payBy'.
tests/weekend.test.ts(13,87): error TS2554: Expected 3 arguments, but got 4.
tests/weekend.test.ts(19,87): error TS2554: Expected 3 arguments, but got 4.
```

The only failure is the new weekend test file, and the only cause is weekend code that does not exist yet: `payBy`, and the `weekendRule` option the tests pass (the two TS2554 errors). That is failing for the right reason. A test that failed because of a typo in the test itself would not be.

The evidence:

| Command | Output |
| --- | --- |
| `npm test` | 41 tests pass on `weekend-rule` (35 on `main` plus 6 weekend tests) |
| `npm run test:py` | 27 pass |
| `npm run typecheck`, `npm run check:py` | Pass |
| `npm run due -- 2027-03-05` | 8 invoices, total $19,229.53 |
| `PAY_WEEKEND_RULE=on npm run due -- 2027-03-05` | 10 invoices, total $33,109.53 |
| `bash scripts/check-tests-unchanged.sh main` | No existing test lines removed or edited, and no test switched off |

The change pane (step 4): the app's pane shows what changed in the working tree or the session, so right after step 1 it may show nothing at all, or only the merge. `git diff --stat main...weekend-rule` lists every file the branch changes, six of them: `src/due-date.ts`, `src/due-by-friday.ts`, `src/reconcile.ts`, `tests/weekend.test.ts`, `py/brightline_ap/due_date.py` and `py/tests/test_weekend.py`. The review setup merged from `main` does not appear, because three dots compare with where the branch now leaves `main`. Notice `src/reconcile.ts`: a weekend rule for the payment list has no obvious reason to touch reconciliation, which is where the planted issue sits. A reviewer of the whole branch needs the three-dot diff. Panes differ between apps and versions, so record what yours showed.

The planted issue: `src/reconcile.ts`, line 17, uses `expectedDue`, which applies the weekend rule when the flag is on. With `PAY_WEEKEND_RULE=on`, `npm run reconcile -- data/invoices.csv` reports:

```text
INV-8303  stated 2027-03-06  computed 2027-03-05
INV-8309  stated 2027-02-28  computed 2027-02-26
2 mismatches
```

Both stated dates are correct. They are contract due dates on a Saturday and a Sunday. Reconciliation should compare them with `dueDate`, the date the terms give, not with the pay date. The tests miss it because they run with the flag off.

Reviews vary between runs and models. A fresh-context reviewer told to look at "anything else the change affects" usually finds it. One that reads only the diff often does not. Either result is a correct record, as long as your notes say which.

A reference brief is at the end of this key.

## Reference `changes/weekend-rule.md`

The commit ids in your brief will differ, and the Review section grows in Task 8.

```markdown
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
| Tests came first, and failed for the right reason | Lab 13's tests-first rule | `git switch --detach weekend-rule-start~1`, then `npm test` and `npm run typecheck` | only `tests/weekend.test.ts` fails: `payBy` does not exist yet | bfc668f |
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
```
