# Lab 06: review a run you did not watch

**Time:** about 100 minutes of active work.
**You need:** a spreadsheet or any tool that can add a column. For Part C, a Claude account on any plan that accepts file attachments, and a ChatGPT account. Part C works in ordinary chat on either vendor. With one vendor only, use `results/transfer-plan.md` for the other.

## Part A. Predict: write the Review Contract first (15 minutes)

In normal work you write the contract before delegating. Here you inherit finished work, so you write it before opening it. It cannot shape the work, but it keeps the package from setting your standard.

1. Read `inputs/payment-run-brief-v3.md` and skim the five source files. Do not open `worker-output/`.
2. Copy `templates/review-contract-template.md` to `results/review-contract.md`. Fill in all four sections for this run. Write the date and time at the top.
3. Under the contract, predict in two or three lines which checks are most likely to find a problem, and why.

## Part B. Run: review the package against your contract (35 minutes)

1. Open the four files in `worker-output/`. Read the task record first. It shows what the worker read, what Maria decided, and what the worker wrote and sent.
2. Run every check in your contract. Log each problem in `results/review-findings.md`, with the file and row and the check that caught it.
3. Fill in `results/recompute.md`. Recompute every figure from `inputs/` and Maria's decisions. Never copy a figure from the worker's files.
4. Fill in `results/audience-check.md`.
5. List anything that looked wrong but turned out right, with the reason. Do not assume last week's problems are this week's.

## Part C. Investigate: a second reviewer on both vendors (25 minutes)

1. Start a fresh conversation in Claude. Attach the five source files, the brief, the four worker-output files and your Review Contract. Send:

> You are reviewing an AP Worker's payment-run proposal for a controller who did not watch the work. Check it against the attached Review Contract and the source files only. For each problem, give the file and row, what is wrong, and the source that shows it. List anything you checked and found correct. Do not fix anything. Do not decide whether to approve.

2. Do the same in ChatGPT, with the same files and the same message.
3. Fill in `results/second-reviewer.md`. Mark every finding as found by you, by the AI, or both. Check each AI finding against the sources. A second reviewer can be wrong too.

## Part D. Modify: tighten the contract and decide (15 minutes)

1. Add every check you were missing in Part B as a dated amendment below your original contract. Do not edit the original.
2. Write one new line for the brief that would have prevented the worst problem, and say which section it goes in.
3. Write your decision at the end of `results/review-findings.md`: approve as delivered, approve after named fixes, or return. Give one sentence of why. If you choose named fixes, also say which checks must be rerun and what approvals must be recorded before release.
4. Now open `answer-key/`. Score yourself with the rubric.

## Part E. Make (10 minutes)

Write a Review Contract for one recurring task in a role you know. Name what is checked, what evidence comes back, what counts as success, and what stops the worker.

## Troubleshooting

- **You found nothing wrong.** Match every source ID to the CSV. Then trace every approval ID and policy section to its source.
- **Your totals do not match the answer key.** Check that you used the vendor record's terms, not the invoice's, and Maria's decisions from the task record.
- **You held invoices the sources clear.** Check every input file, not only the policy and the invoice list.
- **The second reviewer flagged the credit memo as incomplete.** Check it against policy version 3 and the brief. Abstaining is the right output when the policy is silent.
- **The second reviewer agrees with everything.** Ask it to cite the file and row for each check it says passed.
