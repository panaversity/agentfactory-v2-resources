# Lab 8 answer key: Task 6. Standing instructions

The answers for Task 6 of Lab 8, in Chapter 8 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When your instructions are under "Instructions" in the "AP Worker project" document, and all three tests are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the tests' replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 6 carries checks 14 to 16 of the lab's 40.

14. **Instructions that answer all six questions**, in your own words, under Dave's line and Maria's working rule, which are both still there:
    - role: what the worker is, and for whom
    - what counts: Brightline policy comes only from the stable concepts, and not from memory, other files or general knowledge
    - cite: every policy claim names its concept and that concept's approval date
    - abstain: when the concepts do not cover a question, it says so and names who decides, Dave, and does not fill the gap
    - state: it never states whether an invoice is paid, held or due as current, and it points to the accounting system or to Maria
    - conflicts: when memory, a note or a file disagrees with a concept, the concept wins, and the answer says there was a conflict
    - Passed: all six, and both earlier lines kept.
    - Missed: a part missing; a cite line with no approval date; an abstain line that names no one; a line that copies a rule's number or words, such as "$5,000", instead of pointing to the concept; or Dave's line or the working rule gone.
15. **`Test: the $10,000 note`.** Midwest's invoice 4590, $6,920.00, needs Dave's approval: it is over $5,000.00. The test names the threshold concept and its approval of Wednesday, November 4, 2026. Under "the line that decides it", it quotes your conflicts line, or your line on what counts, so the concept wins over the note's $10,000.
    - **The hard rule.** A test that accepts $10,000, or that invents a rule the concepts do not hold, fails this check, whatever else it gets right.
    - Passed: all of that, and the hard rule holds.
    - Missed: "no line decides"; no concept or approval date named; or the hard rule broken.
16. **`Test: next year` and `Test: the credit card`.** Each says the concepts do not cover it, and that Dave decides. Neither gives a threshold for next year, or a rule about card payments.
    - **The hard rule.** A test that invents a rule the concepts do not hold fails this check, whatever else it gets right.
    - Passed: both abstain and name Dave, and the hard rule holds.
    - Missed: a guess at next year's threshold, such as $10,000; a yes or no on card payments; or no one named.

## Why

Project instructions load with every conversation, so they are where you tell the worker what counts (Lesson 8.5). Good ones say six things: its role, what counts as authority, how to cite, when to abstain, what it must never state as current, and what wins in a conflict. They point to the concepts and never repeat them, so the policy is kept in one place. Point to the concepts by what they are, not by a file's name: the file is replaced each time Dave approves a change.

Question 1 pushes a memory-style claim at the worker. Only a conflicts line makes the concept win out loud. Questions 8 and 10 have no answer in the concepts, and the right answer is to say so: abstention is a feature, not a failure (Lesson 8.6).

## Never a deduction

- Your own words, and their order, when all six parts are there.
- Instructions a little over or under the word count.
- Naming Maria as well as Dave, for who decides.
- Instructions that name the concepts' file, such as ap-concepts-approved-2026-11-04.md. Task 10 shows why that is fragile.
- A state line that also says how to use a case file's latest-known line.
- A test that adds that the matter waits for Dave: that is not a new rule.
- A test that says the $10,000 is not in the project, rather than calling it a conflict, when it quotes your line.
- A remark about the lab's dates.

## Take it to work

What must your instructions make the AI refuse, and does a test show it refusing?
