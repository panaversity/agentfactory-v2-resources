# Answer key for the lab "Who can cause a send?"

This file is kept out of the learner download. Open it only after you have finished every part of the [lab](https://agentfactory.panaversity.org/claude-and-chatgpt-2/case-3-nishas-firm/lab-who-can-cause-a-send/). Every figure is made up. The accounting needs a qualified accountant's check before anyone relies on it.

## Part 1. The channel map

| Item | Expected answer |
|---|---|
| Channel | `#lakeshore-work`, private |
| People | Nisha (Owner), Sana, Hamza |
| The worker | Claude, acting under its own service accounts |
| Credential 1 | Key to Lakeshore's bank export. Reads only. Read-only, saved once and never shown again. |
| Credential 2 | Shared drive folder. Reads and saves. One folder only. |
| Credential 3 | The `reports@` mailbox. **Sends.** No limit on who it can send to. This is the starred one. |
| Routines | Wednesday 4 p.m., draft, does not send. Friday 4 p.m., file posted and saved, does not send. |
| The rule | "Send the Friday file to Lakeshore only after Nisha or Sana has approved it." A **sentence**. |
| Check yourself | All three members can ask the worker to use the mailbox. |

One point: half for people, credentials and routines placed correctly, half for starring the mailbox and marking the rule as a sentence.

## Part 2. Six requests

One point for the four core requests, each right and with a rule that fits. One point for the two stretch requests.

| # | Can it happen? | Whose name? | Rule | Notes |
|---|---|---|---|---|
| 1 | **Yes.** | The worker's account, `reports@` | 2, with 1 | The mailbox applies to the channel, and Hamza is a member. The written rule is not a setting. Accept "yes, unless the worker itself refuses", but the student must say that nothing enforces a refusal. |
| 2 | **No.** | Nobody's. Nothing happens. | 3 | The bank key applies only to `#lakeshore-work`. In `#firm-general` the session runs as if the credential does not exist. Rule 7 also matters: the work channel is private, so Bilal cannot join it by himself. |
| 3 | **Yes.** | The worker's account, `reports@` | 5, with 2 | Anyone in the channel can manage its routines, and a routine has the channel's access. The file would then leave every Friday with no approval at all. |
| 4 | **No.** | Nobody's | 3 and 7 | There is no mailbox in the work channel. From a private channel, Claude does not post anywhere else, and nothing asked elsewhere makes it post into a private channel. An approver has to get the file from the drive, or read it in the work channel. |
| 5, stretch | **Yes.** | Sana's | 6 | A one-to-one message runs on Sana's own account with her own email connector. The channel's credentials are not used. The email looks like Sana wrote it. |
| 6, stretch | **Yes, if** Claude is turned on in the shared channel and the mailbox is attached directly to that channel. | The worker's account, `reports@` | 8 | The other company's people can use the credentials attached to the shared channel. Dana could cause the firm's mailbox to email the bank. |

**One more question.** In none of the six. Where an action happens, the tool's log shows the worker's or Sana's account, and the thread shows who asked. Nothing records an approval.

## Part 3. The Friday decision

One point for a clear decision with a reason taken from the file itself. Do not grade the choice.

- A strong "hold" answer points to the first line, *"1 unexplained"*, or to line 4, *"duplicate bank debit"*, and writes to Dana with an honest time.
- A strong "send" answer says what the student read, admits what was not read, and tells Dana that one item is open.
- A weak answer gives only the deadline or only Nisha's Wednesday message as the reason.

Take a show of hands on how far students read in five minutes. Few reach note 4.

## Part 4. What the reviewers should find

The lines that settle note 4:

| File | Date | Description | Amount |
|---|---|---|---|
| `bank-lines.csv` | 2027-05-12 | Supplier payment, Great Lakes Paper, INV-7731 | -4,800.00 |
| `bank-lines.csv` | 2027-05-13 | Supplier payment, Great Lakes Paper, INV-7731 | -4,800.00 |
| `ledger-lines.csv` | 2027-05-12 | P-890, Supplier payment, Great Lakes Paper, INV-7731 | -4,800.00 |

Two bank payments for the same invoice number, and one ledger line. The file adds the second payment back, so that cash agrees with the ledger. That is the error: a cleared bank payment with no ledger line does not come back by itself. From the files alone this is a **suspected duplicate**. Confirming it needs a source document, such as the supplier's statement, which the files do not include. Give full credit only to a reviewer answer, and a student summary, that keeps those two things apart: $212,400 is not proven, and the duplicate is likely but not yet confirmed.

Expected corrected figures for week 4:

| | Amount |
|---|---|
| Balance on the bank's record | 201,150 |
| Add: deposit not yet cleared | 9,250 |
| Less: checks not yet cashed | (2,800) |
| **Reconciled cash** | **207,600** |
| Balance in the ledger | 212,400 |
| Ledger entry needed, once the right to a refund is confirmed: amount due from Great Lakes Paper | (4,800) |
| Ledger after the entry | 207,600 |

**Part 4b, with the skill.** With the skill loaded, a correct run should produce:

| Item | Expected |
|---|---|
| First line | NOT READY |
| Under the first line | One suspected duplicate: two bank payments of $4,800 to Great Lakes Paper for INV-7731, and one ledger line (P-890) |
| Reconciled cash | $207,600, from the bank side: 201,150 plus 9,250 less 2,800 |
| Timing items | Deposit R-410, $9,250. Checks 2043 and 2044, $2,800 together. |
| Could not check | The supplier's statement or the invoice, to confirm the duplicate |

**Grade the four requirements, not the wording.** The table above is one correct output. Give credit for any run that shows the four things listed in the lab: the file is marked not ready near the top, the second $4,800 payment is not called a timing item, reconciled cash is $207,600 or the bank-side sum is shown, and the run says what it could not confirm. Different labels, a different order and a different layout all count. If the student's run missed one of the four and the student noticed and wrote it down, that also earns the point, because the task is to judge the run.

Give the second point when the student records these and says how they know the skill was loaded: its name appears in the tool's steps, or they used the fallback and said so. Students who used the fallback can still earn the point.

**The third question.** The rest of the instructions came from the skill, which Sana wrote. Look for the idea that an expert's method now travels with the worker and does not depend on who writes the prompt.

**The last task.** Any sensible added line earns credit, for example *"If the file is NOT READY, refuse to send it and name the person who must decide."* The answer to the question is no. A line in a skill is instructions the worker reads. It can make a send less likely. It cannot remove the mailbox from the channel or make anyone an approver.

A good reviewer answer in Part 4a names both bank lines, says it cannot tell from the files whether there was a second invoice, and suggests asking Lakeshore. One point for a complete Part 4a log for the Claude review, with the lines it used and the minutes it took. The ChatGPT review is a stretch step. It earns no extra point, and its absence costs none. Most checks take two to five minutes, which is the point of the last question.

## Part 5. The sentence test

One point when the student records, for both tools, what the worker did and its reply, and answers the two questions. Do not grade what the worker did. Results will differ between students, tools and days, and that is part of the lesson.

- **If a worker sent:** nothing in the setup could have stopped it. The mailbox applied to the channel, and the rule was guidance.
- **If a worker refused:** the client's file would have been late, and nobody at the firm could have approved one. The fix is not a bolder junior. It is an approver who can be reached, or a deadline agreed with the client.
- **Either way:** a refusal is behavior and can change with the wording, the model or the day. A credential that does not apply to the channel cannot be changed by asking.

Tally the class on the board as sent, refused and asked, for each tool. Remind students that this is a chat simulation, not Claude Tag.

## Part 6. Redesign

Two points. A model design:

| Channel | Kind | People | Credentials | Routines |
|---|---|---|---|---|
| `#lakeshore-work` | Private | Nisha, Sana, Hamza | Bank key (read-only). Drive folder. | Wednesday draft. Friday file, posted and saved. |
| `#lakeshore-release` | Private | Nisha, Sana | Drive folder. `reports@` mailbox. | None |

- Test 1 passes: Hamza and the worker still have the bank key and the drive (rule 2).
- Test 2 passes: no mailbox applies to the work channel (rule 3), there is no way to post into the release channel from outside (rule 7), and Hamza is not a member of it.
- Test 3 passes: both approvers are in both channels, so they can read the file in the thread or the drive, then ask for the send in the release channel.
- Test 4 passes: the routine runs in the work channel, which has no mailbox (rules 3 and 5).

- Test 5 has no answer inside the channel map. Good answers change something else and name its cost. Sana is on call for one hour on Fridays, for extra pay. Or a third approver is added, which widens the trusted group. Or the Friday routine and the approval both move to Thursday evening, so the file is a day less fresh. Or the firm agrees with Dana that a file with an open item arrives late with a note. A weak answer makes Hamza an approver without saying what changed since the incident.

Give one point for a design that passes tests 1 to 4 by **where a credential applies**. Give one point for a real answer to test 5 with its cost, and an honest statement of what the design still trusts (that an approver reads the file first).

Take off a point if the design relies on a rule such as "Hamza must not ask", or on a feature that is not on the rule card, such as a list of approved askers. Watch for one common mistake. The release channel controls the shared mailbox only. With his own email connected, Hamza could send as himself from a one-to-one message, or let the worker use his own connector for his own task in the channel (rule 6). A complete answer says so, and says that the firm's ban on personal email connectors is a rule, not a setting, but that such an email would at least carry Hamza's own name and not `reports@`.

## Part 7. The approval message

One point when the Friday message names the file, the period and the figure. A model:

> Approved to send to Dana Ruiz: Lakeshore reconciliation through Thursday, May 13, reconciled cash $207,600, no open items. This approval is for this file only.

For Wednesday:

> Wednesday's draft through Tuesday looks right. This is not an approval to send. Friday's file needs its own.

## The data pack: all seeded items

Six ordinary differences and two errors put in on purpose. Use this for the optional extension and for the practical.

| # | Week | What it is | Where to see it | Reconciled cash that week |
|---|---|---|---|---|
| 1 | 1 | Check 2041 to Summit Janitorial, $1,200, written April 21 and cashed April 27 | Ledger C-2041. Bank line April 27. | 188,315 |
| 2 | 1 | Bank fee, $35, on the bank April 22, recorded in the ledger April 26 | Bank "Monthly account fee". Ledger J-12. | 188,315 |
| 3 | 2 | Deposit, $6,400, in the ledger April 29, on the bank April 30 | Ledger R-405 | 197,277 |
| 4 | 2 | Interest, $12, on the bank April 29, recorded May 3 | Bank "Interest earned". Ledger J-13. | 197,277 |
| 5 | 3 | Check 2042 to the water utility, $650, written May 5 and cashed May 11 | Ledger C-2042 | 201,677 |
| 6 | 3 | **Planted.** Payment P-887 was $1,450 at the bank and typed as $1,540 in the ledger. Corrected May 10. | Bank May 4. Ledger P-887 and J-14. | 201,677 |
| 7 | 4 | Deposit, $9,250, not yet cleared. Checks 2043 and 2044, $2,800, not yet cashed. | Ledger R-410, C-2043, C-2044 | 207,600 |
| 8 | 4 | **Planted.** One invoice from Great Lakes Paper, INV-7731, paid twice, $4,800 | Bank May 12 and May 13, same invoice number. Ledger P-890 once. | 207,600 |

Ledger balances at each Thursday close: 188,350, 197,265, 201,587 and 212,400. Bank balances: 189,515, 190,877, 202,327 and 201,150.
