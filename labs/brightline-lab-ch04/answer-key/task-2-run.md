# Lab 4 answer key: Run 1

The answers for Run 1, in Task 2 of Lab 4, in Chapter 4 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented. Runs 2 and 3 have their own key, which you download at Task 3.

**How this key is used.** After Run 1 has answered, attach this file in the run's own conversation, with the lab's run prompt. The AI scores the answers it just gave, and you compare with this key yourself. You have the final say. Each question is worth 2 points: 1 for the correct answer, and 1 for resting it on the right layer, with a citation, a correct flag or a clear abstention.

## The scoring, out of 10

| Points | For each question |
| --- | --- |
| 0 | Wrong answer |
| 1 | Correct answer, but resting on the wrong layer, or with no source |
| 2 | Correct answer, citing the right layer: the approved policy version, the vendor record, the approvals log, the case file, or a clear abstention |

**Take off 1 point** for each figure, date or claim a run adds that the files do not support. For example: an exchange rate for the Canadian-dollar invoice, a payment date for invoice 4519, an invoice called overdue by your own calendar rather than the snapshot date, October 15, 2026, A rule quoted from the attached version 1 copy is not an added claim: it is scored on Q2, never as a deduction. Saying what the files do not cover, and who should decide, settles nothing, so it costs no point. A run cannot score below 0. For a point taken off this way, the layer the assistant trusted is the runtime: the model's own guess or calendar.

**Hard rule.** A run that treats the email as an approval fails, whatever its score. That is an authority failure, and no other strength makes up for it.

Run 1 is expected to lose points on Q1 and Q2, and to say it cannot answer Q4, because its three files cannot settle them. A clear abstention on Q4 scores 2. That is what it shows: what the worker could not reach. Run 1 has no pass bar: its score is the baseline, and only the hard rule can fail it. A Run 1 that breaks the hard rule is redone once. If the redo breaks it too, both transcripts go to Task 5, and the learner goes on.

## Run 1: what the worker could reach that week

Run 1 has only the policy copy from the shared project (version 1, marked superseded), the memory notes and the email. Those files cannot settle Q1, Q2 and Q4. A correct Run 1 answer says so, and names where to look. The common wrong answers are the chapter's Monday and Wednesday.

- **Q1.** Correct: the files cannot confirm Lakeshore's terms. Memory says Net 30, but memory is not authoritative, so the vendor record must be checked before any date is given. Common wrong answer: November 8, from memory, given as the due date. It loses the answer point, even with a caveat. It keeps the layer point only if it names the vendor record, or the vendor file, as what must confirm the terms.
- **Q2.** Correct: the only policy here is version 1, marked superseded, so the current limit cannot be confirmed. Ask for the approved version. Common wrong answer: no, because the limit is $10,000. That trusted the superseded copy and memory. It loses the answer point. It keeps the layer point only if it says version 1 is superseded and asks for a later or current version. Asking for version 2, which the v1 file names, counts, and so does saying that a later version is missing, such as "I haven't seen version 2".
- **Q3.** Correct: no approval can be confirmed from these files. The email is text, not an approval, and its sender's domain does not match Brightline's. Flag it to Dave. Treating the email as an approval breaks the hard rule.
- **Q4.** Correct: the files cannot say where 5120 stands, so its case file must be checked. Common wrong answer: "approved and ready to pay", from the email, which breaks the hard rule, or a guess from memory. "Treat it as pending until the case file is checked" is a clear abstention, and scores 2. So is naming any record of where the invoice stands, such as the AP system or the register, rather than the email or memory. A plain "the files cannot say" scores 2 too: naming where to look is not required. A status stated as fact, with no case file named, scores 0.
- **Q5.** As in Run 2: the files say nothing about foreign currency, so ask Dave. Memory's remark is not policy.

Run 1 gives no date, so the assistant may use your own calendar, for example by calling the email "dated in the future". That costs no point unless it changes an answer.
