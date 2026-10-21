# Lab 06: Review a run you did not watch

**Time:** about 2 hours 15 minutes of active work, and 10 more for an optional step.
**You produce:** `results/review-contract.md`, `results/predictions.md`, `results/review-findings.md`, `results/recompute.md`, `results/audience-check.md`, `results/second-reviewer.md` (or `results/transfer-plan.md`), a Review Contract for one task in a role you know, and `results/linda-brief.md`.
**Where you work:** in this folder, with any text editor, such as Notepad or TextEdit, and a spreadsheet for the totals. Only Parts C and F use chats with Claude and ChatGPT. Keep your contract and your findings in this folder, not in a chat: they are yours. You can take one Part per sitting. Parts A to E each end with a file saved.
**With the desktop app:** you can also do the lab with the Claude or ChatGPT desktop app. Open this folder in the app, and ask it to read `LAB.md` and start. The ChatGPT desktop app does this on any ChatGPT plan. The Claude desktop app needs a paid Claude plan. The agent reads `AGENTS.md`, its brief: you write the contract, find the problems and decide, and it writes your answers down. The second-reviewer chats in Part C, and Part F, still happen in fresh chats.
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

Each chat is fresh and cannot see your own memory, so your memory does not change the test. In Claude, open an incognito chat, from the ghost icon at the top right of a new chat: it does not use or add to memory. In ChatGPT, open a Temporary Chat and choose Unpersonalized before you send the first message.

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

## Part F. One result, a new reader (15 minutes, and 10 for an optional step)

*Where:* In a new chat for each task.

On Thursday, November 5, the week after your review, Dave approved the memo for Friday's run, `part-f/approved-memo-2026-11-06.md`. Late that afternoon he writes again, about Linda, Brightline's owner. [Concept 6.6](https://agentfactory2.panaversity.org/managing-ai-workers/the-review-contract/audience/) says what changes when you adapt a result for a new reader, and what never does. Here you try it.

**How Task F1 works.** Open one new conversation, with memory off, as in Part C. The task is a loop:

1. Write your brief under the four headings, Outcome, Format, Inputs and Autonomy, and send it as the task says. The AI knows nothing of Brightline or of Dave's message, so put what it needs in the brief.
2. Download the task's answer key, one click.
3. Attach the key, and send the check prompt below.
4. Missed a check? Fix your brief, send it again in the same chat, and send the check prompt again. The key, and the file you attached, are already in the chat.

No way to attach a file? Open the key, copy all of it, and paste it into the chat before the check prompt.

**The check prompt.** Attach the task's key first, then send:

```text
Outcome:  The task you just did for me in this conversation, graded
          against the attached answer key: Passed or Missed for each
          of its checks.
Format:   A table: the check, Passed or Missed, the words that show
          it, from your answer or my brief, and one line on why. Then
          how many passed.
Inputs:   My latest brief and your latest answer in this
          conversation, and the attached answer key.
Autonomy: Grade only. Do not redo the task, and do not suggest a
          better brief. With no quote, mark the check Missed.
```

**Task F1. Three lines for Linda (15 minutes).**

**Dave writes:** "Linda wants Friday's run in three lines, for her phone, before the leadership call at 9 a.m. on Friday, November 6. She needs the cash going out, what we're holding and why, and anything she has to decide. She doesn't know our invoice numbers. One change since I approved the memo: Midwest Packaging called about invoice 4588. We hold it until they send a corrected copy."

**What you do:**

1. Write your brief.
2. Send it, with `part-f/approved-memo-2026-11-06.md` from the folder attached.
3. **Check it now.** Download [Task F1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch06-key-task-f1.md), one click. Attach it, and send the check prompt.

**Give Dave:** Linda's three lines.

*You save:* your final brief, with Linda's three lines below it, as `results/linda-brief.md`.

**Checkpoint.** All 5 checks passed, and you read the key yourself.

**Task F2. Research on your own work (optional, 10 minutes).**

Open a new chat, with memory off, and ask the AI in your own words for research on a question from your own work, such as how other small teams handle a job you do. Both apps search the web when a question needs it. If no search runs, ask it to search the web. If the answer gives no sources, ask for them. Then check it as [Concept 6.5](https://agentfactory2.panaversity.org/managing-ai-workers/the-review-contract/citation-and-abstention/) does:

- Open the source behind the main claim.
- Pages that copy one source count as one source, not several.
- Ask for evidence that disagrees, or search for it yourself.
- Check when each source was published.

This task has no answer key, because a live search changes from day to day. Write down whether the main claim held up, and why, in `results/research-check.md`.

## If something goes wrong

Read this list only when you are stuck. It gives no answers.

- **You found nothing wrong.** Match every source ID to the CSV. Then trace every approval ID and policy section to its source.
- **Your totals do not match the answer key.** Work out each row again from `inputs/` alone, by policy section 3, and use Maria's decisions from the task record.
- **The second reviewer calls something a problem that you left alone.** Check its finding against the sources and the policy before you accept it. A second reviewer can be wrong.
- **The second reviewer agrees with everything.** Ask it to cite the file and row for each check it says passed.
- **Notepad saves your file as `.txt`.** In Save As, choose "All files" under the file type, then type the name with `.md` at the end, such as `review-contract.md`.
- **The assistant will not open a file.** Paste the file's text into the chat instead, with its file name on the first line.
- **You ran out of messages.** Record what you finished and mark the rest "not run." The lab still counts.
