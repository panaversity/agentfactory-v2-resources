# Lab 11: Diagnose and fix four failed runs

**Time:** about six hours of active work, in two sittings: Parts A to D, then Parts E to H. Part H's last step is optional, and adds about 15 minutes.
**You produce:** `results/prediction.md`, `results/containment-log.md`, `results/diagnosis.md`, `results/usage-check.md`, `results/discount-check.md`, `results/fixed-briefs.md` and `results/success-signals.md`, `results/thursday-note-run.md` and `results/port-notes.md`, `results/promotion-table.md` and `results/baseline.md`, `role/ap-worker-role-contract.md` (Draft 8), and, if you choose, `results/my-workflow.md`, one job from your own field.
**Where you work:** in this folder, with any text editor, such as Notepad or TextEdit, and a spreadsheet app for Part D, such as Excel, Google Sheets, LibreOffice or Numbers. Part F runs one task in Claude and one in ChatGPT Work. Keep your work in this folder, not only in a chat: it is yours. Each Part ends with a file saved.
**With the desktop app:** you can also do the lab with the Claude or ChatGPT desktop app working in this folder. Open this folder in the app, and ask it to read `LAB.md` and start. The ChatGPT desktop app does this on any ChatGPT plan. The Claude desktop app needs a paid Claude plan. The agent reads `AGENTS.md`, its brief: you make every decision and give every answer, and it writes your answers down.
**You need:** for Part F, a paid Claude plan, to run a task, and a ChatGPT plan that includes Work, such as Plus or Pro, to port it. Every other Part works with any AI chat, or with none.
**You do not need:** a server, admin rights or any company system. Everything is in this folder.
**Before you start:** every record here is invented. Even so, practice the habit: never put real financial data into an AI tool for practice. Make two empty folders in this folder for your work: `results` and `role`.

Open each file only when a step names it. Open a file in `answer-key/` only when a Part tells you to. Most files you write start from a file in `templates/`.

## The situation

Brightline Wholesale Supply is a wholesale distributor in Columbus, Ohio, with about 40 staff. AP means accounts payable, the bills a company owes. Brightline's AP Worker drafts replies to vendors, which Maria, the office manager, sends. It also runs two recurring jobs on its own: the Thursday pre-run note, and a duplicate check on each invoice email. The pre-run note is the summary Dave Kowalski, the controller, reads before he approves each Friday's payment run. Jordan Ellis is a clerk hired for year-end.

In the week of January 11, 2027, four things went wrong (Chapter 11's opening story). Dave's first answer was "Switch to the most expensive model, and Maria, rewrite every brief from scratch." In this lab you contain each failure, find its cause in its task record, fix it one change at a time, and make the fixes last.

## Part A. Predict, then contain (45 minutes)

*Where:* In this folder.

1. Before you open any file in `inputs/`, copy `templates/prediction.md` to `results/prediction.md`. For each of the four failures in the chapter's opening story, write the check you would run first, and what result would prove your first guess wrong. Keep it as it is: Part H looks back at it.
2. Read `inputs/january-events.md`.
3. Copy `templates/containment-log.md` to `results/containment-log.md`. For each of the four failures, write what you stop or pause, what access you remove until the cause is known, and what you check outside the conversation. Be specific: which invoice, which emails, which note.

Then open `answer-key/A-containment.md` and score your log with row A of `rubric.md`.

*You save:* `results/prediction.md` and `results/containment-log.md`.

## Part B. Diagnose from the task records (45 minutes)

*Where:* In this folder.

Read the four records in `inputs/task-records/`, then `inputs/briefs-current.md` and `inputs/vendor-terms.md`. Open the files in `inputs/registers/` when a check needs them. Copy `templates/diagnosis.md` to `results/diagnosis.md`.

1. For each failure, write the cause, the exact line in the record that shows it, and the one-minute check that tests it. Some failures have more than one cause.
2. Some failures also passed a person who could have caught them. For each, write the check that person skipped.
3. Compare your causes with your prediction.

Then open `answer-key/B-diagnosis.md` and score your work with row B of `rubric.md`.

*You save:* `results/diagnosis.md`.

## Part C. Usage (30 minutes)

*Where:* In this folder.

Read `inputs/usage-report.md`. Copy `templates/usage-check.md` to `results/usage-check.md`, and answer each question in it:

1. Why did the duplicate check stop, and which work used up the pool?
2. Why did the Thursday note still run?
3. When did the allowance become available again, and what evidence would show that the check has started again?
4. Who should own the budget for recurring jobs?

If you have a Claude or ChatGPT account, find where it shows your own usage, and write that down too. `sources.md` lists the help pages.

Then open `answer-key/C-usage.md` and score your work with row C of `rubric.md`.

*You save:* `results/usage-check.md`.

## Part D. A repeated error: the discounts (30 minutes)

*Where:* In this folder, and a spreadsheet app.

Read `inputs/early-pay-draft.md`, then open `inputs/early-pay-invoices.csv` in your spreadsheet app. Copy `templates/discount-check.md` to `results/discount-check.md`.

1. Work out each discount again, using a spreadsheet or a short script.
2. List each wrong figure, the correct figure, and the cause.
3. Rewrite the brief so the arithmetic is done as a calculation, not in prose.

Then open `answer-key/D-discount-check.md` and score your work with row D of `rubric.md`.

*You save:* `results/discount-check.md`.

## Part E. Fix the briefs (55 minutes)

*Where:* In this folder.

Read `inputs/briefs-current.md` again. Copy `templates/fixed-briefs.md` to `results/fixed-briefs.md`, and `templates/success-signals.md` to `results/success-signals.md`.

1. Rewrite the three briefs, one change at a time. For each change, say which lever it pulls: the brief, the inputs or the permissions.
2. Give each recurring job a success signal, and a failure path for a missing or out-of-date input.
3. Optional: fix the replies with remittance notices too. The template has a place for it.

Then open `answer-key/E-fixed-briefs.md` and score your work with row E of `rubric.md`.

*You save:* `results/fixed-briefs.md` and `results/success-signals.md`.

## Part F. Run the fixed Thursday brief, then port it (60 minutes)

*Where:* Claude, as a one-off task, and ChatGPT Work.

Use these settings, so every reader gets the same result:

- *The date.* Start your brief with "Today is Thursday, January 14, 2027. This week's payment run is on Friday, January 15, 2027.", because an AI knows the real date. The Friday after that run is January 22, 2027, and "three business days old" counts back from January 14.
- *The input.* Attach the two files in `inputs/registers/` to the task. Do not rely on a link.
- *The output.* Ask for the note in the chat, not in a channel or a folder.

1. In Claude, start a one-off task with your fixed Thursday brief. Check that the note names the 2027 register, its last entry date and the 31 invoices. Then run it again with only the closed file attached, and check that it stops. Save both results in `results/thursday-note-run.md`, from `templates/thursday-note-run.md`.
2. Run the same brief as a one-off ChatGPT Work task, with the same files.
3. Do not create a live schedule. Copy `templates/port-notes.md` to `results/port-notes.md`, and write what a real scheduled version would need on each AI vendor. OpenAI says a scheduled task created in a project cannot reach uploaded files or project files, so a live version needs the register in an app the task can reach. If you do create a practice schedule, pause or delete it when you finish.

Then open `answer-key/F-port-notes.md` and score your work with row F of `rubric.md`.

*You save:* `results/thursday-note-run.md` and `results/port-notes.md`.

## Part G. Make the fixes last (45 minutes)

*Where:* In this folder.

Read `inputs/feedback-log.md` and `inputs/dispute-replies-compared.md`. Copy `templates/promotion-table.md` to `results/promotion-table.md`, and `templates/baseline.md` to `results/baseline.md`.

1. In the promotion table, list each repeated correction, and the variance between the two replies. For each, write whether it is a rule, a reference, a procedure or a boundary, where it goes, and the exact wording.
2. In the baseline file, record Maria's baseline, the metric you will measure, and for how many Thursdays you will run the old setup, the briefs as they were, and the new one at the same time.

Then open `answer-key/G-promotion-and-baseline.md` and score your work with row G of `rubric.md`.

*You save:* `results/promotion-table.md` and `results/baseline.md`.

## Part H. The Role Contract, and a look back (40 minutes, and about 15 for the optional step 3)

*Where:* In this folder.

1. Write `role/ap-worker-role-contract.md`, Draft 8, from `inputs/ap-worker-role-contract-draft7.md`. If you kept your Role Contract from Chapter 10, start from that instead. Add: success signals for both recurring jobs, failure paths, read-only access to the Remittances folder only, the reviewer's checks that would have caught the Thursday and Friday failures, and a named owner for the worker's usage budget. List each change at the top. Draft 7 names no shared drive, though the Friday task's connection reached all of it, so naming only the Remittances folder narrows what the worker can reach.
2. Open `results/prediction.md` again. Under your prediction, write one line for each failure: what your first check would have shown, and whether your first guess held.
3. Optional: pick one job you run often in your own field. Write its success signal, its failure path for a missing input, and who owns its usage budget. Save it as `results/my-workflow.md`.

Then open `answer-key/H-role-contract.md` and score step 1 with row H of `rubric.md`.

*You save:* `role/ap-worker-role-contract.md`, and `results/my-workflow.md` if you do step 3. The lab is not finished until the Role Contract is saved, even after you pass the rubric.

## What this lab does not prove

Your files show what should change, and why. They do not prove that the fixed jobs will run cleanly every week: one clean run is a first check, not proof. The old and new setups, run at the same time for the Thursdays your baseline plan names, are what would show it.

## Check before you finish

- [ ] `results/prediction.md`, written before you opened the inputs, with your look back from Part H
- [ ] `results/containment-log.md`: four failures, each with what you stopped, removed and checked
- [ ] `results/diagnosis.md`: each cause, its line in the record and a one-minute check, and each check a person skipped
- [ ] `results/usage-check.md`: why the check stopped, why the note still ran, and who owns the budget
- [ ] `results/discount-check.md`: each discount worked out again, and the brief rewritten
- [ ] `results/fixed-briefs.md` and `results/success-signals.md`: three briefs, one lever each, and a signal and a failure path for each recurring job
- [ ] `results/thursday-note-run.md` and `results/port-notes.md`: the fixed brief run in Claude and in ChatGPT Work, or marked "not run"
- [ ] `results/promotion-table.md` and `results/baseline.md`
- [ ] `role/ap-worker-role-contract.md`, Draft 8, with each change listed at the top
- [ ] Optional: `results/my-workflow.md`, one job from your own field

## If something goes wrong

Read this list only when you are stuck. It gives no answers.

- **The AI says it cannot read the CSV.** Paste the rows for open invoices due January 15 to 22 instead.
- **Your Thursday run finds a different total.** Check that it filtered on status "open" and due on or before January 22, 2027.
- **Your spreadsheet shows more than two decimals.** Round each discount to the cent: in most spreadsheets, put your formula inside `=ROUND( ... ,2)`.
- **ChatGPT Work is not on your plan.** Write the brief you would use, and note "not run." The lab still counts.
- **You hit a usage limit during the lab.** That is part of the lesson. Note what you were doing, check your usage page, and continue after the reset.
- **Notepad saves your file as `.txt`.** In Save As, choose "All files" under the file type, then type the name with `.md` at the end.
