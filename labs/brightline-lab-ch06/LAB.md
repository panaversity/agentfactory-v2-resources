# Lab 06: Review a run you did not watch

**Time:** about 2 hours of active work.
**You produce:** `results/review-contract.md`, `results/predictions.md`, `results/review-findings.md`, `results/recompute.md`, `results/audience-check.md`, `results/second-reviewer.md` (or `results/transfer-plan.md`), and a Review Contract for one task in a role you know.
**Where you work:** in this folder, with any text editor, such as Notepad or TextEdit, and a spreadsheet for the totals. Only Part C uses chats with Claude and ChatGPT. Keep your contract and your findings in this folder, not in a chat: they are yours. You can take one Part per sitting. Each Part ends with a file saved.
**With the desktop app:** you can also do the lab with the Claude or ChatGPT desktop app. Open this folder in the app, and ask it to read `LAB.md` and start. The ChatGPT desktop app does this on any ChatGPT plan. The Claude desktop app needs a paid Claude plan. The agent reads `AGENTS.md`, its brief: you write the contract, find the problems and decide, and it writes your answers down. The second-reviewer chats in Part C still happen in fresh chats.
**You need:** for Part C, a Claude account on any plan that accepts file attachments, and a ChatGPT account. Part C works in ordinary chat on either AI vendor. With only one AI vendor, fill `results/transfer-plan.md` for the other.
**Before you start:** never paste real company data into these chats. Everything here is invented.

Open each file only when a step names it. Do not open `worker-output/` until your Review Contract is saved. Do not open `answer-key/` until Part D, step 4. The blank contract is in `templates/`. The other forms are already in `results/`: fill them in where they are.

## Part A. Predict: write the Review Contract first (20 minutes)

*Where:* In this folder.

In normal work you write the contract before you delegate. Here someone hands you finished work, so you write the contract before you open it. It cannot shape the work, but it keeps the package from setting your standard.

1. Read the story at the top of `README.md`, then `inputs/payment-run-brief-v3.md`, the brief the worker received. Skim the five source files in `inputs/`.
2. Copy `templates/review-contract-template.md` to `results/review-contract.md`. Fill in all four sections for this run. Write the date and time at the top.
3. In `results/predictions.md`, predict in two or three lines which checks are most likely to find a problem, and why.

*You save:* `results/review-contract.md` and `results/predictions.md`.

## Part B. Run: review the package against your contract (45 minutes)

*Where:* In this folder, with a spreadsheet for the totals.

1. Open the four files in `worker-output/`. Read the task record first. It shows what the worker read, what Maria decided, and what the worker wrote and sent.
2. Run every check in your contract. Write each problem in `results/review-findings.md`, with the file and row and the check that found it.
3. Fill in `results/recompute.md`. Work out every figure again from `inputs/` and Maria's decisions in the task record. Never copy a figure from the worker's files.
4. Fill in `results/audience-check.md`: the facts, compared across the three files.
5. Under "Things that look wrong but are right" in `results/review-findings.md`, list anything that looked wrong but turned out right, with the reason. Do not assume last week's problems are this week's.

*You save:* `results/review-findings.md`, `results/recompute.md` and `results/audience-check.md`.

## Part C. Investigate: a second reviewer on both AI vendors (30 minutes)

*Where:* In this folder, then in two fresh chats.

Each chat is fresh and cannot see your own memory, so your memory does not change the test. In Claude, turn off Memory in the "+" menu as you start the chat. In ChatGPT, open a Temporary Chat and choose Unpersonalized before you send the first message.

1. Start a fresh chat in Claude. Attach the six files in `inputs/`, the four files in `worker-output/`, and your `results/review-contract.md`. Send this message:

> You are reviewing an AP Worker's payment-run proposal for a controller who did not watch the work. Check it against the attached Review Contract and the source files only. For each problem, give the file and row, what is wrong, and the source that shows it. List anything you checked and found correct. Do not fix anything. Do not decide whether to approve.

2. Do the same in ChatGPT, with the same files and the same message.
3. Save each reply in `results/`, as `results/claude-review.md` and `results/chatgpt-review.md`.
4. Fill in `results/second-reviewer.md`. Mark every finding as found by you, by the AI, or both. Check each AI finding against the sources. A second reviewer can be wrong too.

Never attach `templates/`, your other `results/` files, such as your predictions, or `answer-key/`. Record the model and its settings for each chat.

*You save:* `results/second-reviewer.md` and the two replies, or `results/transfer-plan.md` if you use only one AI vendor.

## Part D. Modify: tighten the contract and decide (15 minutes)

*Where:* In this folder.

1. Add every check you were missing in Part B as a dated amendment below your original contract. Do not edit the original.
2. Write one new line for the brief that would have prevented the worst problem, and say which part of the brief it goes in.
3. Write your decision at the end of `results/review-findings.md`: approve as delivered, approve after named fixes, or return. Give one sentence of why. If you choose named fixes, also say which checks must be run again and which approvals must be recorded before release.
4. Now open `answer-key/`. Score yourself with `answer-key/review-rubric.md`.

*You save:* the amendments in `results/review-contract.md`, and your decision and score in `results/review-findings.md`.

## Part E. Make (10 minutes)

*Where:* In this folder.

Write a Review Contract for one task that repeats, in a role you know. Name what is checked, what evidence comes back, what counts as success, and what stops the worker. Mark the lines that also go into the brief.

*You save:* your own contract, as `results/my-review-contract.md`. The lab is not finished until it is saved, even after you pass the rubric.

## If something goes wrong

Read this list only when you are stuck. It gives no answers.

- **You found nothing wrong.** Match every source ID to the CSV. Then trace every approval ID and policy section to its source.
- **Your totals do not match the answer key.** Work out each row again from `inputs/` alone, by policy section 3, and use Maria's decisions from the task record.
- **The second reviewer calls something a problem that you left alone.** Check its finding against the sources and the policy before you accept it. A second reviewer can be wrong.
- **The second reviewer agrees with everything.** Ask it to cite the file and row for each check it says passed.
- **Notepad saves your file as `.txt`.** In Save As, choose "All files" under the file type, then type the name with `.md` at the end, such as `review-contract.md`.
- **The assistant will not open a file.** Paste the file's text into the chat instead, with its file name on the first line.
- **You ran out of messages.** Record what you finished and mark the rest "not run." The lab still counts.
