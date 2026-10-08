# Lab 11: When the Worker Goes Wrong

**Time:** about 2 hours. **You need:** a Claude paid plan and a ChatGPT paid plan for step 6. Every other step works with any AI assistant, or with none. **Data:** every record in this lab is invented. Never practice on real financial data.

## The situation

Brightline Wholesale Supply is a wholesale distributor in Columbus, Ohio, with about 40 staff. Its AP Worker's two recurring jobs have run on their own since November 9, 2026. Maria is the office manager. Dave Kowalski is the controller. Jordan Ellis is a clerk hired for year-end. In the week of January 11, 2027, four things went wrong. Read `inputs/january-events.md` first.

You will contain each failure, find its cause from its task record, fix one lever, and make the fixes last.

## Before you start: predict

In `results/diagnosis.md`, write which of five causes you think each failure has, from the events file alone: the brief, the inputs, tools and permissions, capacity, or task fit. You will check your guesses later.

## Steps

**1. Contain.** For each of the four failures, write in `results/containment-log.md`: what you stop or pause, what access you remove until the cause is known, and what you check outside the conversation. Be specific: which invoice, which emails, which channel post.

**2. Diagnose.** Read the four records in `inputs/task-records/`. For each, add to `results/diagnosis.md`: the cause, the exact line in the record that shows it, and the one-minute check that confirms it. Some failures have more than one cause, and some also passed a person who could have caught them. Compare with your prediction.

**3. Usage.** Read `inputs/usage-report.md`. In `results/usage-check.md`, explain why the duplicate check stopped, which work drained the pool, why the Thursday note still ran, when the allowance becomes available again, and what evidence would show the check has actually resumed. Propose who should own the budget for recurring jobs.

**4. A repeatable error.** Recompute the discounts in `inputs/early-pay-draft.md` from `inputs/early-pay-invoices.csv`, using a spreadsheet or a short script. In `results/discount-check.md`, list each wrong figure, the correct figure, and the cause. Then rewrite the brief so the arithmetic is done as a calculation, not in prose.

**5. Fix the briefs.** In `results/fixed-briefs.md`, rewrite the three briefs in `inputs/briefs-current.md`. For each, change one lever only, and say which. Each recurring job also needs a success signal (`results/success-signals.md`) and a failure path for a missing or stale input.

**6. Run and port.** Use these settings so every learner gets the same result:

- **As-of date:** Thursday, January 14, 2027. Tell the AI this date in the brief. "The date of the next run" means Friday, January 22, 2027, and "three business days old" counts back from January 14.
- **Input:** attach the two files in `inputs/registers/` to the task. Do not rely on a link.
- **Output:** ask for the note in the chat, not in a channel. Save it as `results/thursday-note-run.md`.

In Claude, start a one-off task with your fixed Thursday brief. Confirm it reports the 2027 register, its last entry date and the 31 invoices, and that it stops if you attach only the closed file. Then run the same brief as a one-off ChatGPT Work task with the same files. Do not create a live schedule. Instead, write in `results/port-notes.md` what a real scheduled version would need on each AI vendor. Note that OpenAI says a scheduled task created in a project cannot reach uploaded or project files, so a live version needs the register in an app the task can reach. If you do create a practice schedule, pause or delete it when you finish.

**7. Make it stick.** From `inputs/feedback-log.md` and `inputs/dispute-replies-compared.md`, write `results/promotion-table.md`: each repeated correction or variance, whether it is a rule, a reference, a procedure or a boundary, where it goes, and the exact wording. In `results/baseline.md`, record Maria's baseline, the metric you will measure, and how many Thursdays you will run old and new side by side.

**8. Role Contract.** Write `role/ap-worker-role-contract.md`, Draft 8, from `inputs/ap-worker-role-contract-draft7.md`. Add: success signals for both recurring jobs, failure paths, read-only access to the Remittances folder only, the reviewer's checks that would have caught the Thursday and Friday failures, and a named owner for the worker's usage budget.

## Check your work

Compare with `answer-key/answer-key.md` only after you finish.

## If something goes wrong in the lab

- **The AI says it cannot read the CSV.** Paste the rows for open invoices due January 15 to 22 instead.
- **Your Thursday run finds a different total.** Check it filtered on status "open" and due on or before January 22, 2027. The total includes 7781-R, which must still be stopped.
- **ChatGPT Work is not on your plan.** Write the scheduled prompt you would use, and note "not run."
- **You hit a usage limit during the lab.** That is part of the lesson. Note what you were doing, check your usage page, and continue after the reset.
