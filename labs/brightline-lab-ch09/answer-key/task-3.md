# Lab 9 answer key: Task 3. What every run is given

The answers for Task 3 of Lab 9, in Chapter 9 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the Thursday review's standing spec is in your Role Contract, and both tests, `Test: Thursday, November 19` and `Test: The record is missing`, are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your Role Contract's lines and the tests' replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 3 carries checks 7 and 8 of the lab's 27.

7. **The standing spec names what a fresh run needs.** Under Triggers, the Thursday review's standing spec says:
   - Job: it drafts the pre-run note for Dave, and never approves.
   - When: every Thursday at 7:00 a.m., with its time zone, such as Eastern time.
   - Inputs: the register export dated that Thursday, the AP matters record as it stood that morning, and the approved version of the five AP concepts. Nothing else: not Maria's chat, last week's note, the worker's memory, Dave's email, the AP inbox or the scans.
   - If an input is missing or not dated that morning: the run stops, writes no note, and tells a named person which file.
   - The note: its parts; held invoices and copies kept apart from the invoices to pay; and a named place to save it that is not #ap-help or Dave's inbox.
   - Each thing the AI listed as left to guess is fixed in the spec, or left with a reason in the chat.
   - Passed: all six.
   - Missed: any input other than those three; the AP matters record left out; no time zone; a missing input that does not stop the run; a held invoice or a copy among the invoices to pay; the note saved to #ap-help or sent straight to Dave; or a listed item with neither a fix nor a reason.
8. **The tests.**
   - "Thursday, November 19": 5207, Tri-County Freight, $3,110.00, is held, not paid on Friday. The test quotes the Inputs line that names the AP matters record, and the bank-detail concept's hold.
   - "The record is missing": the run stops, names the missing record, writes no note, and lists nothing as payable.
   - Passed: both.
   - Missed: either otherwise.
   - **Hard rule:** 5207 among the invoices to pay in "Thursday, November 19" fails this check, whatever else passes.

## Why

A run that starts fresh cannot ask what you meant (Lesson 9.3). Everything it needs has to be in its standing spec: the job, the time, and every input with its date, because a run sees only what it is given. Maria's three sentences named the register and the concepts, so the run never saw the record, and it told Dave to pay 5207. With the record named as an input, the same Thursday holds 5207 under policy 5.3.

A designed exit is where the run stops and calls a named person. A missing or wrongly dated input is one: a run that writes a note without the record would look complete, and be the November 19 note again. And the note goes to a place where a person reviews it first, never to the channel or straight to Dave.

## Never a deduction

- The words of a line, when its meaning is clear.
- The time zone written as "Columbus time" or "ET".
- The note's parts in another order, or with more parts, such as questions for Maria.
- Held invoices and copies listed under their own headings, or on the list marked as held, when none is to be paid.
- The notes folder or the drafts folder as the note's place.
- A test that says Maria should also be told about M-031.
- A test that mentions the second copy of 5155.
- A remark about the lab's dates.

## Take it to work

Could your recurring job get it right with only what its instructions name?
