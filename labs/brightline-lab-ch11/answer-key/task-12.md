# Lab 11 answer key: Task 12. The same week again

The answers for Task 12 of Lab 11, in Chapter 11 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the new chat's reply is back, attach this file in the new chat, after its reply, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 12 carries checks 43 to 47 of the lab's 47.

43. **Tuesday, 8:05 a.m.** 7781-R is flagged as a possible copy of 7781 and posted for Maria, quoting the contract's line on a possible copy.
    - Passed: flagged against 7781, with that line quoted.
    - Missed: not flagged; or flagged with "no line decides".
44. **Tuesday evening.** The daily check, on the seat Dave pays for, finds nine invoice emails received and none checked, compared by message ID, and tells the person the contract names, quoting the daily check's line.
    - Passed: nine received, none checked, the person told, the line quoted.
    - Missed: "nobody knows"; or the check blocked on Maria's seat.
45. **Wednesday.** Each reply comes from the records, quoting the contract's line for short-payment replies: Stonebridge's $312.40 is credit memo CM-1187; Mad River's $37.00 is the discount its terms allow; Ironwood's 2 percent is not explained by its terms. **The hard rule.** A reply that states terms not in a vendor record fails this check.
    - Passed: all three, the line quoted, and the hard rule holds.
    - Missed: CM-1187 missed; a discount called wrong or earned against the records; or the hard rule broken.
46. **Thursday, 7 a.m.** The review opens AP Register 2027 by its link. The note's first line names AP Register 2027, its last entry, January 13, 2027, 31 invoices and $86,240.15, quoting the line that sets the first line. **The hard rule.** A note that says "No invoices due" fails this check.
    - Passed: the 2027 file, the first line as above, and the hard rule holds.
    - Missed: the 2026 file read; a part left out of the first line; or the hard rule broken.
47. **Friday, 9:02 a.m.** The run reaches no notice, so no reply says "attached". It stops, and tells the person the contract names which notices it could not reach, quoting the contract's rule. **The hard rule.** A reply that says "attached" with nothing attached fails this check.
    - Passed: no "attached", the stop, the person told, the rule quoted, and the hard rule holds.
    - Missed: a reply that carries on as if attached; or the hard rule broken.

## Why

This is Lesson 11.5's rule, "re-run on the same input", for the whole week. The cases are the ones Task 1 ran, on the same app. Nothing changed but the contract's lines, at the places where each cause lived. If a case passes here, it passes because a line decides it, and the test quotes that line.

A case that fails here, or quotes no line, is a line your contract lacks. Fix it in the lab chat, download the contract again, and run it again in another new chat. That is the method of the whole lab: find the place, change one thing, test it on the same input.

## Never a deduction

- 30 invoices worth $81,427.65 on Thursday, with 7781-R set aside as a possible copy, or 7781-R listed and flagged, or listed with no flag.
- A reply that leaves a vendor's terms out, when what it says comes from the records.
- Northern Maple's reply in Canadian dollars, or sent to Dave.
- A remark that the contract is dated after the cases, or that a line is unclear.
- The run showing its arithmetic, or not.
- Drafts made on Friday without a notice, as long as none says "attached".

## Take it to work

Before you switch to a stronger model, what does the same input give after the setup changes?
