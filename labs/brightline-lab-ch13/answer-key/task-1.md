# Lab 13 answer key: Task 1. What is it paying on?

The answers for Task 1 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 1 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 1 | The project is under git | `git log` on `main` shows a first commit with the message "The project as I received it" | There is no git history, or the branch is not `main` |
| 2 | The tests and the type checker pass | Both pass for my language: `npm test` and `npm run typecheck` in TypeScript, or `npm run test:py` and `npm run check:py` in Python | Either one fails, or was not run |
| 3 | Friday's list | `npm run due -- 2027-03-05`, or `npm run due:py -- 2027-03-05`, ends with `8 invoices, total $19,229.53` | Any other count or total |
| 4 | The three predictions (unscored) | Ask me what I predicted for INV-8305, INV-8303 and INV-8309 before the run. A wrong prediction is not a miss | I made no prediction before the run |
| 5 | The rules somebody chose | `NOTES.md` has the heading "Rules behind Friday's list", and under it at least the three rules below | The heading is missing, or one of the three rules is |
| 6 | What nobody chose | `NOTES.md` has the heading "Nobody chose these yet", with at least one entry under it | The heading is missing, or the list is empty |

## The three predictions

| Invoice | On Friday's list? | Why |
| --- | --- | --- |
| INV-8305 | Yes | It has no due date, so its due date is the invoice date plus its terms: February 3 plus 30 days is March 5, the day of the run |
| INV-8303 | No | It is due on March 6, the day after the run |
| INV-8309 | No | It is paid |

## The three rules

1. Paid invoices are left out. Only an invoice whose status is `open` can be on the list.
2. Late invoices are kept. An invoice is on the list when its due date is on or before the cutoff, however long ago.
3. An invoice with no due date is due on its invoice date plus the days in its terms.

The agent may list more rules, such as the sort order, or that "Due on receipt" means 0 days. That is fine.

## Friday's list

| Due date | Invoice | Vendor | Amount |
| --- | --- | --- | --- |
| 2027-02-26 | INV-8304 | Scioto Office Products | $234.50 |
| 2027-03-01 | INV-8307 | Ohio Valley Electric | $2,411.33 |
| 2027-03-03 | INV-8301 | Midwest Packaging Co. | $4,825.00 |
| 2027-03-03 | INV-8302 | Buckeye Janitorial Supply | $618.75 |
| 2027-03-03 | INV-8314 | Lakefront Labels Inc. | $2,265.00 |
| 2027-03-04 | INV-8315 | Cardinal Forklift Service | $1,325.00 |
| 2027-03-05 | INV-8305 | Hocking Valley Pallets | $7,350.00 |
| 2027-03-05 | INV-8312 | Scioto Office Products | $199.95 |

## Never a deduction

- How many entries the second list has, or which ones. Agents list different things, and nobody has to settle them today.
- The exact words of a rule.
- Extra rules in the first list.
- Which entry of the second list I asked about in step 9, or what the agent showed for it.
