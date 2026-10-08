# Answer key, Lab 11

Your wording will differ. Check the reasoning, not the words.

## 1. Containment

| Failure | Stop or pause | Remove until known | Check outside the conversation |
| --- | --- | --- | --- |
| A. Duplicate check | Pause the job. It is still set up, and its matching rule is wrong. Assign a person to check each invoice email by hand until it is fixed. | Nothing | Pull 7781-R from Monday's payment run. Confirm 7781 was paid January 7. Check every email the job did not check: the nine on Tuesday, and any since. |
| B. Dispute replies | Nothing was sent. Hold the three drafts. | Nothing | Confirm no draft was sent. Lakeshore is owed an explanation of the $312.40 credit memo. Great Lakes is owed $96.18. |
| C. Thursday note | Pause the scheduled job before next Thursday. | Write access to the AP folder, if the job is paused anyway | Delete or mark the wrong note. Post a correction in the AP channel. Send Dave the real list of 31 invoices. |
| D. Remittance replies | Stop any further sends. | Sending, until the drive is reconnected | Find the five sent emails. Send each vendor a correction with the attachment. |

## 2. Diagnosis

| Run | Cause | Evidence line | One-minute check |
| --- | --- | --- | --- |
| A | Capacity: weekly usage limit. Also the brief. | "Not started. Usage limit reached." The brief says nothing about suffixes, so a match between 7781-R and 7781 cannot be relied on. | Open the usage page: limit reached Monday 8:58 p.m. Then read the brief: no rule for suffixes such as -R. |
| B | The brief | Brief: "Reply to these three vendors about their short payments." Context: "No knowledge source was attached." | Hold the brief against its four parts. Inputs are missing. |
| C | The inputs | Step 1: "Found `AP Register.csv`." 71 rows, the closed 2026 file. | Open the file the record names. Its rows are all paid or carried forward. |
| D | Tools and permissions. Also the brief. | Step 2: "access denied (authorization expired)." Step 3: drafting anyway. The brief had no rule for a missing attachment. | Find the first error in the step list. Then read the brief for a failure path. |

Neither of Dave's fixes would have worked. A stronger model fixes none of the four. New briefs fix B, and only part of A, C and D.

Also note for C and A: both are **silent failures**. C ran and completed. A said nothing because it only reports problems.

**A person passed two of them.** Maria passed the Thursday note and approved the Friday batch without opening an attachment. Add two reviewer checks to the review contract: read the note's first line (register, date, count, total) before passing it on, and before approving a batch, confirm that each message carries an attachment and that it matches that message's recipient, opening a sample to check the contents.

If you found only the usage limit for A, or only the access error for D, you stopped at the first cause. One failure can live in two places.

## 3. Usage

- One task on Monday afternoon used 70 percent of a weekly allowance. Two restarts re-read all 46 statements.
- The duplicate check shares Maria's pool, so it stopped at 8:58 p.m.
- The Thursday note runs under Dave's account, so it still ran.
- The allowance became available again on Wednesday, January 13, at 7:00 a.m. Evidence that the check resumed would be completed runs in its history after that time, each with a message ID. A reset restores allowance. It does not prove the job ran afterwards, and it does not replay the emails it missed. Check the run history for Wednesday runs, and check Tuesday's nine emails by hand. Nobody was told about the stop, and it will happen again the next time heavy work drains the pool.
- A good proposal: standing jobs run under an account or seat whose budget is planned for them, owned by a named person (Dave, as approver, or Maria). Heavy one-off work does not run from that pool. A separate daily check compares emails received with emails checked, so a stop is visible the same day. Moving work to a personal account is never the fix.

## 4. Discount check

| Invoice | Draft discount | Correct discount | Error |
| --- | --- | --- | --- |
| 5134 | $124.34 | $124.31 | $0.03 too high |
| 5151 | $77.60 | $77.60 | correct |
| 5186 | $34.73 | $34.85 | $0.12 too low |
| 5237 | $371.70 | $413.00 | $41.30 too low |
| 5254 | $183.55 | $182.55 | $1.00 too high |
| 5271 | $10.26 | $10.26 | correct |
| 5288 | $48.47 | $48.00 | $0.47 too high |
| 5305 | $280.11 | $280.11 | correct |

**Likely cause:** capacity, wrong feature. The rate and the amounts check out, the errors are small and varying, and the working is written in sentences. Recomputing in a spreadsheet tests that: the spreadsheet figures match the formula, and the prose figures do not. **Fix:** "Compute each discount as amount times 0.02, rounded to the cent, using code execution or a spreadsheet. Show the formula, not a sentence." Note also that Great Lakes Fasteners is not on this list, because its terms are 1 percent 15.

## 5. Fixed briefs (one lever each)

**Thursday note. Lever: the inputs.**
> Open the AP register at <link to AP Register 2027>. Do not search by name. First line of the note: the file name, its last entry date and the number of open invoices due on or before next Thursday, with their total. If the file cannot be opened, or its last entry is more than three business days old, or it lists fewer than 10 open invoices due, do not write the note. Post "Pre-run note skipped: register check failed (<reason>)" in the AP channel and stop.

Success signal: the first line, every week, with file name, date, count and total.

**Duplicate check. Lever: the brief (success signal and matching). The diagnosed cause, capacity, is fixed in the Role Contract's usage budget, not here.** Make these as separate changes and test each one on the January 12 emails before the next.
> For each new invoice email, compare the vendor, the invoice number with any suffix such as -R removed, and the amount with the register, including paid invoices. If it matches, post "Possible duplicate: <vendor> <invoice>". After each check, add one line to the duplicate-check log: time, message ID, vendor, invoice, result.

**Separate daily check (a scheduled task, or a named person).** An event-triggered job cannot report that it never started, so the daily line must come from outside it:
> At 5 p.m. each weekday, list the message IDs of today's invoice emails in the AP inbox and the message IDs in today's duplicate-check log. Post "Duplicate check: <received> received, <checked> checked, <m> possible duplicates." Then list every received ID missing from the log, and every ID logged more than once, and tag Maria.

Match by message ID, not by count. Equal counts can hide a missed email if another was checked twice. If the 5 p.m. line has not appeared by 5:30 p.m., Jordan checks that day's invoice emails by hand and tells Maria.

After any outage, check the missed emails by hand. The usage owner change belongs in the Role Contract, not the brief.

**Short-payment replies. Lever: the brief (inputs and autonomy).**
> Outcome: a reply to each vendor that explains the short payment in plain numbers. Inputs: the vendor's terms from the KSoR concept "vendor payment terms," and the invoice and payment lines from the register. Format: invoice amount, terms, discount or credit, amount paid, difference. Autonomy: draft only. If the terms are not in the KSoR, say so and do not state any terms. If Brightline underpaid, say what is owed and flag it for Maria.

**Remittance replies (if you fixed it too).** Lever: permissions. Reconnect the drive with read access to the Remittances folder only. Brief rule: "If an attachment cannot be retrieved, do not say it is attached. Stop and report it."

## 6. Port notes

**The one-off runs in this lab.** The wording needs little or no change, with the files attached and the as-of date stated. In Claude, read the task's side panel for its steps, outputs and connectors. In ChatGPT Work, review the task's progress while it runs. OpenAI documents no separate step log for Work.

**A live scheduled version, if you built one later.** In Claude, past runs are under Scheduled. In ChatGPT, results are on the Scheduled page. OpenAI says a scheduled task created in a project cannot reach uploaded or project files, so the register must sit in an app the task can reach. Check that before you promise the job will run.

## 7. Promotion table

| Correction | Type | Home | Wording |
| --- | --- | --- | --- |
| Credit memos listed as amounts owed | Rule | Standing instructions | "Credit memos reduce what we owe. Never list them as amounts due." |
| No flag for small suppliers near 15 days | Reference plus rule | KSoR concept (the promise), standing instruction (the flag) | "Flag any small supplier whose invoice will be older than 12 days at the payment run." |
| Amounts without cents | Procedure | Skill for the Thursday note | The note's layout: columns, cents, currency code on every amount |
| Northern Maple in USD (Dec 17) | Rule, seen once | Watch. Promote early only if Maria judges currency errors high-risk | "Show every amount with its currency code. Never convert." |
| Maria and Jordan reply differently | Variance | Skill for dispute replies, from the KSoR terms | Maria's reply structure, as the template |
| Drive access to the whole drive | Boundary | Authority Envelope | Read-only, Remittances folder only |

Consolidate first: the Thursday note's checks and layout become one skill, rather than three separate instructions.

## 8. Baseline and metric

- Baseline: 40 minutes of corrections on January 7, three repeated corrections. The log gives 36 to 45 minutes a week, about 40 on average.
- Metric: accuracy first (corrections needed per note, target zero), then minutes.
- Side by side: three Thursdays with Maria still checking the new note against the old method. Switch when two clean notes in a row need no correction.

## Role Contract version 6: what changes

- Responsibilities 1 and 2 gain their success signals and failure paths.
- Authority Envelope: shared drive narrowed to read-only on the Remittances folder.
- New line: **Usage budget.** Standing jobs run under the AP team's planned seat. Owner: Dave. Maria checks usage every Monday. Heavy one-off work does not run from this seat.
- Evaluation: Maria logs corrections each Thursday. Any correction that appears twice is promoted.
- Review checks: the reviewer reads the Thursday note's first line before passing it on. Before approving a batch, the reviewer confirms each message carries an attachment that matches its recipient, and opens a sample.
- Recovery: after any failure, the worker returns only to the authority in this contract, when Maria agrees the fix has held. A clean test never widens it.
