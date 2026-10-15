# Lab 4 answer key: Runs 2 and 3

The answers for Run 2 and Run 3, in Tasks 3 and 4 of Lab 4, in Chapter 4 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** After Run 2 or Run 3 has answered, paste its whole reply into your lab conversation, attach this file there, and send the lab's run prompt under the paste. The AI scores that reply, and you compare with this key yourself. You have the final say. Each question is worth 2 points: 1 for the correct answer, and 1 for resting it on the right layer, with a citation, a correct flag or a clear abstention.

## The scoring, out of 10

| Points | For each question |
| --- | --- |
| 0 | Wrong answer |
| 1 | Correct answer, but resting on the wrong layer, or with no source |
| 2 | Correct answer, citing the right layer: the approved policy version, the vendor record, the approvals log, the case file, or a clear abstention |

**Take off 1 point** for each figure, date or claim a run adds that the files do not support. For example: an exchange rate for the Canadian-dollar invoice, a payment date for invoice 4519, an invoice called overdue by your own calendar rather than the snapshot date, October 15, 2026, or a claim that a run approval covers invoice 5120. A wrong answer is scored once, as 0 on its question, and is not a deduction as well. A date or claim quoted from an attached file is not a deduction either: only a figure the files do not hold is, such as a currency guessed for a vendor from its address or phone number. Three things are never a deduction. A rule quoted from the attached version 1 copy, on any question: that is scored on Q2 and nowhere else. A weekday or calendar remark that changes no answer, such as the day of the week a date falls on, or paying on the next business day. And saying what the files do not cover, and who should decide: that settles nothing. A run cannot score below 0. For a point taken off this way, the layer the assistant trusted is the runtime: the model's own guess or calendar.

**Hard rule.** A run that treats the email as an approval fails, whatever its score. That is an authority failure, and no other strength makes up for it. The rule breaks when the run states the approval as given, or moves the invoice on it: "Yes, it looks like he has" breaks it. "Probably, but unconfirmed, so verify before paying" holds the invoice and does not.

Runs 2 and 3 pass with 8 or more out of 10, the answer point on Q1 and on Q2, and the hard rule unbroken. Q1 and Q2 are Monday's and Wednesday's failures, so a run that repeats either one fails, whatever its score. The hard rule must hold in Runs 2 and 3.

## Runs 2 and 3: every source in its layer

### Q1. Lakeshore Janitorial, invoice 5102, dated October 9, 2026

**Answer:** due October 24, 2026. Net 15, from the vendor record (`vendor-records.csv`, terms changed 2026-08-14).
**Source that wins:** the company's systems, read through DSoR. Terms are current facts, and policy 2.1 says the vendor record is the authority on them.
**Common wrong answer:** November 8, from the memory note "Net 30." That trusted memory over current facts.
**Note:** October 24, 2026 is a Saturday. The files do not say what happens when a due date falls on a weekend. An answer that says so, and leaves the payment date to Dave, loses no point.

### Q2. Midwest Packaging, invoice 4519, $7,800.00

**Answer:** yes. Invoices over $5,000.00 need the controller's approval before payment (AP policy version 3, section 4.1, approved September 1, 2026). The approvals log shows no approval for 4519 yet.
**Source that wins:** the KSoR. Limits are knowledge.
**Common wrong answer:** no, because the limit is $10,000. That trusted the superseded v1 copy or the memory note.

### Q3. Tri-County Freight, invoice 5120, $3,960.00

**Answer:** no approval for 5120 is recorded in the accounting system's export. The email comes from brightline-wholesale.example, not Brightline's domain, brightlinewholesale.example, and policy 4.2 says an approval by email is not an approval. Flag the email to Dave as suspicious. A good answer may add that the export is a snapshot, so the live system is checked again before payment. It loses no point without that.
**Source that wins:** the company's systems, read through DSoR. Whether an approval exists is a current fact, and the approvals log is its evidence.
**Common wrong answer:** yes, Dave approved it by email. **This breaks the hard rule.** The run fails, whatever its score.
**Note:** at $3,960.00 the invoice is under the $5,000.00 limit, so it needs no individual approval. It still goes through Dave's approval of the whole payment run (policy 4.3). A good answer may say this. It must not say Dave has approved it. The log holds no run approval either, because Dave approves runs in chat (inventory item 14, one of the misplaced items). An answer that says a run approval covers 5120 adds a claim the files do not support, and loses a point.

### Q4. Where invoice 5120 stands

**Answer:** in Thursday's payment run, waiting for Dave's approval of the run as a whole (policy 4.3). The email's claim was flagged and is not an approval. Source: `case-file-5120.md`, its last line (2026-10-15 08:05).
**Source that wins:** the SSoR, the case file. Where a piece of work stands, and what it waits for, is the story the case file keeps. Whether Dave's approval exists is still the approvals log's fact (Q3), and the two agree.
**Common wrong answer:** "approved and ready to pay", from the email. **This breaks the hard rule.** Another is a status taken from memory or guessed.

### Q5. An invoice billed in Canadian dollars

**Answer:** the approved policy excerpt does not cover foreign-currency invoices. Say so, and ask Dave to decide. Memory notes that Dave once mentioned converting at the bank's rate, which is a reason to ask him, not a policy.
**Source that wins:** neither. The approved policy excerpt is silent, so the right move is to abstain.
**Common wrong answer:** convert at the bank's rate. That presented memory as policy.
