# Lab 10: Keep the AP Worker running, on terms Dave can defend

**Time:** about six and a half hours of active work, in three sittings: Parts A to C, then Parts D to F, then Parts G and H.
**You produce:** `results/prediction.md`, `results/use-case-register.md`, `results/data-decision.md` and `results/vendor-extract-redacted.csv`, `results/route-and-send-spec.md` and `results/port-log.md`, `results/people-check.md`, `results/knowledge-register.md` and a takedown record for each item you take down, `results/sign-off-matrix.md`, `results/incident-note.md`, `results/governance-record.md`, `results/interim-ai-policy.md`, `role/ap-worker-role-contract.md` (Draft 7), and `results/my-workflow.md`, one workflow from your own field.
**Where you work:** in this folder, with any text editor, such as Notepad or TextEdit, and a spreadsheet app for Part B, such as Excel, Google Sheets, LibreOffice or Numbers. Parts B and D also use fresh chats in Claude or ChatGPT. Part C uses your accounts' settings and the AI vendors' help pages. Keep your work in this folder, not only in a chat: it is yours. Each Part ends with a file saved.
**With the desktop app:** you can also do the lab with the Claude or ChatGPT desktop app working in this folder. Open this folder in the app, and ask it to read `LAB.md` and start. The ChatGPT desktop app does this on any ChatGPT plan. The Claude desktop app needs a paid Claude plan. The agent reads `AGENTS.md`, its brief: you make every decision and write every answer, and it writes your answers down. It never opens the full vendor file: in Part B, you redact that yourself.
**You need:** a Claude or ChatGPT account whose chats accept attached files or pasted text. An account with both AI vendors helps in Part C, but their help pages are enough.
**You do not need:** code, a server, admin rights or any company system. Everything is in this folder.
**Before you start:** every record here is invented. Names, tax IDs, bank numbers and emails are fake, and the tax IDs start with zeros so they can never be real. Even so, practice the habit: never put real personal or financial data into an AI tool for practice. Make two empty folders in this folder for your work: `results` and `role`.

Open each file only when a step names it. Open a file in `answer-key/` only when a Part tells you to. Most files you write start from a file in `templates/`.

## The situation

Brightline Wholesale Supply is a wholesale distributor in Columbus, Ohio, with about 40 staff. Its AP Worker answers policy questions, prepares the Thursday pre-run note and drafts replies to vendors, which Maria, the office manager, sends. AP means accounts payable, the bills a company owes. The pre-run note is the summary Dave Kowalski, the controller, reads before he approves each Friday's payment run.

In the first nine days of December 2026, four ordinary decisions went wrong (Chapter 10's opening story). Dave's first answer was "Turn it all off." In this lab you help him keep the worker running, on terms he can defend.

## Part A. Predict, then classify six uses (50 minutes)

*Where:* In this folder.

1. Before you open any file in `inputs/`, write two lines in `results/prediction.md`. Which of the four December failures in the chapter's opening would a written AI policy alone have prevented, and why? Keep it as it is: Part H looks back at it.
2. Read `inputs/december-events.md`. Then read `inputs/proposed-uses.md`, six uses Brightline's staff proposed on Friday, December 11, 2026.
3. Copy `templates/use-case-register.md` to `results/use-case-register.md`. Classify the activity the worker would do, not the subject it is about. If a use bundles two activities, classify each one. For each use, write:
   - the answer: appropriate, appropriate with review, or inappropriate
   - the deciding factor: the one screen that, if its answer changed, would change the answer
   - the gate, if one is needed: who checks what, and when
   For a use you mark inappropriate, add what the worker may still do to support the person who decides.
4. You may ask an AI to challenge your reasoning in a fresh chat. Start your message with "Today is Friday, December 11, 2026.", because a chat knows the real date. Do not ask it to approve the use: the answers are yours.

Then open `answer-key/A-use-case-register.md` and score the register with row A of `rubric.md`.

*You save:* `results/prediction.md` and `results/use-case-register.md`.

## Part B. The vendor clean-up data (50 minutes)

*Where:* In this folder, a spreadsheet app, and two fresh chats.

Read `inputs/dedup-request.md`. Then open `inputs/vendor-master-extract.csv` in your spreadsheet app, never in a chat. Copy `templates/data-decision.md` to `results/data-decision.md`.

1. Classify each column as green, yellow or red.
2. Decide which columns the duplicate check needs. You will remove the rest.
3. Make the redacted file yourself, on your own computer. First add a column called `tin_last4` that holds the last four characters of `tin`. In most spreadsheets the formula is `=RIGHT(I2,4)`, copied down the column. Copy the new column, and paste it back over itself as values only: in most apps, Paste Special, then Values. Otherwise it breaks when `tin` is gone. Then delete `tin` and every other column you decided to remove, and save the file as `results/vendor-extract-redacted.csv`. Check that it still has 36 vendor rows. The AI never sees the full file: that is the habit this Part builds.
4. **Test it.** Open a fresh chat. It must not use your memory, or keep the chat for training: in Claude, start an incognito chat, or turn off Memory in the "+" menu as you start the chat and check that your privacy setting does not allow training. In ChatGPT, open a Temporary Chat and choose Unpersonalized before you send the first message. Attach `results/vendor-extract-redacted.csv` and nothing else, and ask the AI to find likely duplicate vendors. Then compare its answer with `inputs/known-duplicates.md`, which you keep out of the chat. It must find every pair there, and it must not call the decoy a duplicate.
5. In a copy of your redacted file, delete the tax ID columns too, and run the test again in another fresh chat. Record what changed.
6. Fill in the route and the purpose in `results/data-decision.md`: which route may carry this file, and whether finding duplicates is within the purpose the tax IDs were collected for.

Then open `answer-key/B-data-decision.md` and score your work with row B of `rubric.md`.

*You save:* `results/data-decision.md` and `results/vendor-extract-redacted.csv`.

## Part C. One spec, two AI vendors (60 minutes)

*Where:* In this folder, your Claude and ChatGPT settings, and the help pages in `sources.md`.

Copy `templates/route-and-send-spec.md` to `results/route-and-send-spec.md`, and `templates/port-log.md` to `results/port-log.md`.

1. **Write the spec once, with no AI vendor's name.** For the AP Worker, state:
   - the route its work data may use, and what that route must have: training off, no personal accounts, chat history kept or deleted, memory on or off
   - the actions it may take on its own, the actions that need approval and by whom, and the actions it must never be able to take. Sending anything to the auditors is in the last group.
2. **Apply it on one AI vendor.** Use the account you have. For each line of the spec, record the setting you used and where it lives. If a control needs admin rights you do not have, record where an admin would set it, and what you did instead on your own plan. If a line rules out the kind of account you have, such as a personal one, log it as "needs another plan" and go on.
3. **Port it to the other AI vendor.** Apply the same spec, line by line. If you have no account there, use its help pages in `sources.md`, and say so.
4. **Log the port.** For each line: same, renamed, needs another plan, or cannot be enforced. For every "cannot be enforced," write the fallback. Removing the tool is always a fallback. Then write one line: what no setting on either AI vendor decides.

The spec must not change between AI vendors. Only the settings change. Then open `answer-key/C-port.md` and score your spec and log with row C of `rubric.md`. If your screens differ from the key, trust your screens and write down the date: products change.

*You save:* `results/route-and-send-spec.md` and `results/port-log.md`.

## Part D. Who the early-pay list left out (50 minutes)

*Where:* In this folder, a spreadsheet app if you like, and one or two fresh chats.

Read `inputs/early-pay-request.md`, `inputs/early-pay-list-2026-12-01.csv`, `inputs/open-invoices-2026-12-01.csv` and `inputs/supplier-terms-commitment.md`. Copy `templates/people-check.md` to `results/people-check.md`.

1. Write who is affected by the list, including people who never see it.
2. List every small supplier with an open invoice. For each, count the days from the day Brightline received the invoice to Tuesday, December 1, 2026. Compute the days, do not estimate them. If an AI does it, have it show the rows or the code.
3. Mark who is already past the 15-day promise, and by how many days.
4. Mark who reaches day 15 before the following run, on Friday, December 11, 2026. They must be paid on December 4 too. Paying on day 15 itself still keeps the promise.
5. Write down the standard Dave's brief carried that nobody wrote down.
6. Rewrite Dave's brief so the list cannot repeat the mistake. Test it in a fresh chat, set up as in Part B, step 4: attach `inputs/open-invoices-2026-12-01.csv` and `inputs/supplier-terms-commitment.md`. Start your message with "Today is Tuesday, December 1, 2026.", because a chat knows the real date and the list depends on it. Then give your brief. Check its list against your table from steps 2 to 4. If it leaves out a supplier your table says must be paid, fix the brief and test again in another fresh chat.
7. Decide whether the suppliers should be told how the list was made.

Then open `answer-key/D-people-check.md` and score your work with row D of `rubric.md`.

*You save:* `results/people-check.md`.

## Part E. Knowledge: owners, status and takedown (45 minutes)

*Where:* In this folder.

Read `inputs/knowledge-inventory.md` and the files in `inputs/knowledge/`. Copy `templates/knowledge-register.md` to `results/knowledge-register.md`.

1. For each item, record its owner, its status (draft, stable, deprecated, not yet a concept, or not governed), and one action. Not governed means it has no owner and no approval. Not yet a concept means an approved rule, such as a signed memo, that nobody has written as a concept yet. The actions:
   - keep it as it is
   - remove a copy that should not be served
   - deprecate it, pointing to its successor
   - take it down
   - draft a new concept for approval
2. For each item you take down, copy `templates/takedown-record.md` to `results/takedown-record-<id>.md`, such as `results/takedown-record-k7.md`, and fill it in. List every copy, where it is, who removes it, and how you check it can no longer be retrieved. Dave is the takedown authority.

Then open `answer-key/E-knowledge.md` and score your work with row E of `rubric.md`.

*You save:* `results/knowledge-register.md` and your takedown records.

## Part F. Who signs (40 minutes)

*Where:* In this folder.

Read `inputs/outputs-to-sign.md` and `inputs/ap-worker-role-contract-draft6.md`. Copy `templates/sign-off-matrix.md` to `results/sign-off-matrix.md`.

1. For each of the eight outputs, record who must sign or approve, from which identity, who sends it, whether the worker may send it, and what the gate checks.
2. Check the schedule the auditors received, `inputs/schedule-sent-2026-12-03.md`, against the register, `inputs/open-payables-register-2026-11-30.csv`. Write every line that does not match, and what is wrong with the total.

Then open `answer-key/F-sign-off.md` and score your work with row F of `rubric.md`.

*You save:* `results/sign-off-matrix.md`.

## Part G. The first hour (20 minutes)

*Where:* In this folder.

Read `inputs/incident-facts.md`, Maria's own account of Sunday, December 6. Copy `templates/incident-note.md` to `results/incident-note.md`, and write Maria's incident note as she should have written it at 7 a.m. on Monday, December 7, 2026. Facts only.

Then open `answer-key/G-incident-note.md` and score your note with row G of `rubric.md`.

*You save:* `results/incident-note.md`.

## Part H. Make it last (75 minutes)

*Where:* In this folder.

1. Copy `templates/governance-record.md` to `results/governance-record.md`, and fill it in for one workflow: year-end payables schedules for the auditors. Write OPEN QUESTION in any field you cannot answer yet.
2. Copy `templates/interim-ai-policy.md` to `results/interim-ai-policy.md`: one page for Dave to approve. Do not call it official.
3. Write `role/ap-worker-role-contract.md`, Draft 7, from `inputs/ap-worker-role-contract-draft6.md`. If you kept your Role Contract from Chapter 9, start from that instead. Change only what this lab showed must change, and list each change at the top.
4. Open `results/prediction.md` again. Under your prediction, write one line for each December failure: what it needed besides a written policy.
5. Pick one workflow you own in your own field. Write its Governance Record, and name one piece of knowledge in your work that has no owner. Save it as `results/my-workflow.md`.

Then open `answer-key/H-make-it-last.md` and score steps 1 to 3 with row H of `rubric.md`.

*You save:* `results/governance-record.md`, `results/interim-ai-policy.md`, `role/ap-worker-role-contract.md` and `results/my-workflow.md`. The lab is not finished until all four are saved, even after you pass the rubric.

## What this lab does not prove

Your records show what Brightline decided, and why. They do not make a setting enforce itself, or prove that a person will check what a gate asks them to check. A record is only as good as the review and the re-check behind it: the Governance Record names what triggers the next one.

## Check before you finish

- [ ] `results/prediction.md`, written before you opened the inputs, with your look back from Part H
- [ ] `results/use-case-register.md`: six uses, each with an answer, a deciding factor and a gate where one is needed
- [ ] `results/data-decision.md` and `results/vendor-extract-redacted.csv`: the tiers, the fields kept and removed, the route, and the known-answer test passed
- [ ] `results/route-and-send-spec.md` and `results/port-log.md`: one spec, applied on one AI vendor and ported to the other, every change logged
- [ ] `results/people-check.md`: who the early-pay list left out, how late their payments were, and the rewritten brief, tested
- [ ] `results/knowledge-register.md` and a takedown record for each item you took down
- [ ] `results/sign-off-matrix.md`: eight outputs, and the schedule check
- [ ] `results/incident-note.md`: the five first-hour steps, with facts only
- [ ] `results/governance-record.md` and `results/interim-ai-policy.md`, ready for Dave
- [ ] `role/ap-worker-role-contract.md`, Draft 7, with each change listed at the top
- [ ] `results/my-workflow.md`, one workflow from your own field

## If something goes wrong

Read this list only when you are stuck. It gives no answers.

- **You are not sure how to delete a column.** In most spreadsheets, select the column's header, right-click and choose Delete. Then save the file as CSV.
- **Your `tin_last4` column shows `#REF!`.** You deleted `tin` before you pasted the new column as values. Undo, paste the column as values, then delete `tin` again.
- **Your spreadsheet changed the tax IDs.** Some spreadsheets read `00-0006835` as a date or drop the leading zeros. Import the file with every column as text, or check a few `tin_last4` values against the original.
- **The AI hesitates over the redacted file because it still holds partial tax IDs.** That is reasonable caution. Tell it the data is invented for a training lab, and point to the zeros at the start of every tax ID.
- **The AI finds a fifth duplicate.** Check it against `inputs/known-duplicates.md`. If it is the decoy, your redaction removed the column that tells them apart, or the AI matched on names alone. Ask it which columns it used.
- **You cannot see tool or action permissions.** On Claude, you set each connector tool's level yourself, in the connector's settings (Chapter 7). On business plans, an admin can also block a tool or an action for everyone. If you cannot find either, record where an admin would set it, and use the fallback: no email tool connected, and the worker drafts into a folder.
- **You cannot tell whether a knowledge item is draft or stable.** If no recorded approval exists, it is not stable.
- **A chat remembers an earlier chat.** It should not. Check that you started a fresh chat with your memory off, as Part B says, and run that test again.
- **Notepad saves your file as `.txt`.** In Save As, choose "All files" under the file type, then type the name with `.md` at the end.
- **You ran out of messages.** Record what you finished and mark the rest "not run." The lab still counts.
