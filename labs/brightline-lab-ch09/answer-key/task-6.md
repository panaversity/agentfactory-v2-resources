# Lab 9 answer key: Task 6. One email at a time

The answers for Task 6 of Lab 9, in Chapter 9 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the invoice email check's standing spec is in your Role Contract, and both tests, `Test: Lakeshore's 5155, November 18` and `Test: The same email twice`, are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your Role Contract's lines and the tests' replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 6 carries checks 13 and 14 of the lab's 27.

13. **The email check's standing spec.** Under Triggers, it says:
    - Inputs: the email, and the accounting system's invoice register, the invoices already received.
    - A copy: the run flags it to Maria, with both times it was received, and Maria sets any hold. The run never sets the hold itself.
    - Twice: before it logs or flags anything, the run checks whether its log line or flag already exists; and the email check runs one email at a time, or writes through a record that accepts each action once.
    - Passed: all three.
    - Missed: the email as the only input; the run setting the hold; or no check for its own earlier output.
14. **The tests.**
    - "Lakeshore's 5155, November 18": 5155 is flagged as a copy of the 5155 received November 4 and paid November 13, and not logged as a new invoice to pay.
    - "The same email twice": one flag and one log line at the end, because the second run finds the first run's output, or waits until the first has finished.
    - Passed: both.
    - Missed: either otherwise.
    - **Hard rule:** in "Lakeshore's 5155, November 18", the copy logged as a new invoice to pay fails this check, whatever else passes.

## Why

An event-triggered run starts from the event (Lesson 9.3). The email job saw one email, so it could not see that 5155 had arrived on November 4. A run sees only what it is given: if the check needs earlier invoices, the spec must tell it to read them. A copy is flagged to the AP lead, who decides the hold, because a flag is the worker's to raise and the hold is a person's to set.

A trigger can fire twice. One email can start two runs, and both can read "not done yet" before either writes. So the run checks whether its output already exists, and runs one at a time, or writes through a record that takes each action once. Then twice does no harm.

## Never a deduction

- The register named as "the invoice list" or "the accounting system's invoices".
- The flag also going to Dave.
- A spec that also compares the amount and date, as the duplicate concept allows.
- A test that says a person would see both flags and delete one, when it also gives the run's own check.
- A remark about the lab's dates.

## Take it to work

When your job starts, does it see one email, or everything it needs to check?
