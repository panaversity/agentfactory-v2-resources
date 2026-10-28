# Lab 9 answer key: Task 4. Read the record first

The answers for Task 4 of Lab 9, in Chapter 9 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the record's rules are in your Role Contract, `Run: Thursday, November 12` is back, and you have answered the one-minute check, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your Role Contract's lines and the run's reply in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 4 carries checks 9 and 10 of the lab's 27.

9. **The record's rules.** "The AP matters record's rules", under Case files, say:
   - A run reads the open matters, or the matters for the vendors on its list, before it lists the invoices.
   - The register says what is true now. The record is the latest known.
   - Each run ends by proposing entries, with the origin "inferred". Maria checks them and adds the ones she keeps.
   - The runtime decides when the next run happens, not the record.
   - And the standing spec has the record's first step at its start and its last step at its end.
   - Passed: all five.
   - Missed: the record read after the list; the record as what is true now; run entries with another origin, or added by the run itself; the record deciding when a run happens; or a step missing from the spec.
10. **November 12, a week whose answer you know.** The run's note, against what Brightline paid on Friday, November 13, 2026:
    - On the list: BO-23188, OVJ-311, BO-23190, NMP-3480, 5188 and 5155. Not NMP-3486 (due November 25) or GLE-88 (due November 27).
    - Holds: none. "What decided it" says no invoice is held, with what it compared. OVJ-311 is not held for Ohio Valley's address request, M-029: the bank-detail concept holds payments only for a bank-detail change, and an address is not one.
    - Copies: none. "What decided it" says so, with what it compared.
    - Record entries proposed, each "inferred".
    - "What decided it" gives a line of your contract for the list, the holds and the copies.
    - And you did the one-minute check on the list, in the chat.
    - Passed: all six.
    - Missed: any of them otherwise; or no hold or copy decision written, so nothing shows it was checked.
    - **Hard rules.** This check fails, whatever else passes, if the run calls an invoice approved without the register showing it, says it contacted a vendor or changed a record, or states a payment the register does not show.

## Why

A run that starts with no memory learns what earlier runs found from records it reads first, never from a chat (Lesson 9.4). It opens the matters before it does anything. It treats the record as the latest known, not the truth now: current status comes from the system that holds it. It ends by proposing what it found, as "inferred", because a model's flag is not an observation, and a person checks the entries and adds them. And the record remembers that a callback is pending, but the runtime runs the clock.

November 12 is a past week whose answer Maria knows: an example with a known answer (Lesson 9.3). The run reads Ohio Valley's open request and holds nothing for it, because a new mailing address is not a bank detail. A note that held OVJ-311 would have invented a rule.

## Never a deduction

- The totals, and how the note shows Canadian dollars.
- Which invoices the note marks as needing Dave's approval.
- A note that also mentions Tri-County's email of November 2 about 5149, which is reported, not observed.
- The note's layout, its order, or a short summary.
- A run entry that opens a new matter for the November 13 run, under any number.
- A remark that the run's date is in the past or the future.

## Take it to work

Where does your recurring job read what happened last week?
