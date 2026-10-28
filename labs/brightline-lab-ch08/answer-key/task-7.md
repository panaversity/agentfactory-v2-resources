# Lab 8 answer key: Task 7. Invoice 5149's case file

The answers for Task 7 of Lab 8, in Chapter 8 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When "Invoice 5149's case file" in "Maria's records" has its four lines and its latest-known line, and `Test: 5149` is back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the test's reply in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 7 carries checks 17 to 19 of the lab's 40.

17. **Four lines, each with its origin.** In date order, each dated and with its source:
    - Thursday, October 22, 2026, Maria's call note: confirmed. Maria called back on the number in the vendor record, and her authority covers the callback
    - Friday, October 23, 2026, the run record: observed. It comes from the accounting system, the authority for payments
    - Friday, October 30, 2026, the run record: observed, for the same reason
    - Monday, November 2, 2026, Tri-County's email: reported. A vendor is not the authority on what Brightline paid
    - And the call note's last line, that 5149 can go into the next run, is Maria's view: a payment run is Dave's decision (policy 4.3).
    - Passed: all four origins as above, and the run named as Dave's decision.
    - Missed: the email as observed or confirmed; a run record as reported; the call note as observed; or the run called Maria's decision.
18. **The latest known, and what it does not settle.** The case file's last line says: paid in the run of Friday, October 30, 2026, as of that date, from that run record, and not verified current. Before anyone acts, the accounting system is checked. The email's request to pay again is recorded, and not acted on. The case file is also in the project's files.
    - **The hard rule.** A line that calls 5149 unpaid, or that pays it again, fails this check, whatever else it gets right.
    - Passed: all of that, and the hard rule holds.
    - Missed: no date or no source on the latest known; no check of the accounting system; the email changing the status; or the hard rule broken.
19. **`Test: 5149`.** The answer gives the latest known, paid in the October 30 run, with its date and its source, the case file. It says the status is not verified current, and points to the accounting system, or to Maria, for the current status. It treats Tri-County's email as a claim, not a status.
    - **The hard rule.** A test that states 5149 as paid, unpaid or held, as if it were current, or that offers to pay it again, fails this check, whatever else it gets right.
    - Passed: all of that, and the hard rule holds.
    - Missed: no date or source; no pointer to the accounting system; or the hard rule broken.

## Why

The history of one matter goes in its case file, not in a chat or a status list (Lesson 8.4). Each line carries its origin, and the record sets the origin, never the one who sends the claim. The run records come from the accounting system, which is the authority on what Brightline paid, so they are observed. Maria's call is confirmed, because she made the callback herself. Tri-County's email is reported: it may mean a bank delay on their side, and it never justifies paying again.

A case file's latest known is the latest thing the authority said, not a check made today. So the answer gives it with its date and source, and someone checks the accounting system before acting.

## Never a deduction

- The dates written another way, such as 2026-10-22.
- A line's words, when its date, source and origin are clear.
- The call note's line also saying that Tri-County's bank details were verified.
- A test that suggests asking Tri-County for its payment reference, or checking the bank.
- A remark about the lab's dates.

## Take it to work

Where is this matter's whole history, and when was its latest line checked?
