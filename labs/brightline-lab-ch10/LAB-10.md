# Lab 10. Governance and responsible use at Brightline

**Standalone.** This lab needs no file from any other chapter. Everything is in this folder.

**Every record here is invented.** Names, tax IDs, bank numbers and emails are fake. The tax IDs start with zeros so they can never be real. Even so, practice the habit: use your organization's approved AI route, or a personal account with training turned off. Never put real personal or financial data into an AI tool for practice.

## The situation

Brightline Wholesale Supply is a wholesale distributor in Columbus, Ohio, with about 40 staff. Its AP Worker answers policy questions, prepares the Thursday pre-run note and drafts vendor replies, which Maria, the office manager, sends. In the first nine days of December 2026, four things went wrong. Write your prediction (below) first, then read `inputs/december-events.md`.

Dave Kowalski, the controller, wanted to turn the worker off. You will help him keep it running on terms he can defend.

## Before you start

Plan two sessions of about two hours each. Session 1: Parts A to D. Session 2: Parts E to H.

Make a folder called `results/` next to this file. Every answer goes there. Templates are in `templates/`. Copy one into `results/` before you fill it in.

**Predict.** In `results/prediction.md`, write two lines: which of the four December events a written policy alone would have prevented, and why.

## Part A. Classify six proposed uses (about 20 minutes)

Read `inputs/proposed-uses.md`. Use `templates/use-case-register.md`.

For each use, record:
- the answer: appropriate, appropriate with review, or inappropriate
- the deciding factor: the one screen that, if it changed, would change the answer
- the gate, if one is needed, as who checks what, and when

You may ask an AI to challenge your reasoning. Do not ask it to approve the use.

## Part B. The vendor clean-up data (about 30 minutes)

Read `inputs/dedup-request.md` and open `inputs/vendor-master-extract.csv`. Use `templates/data-decision.md`.

1. Classify each column as green, yellow or red.
2. Decide which columns the duplicate check needs. Remove the rest.
3. Make the redacted file yourself, on your own computer, in a spreadsheet. First add a column called `tin_last4` that holds the last four characters of `tin`. In most spreadsheets the formula is `=RIGHT(I2,4)`, copied down the column. Then delete `tin` and every other column you decided to remove, and save it as `results/vendor-extract-redacted.csv`. Check that the row count is the same as the original. The AI never sees the full file. That is the habit this part builds.
4. **Test it.** Ask your AI to find likely duplicates using only the redacted file. Compare its answer with `inputs/known-duplicates.md`. It must find every pair there, and it must not call the decoy a duplicate.
5. Now remove the tax ID columns entirely and run the test again. Record what changed.

## Part C. One spec, two vendors (about 40 minutes)

Use `templates/route-and-send-spec.md` and `templates/port-log.md`.

1. **Write the spec once, with no AI vendor's name.** For the AP Worker, state:
   - the route its work data may use, and what that route must have: training off, no personal accounts, chat history kept or deleted, memory on or off
   - the actions it may take on its own, the actions that need approval and by whom, and the actions it must never be able to take. Sending anything to the auditors is in the last group.
2. **Apply it on one AI vendor.** Use the account you have. For each line of the spec, record the setting you used and where it lives. If a control needs admin rights you do not have, record where an admin would set it, and what you did instead on your own plan.
3. **Port it to the other AI vendor.** Apply the same spec, line by line. If you have no account there, use its help pages and say so.
4. **Log the port.** For each line: same, renamed, needs another plan, or cannot be enforced. For every "cannot be enforced," write the fallback. Removing the tool is always a fallback.

The spec must not change between AI vendors. Only the settings change.

## Part D. Who the early-pay list left out (about 25 minutes)

Read `inputs/early-pay-request.md`, `inputs/early-pay-list-2026-12-01.csv`, `inputs/open-invoices-2026-12-01.csv` and `inputs/supplier-terms-commitment.md`. Use `templates/people-check.md`.

1. List every small supplier with an open invoice. For each, count the days from receipt to December 1, 2026.
2. Mark who is already past the 15-day promise, and by how many days.
3. Mark who reaches day 15 before the following run, on Friday, December 11, 2026. They must be paid on December 4 too.
4. Rewrite Dave's brief so the list cannot repeat the mistake.

Compute the days, do not estimate them. If an AI does it, have it show the code or the rows.

## Part E. Knowledge: owners, status and takedown (about 30 minutes)

Read `inputs/knowledge-inventory.md` and the files in `inputs/knowledge/`. Use `templates/knowledge-register.md` and `templates/takedown-record.md`.

For each item, record its owner, its status (draft, stable, deprecated, not yet a concept, or not governed), and one action:
- keep as it is
- remove a copy that should not be served
- deprecate, pointing to its successor
- take down
- draft a new concept for approval

Then write one takedown record for each item you take down. List every copy, where it is, and how it will be removed. Dave is the takedown authority.

## Part F. Who signs (about 25 minutes)

Read `inputs/outputs-to-sign.md` and `inputs/ap-worker-role-contract-draft6.md`. Use `templates/sign-off-matrix.md`.

For each output, record: who must sign or approve, who sends it, and whether the worker may send it. Then check the schedule the auditors received, `inputs/schedule-sent-2026-12-03.md`, against `inputs/open-payables-register-2026-11-30.csv`. Find every line that does not match.

## Part G. The first hour (about 15 minutes)

Read `inputs/incident-facts.md`. Use `templates/incident-note.md`. Write Maria's incident note as she should have written it at 7 a.m. on Monday, December 7, 2026. Facts only.

## Part H. Make it last (about 40 minutes)

1. Fill in `templates/governance-record.md` for the workflow "year-end payables schedules for the auditors."
2. Fill in `templates/interim-ai-policy.md`: one page for Dave to approve. Do not call it official.
3. Write `role/ap-worker-role-contract.md`, Draft 7, from Draft 6. Change only what this lab showed must change, and list each change at the top.

## Check your work

Compare with `answer-key/` only after you finish each part. Score yourself with `rubric.md`.

## Troubleshooting

- **You are not sure how to delete columns.** In most spreadsheets, select the column header, right-click and choose Delete. Then save as CSV.
- **The AI hesitates over the redacted file because it still holds partial tax IDs.** That is reasonable caution. Tell it the data is synthetic and invented for a training lab, and point to the zeros at the start of every tax ID.
- **The AI finds a fifth duplicate.** Check it against `inputs/known-duplicates.md`. If it is the decoy, your redaction removed the column that tells them apart, or the AI matched on names alone. Ask it which columns it used.
- **You cannot see tool or action permissions.** On Claude, you set each connector tool's level yourself, in the connector's settings (Chapter 7). On business plans, an admin can also block a tool or an action for everyone. If you cannot find either, record where an admin would set it, and use the fallback: no email tool connected, the worker drafts into a folder.
- **You cannot tell if a knowledge item is draft or stable.** If no recorded approval exists, it is not stable.
