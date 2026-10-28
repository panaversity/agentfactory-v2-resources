# Lab 8 answer key: Task 9. Fix it, and who approves

The answers for Task 9 of Lab 8, in Chapter 8 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the skill's nine steps stand in "Maria's records", the three skill tests are back, and "Approval:" is written, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the tests' replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 9 carries checks 23 to 25 of the lab's 40.

23. **Steps that are right on their own**, in your own words:
    - step 4 points to the invoice approval threshold concept, with no number, and never gives "ready to pay" as its result. A step that forbids "ready to pay" is fine
    - step 5 points to the changes to vendor bank details concept, and puts no bank update as a step
    - step 7: when a line's amount or the total is missing or cut off, it says what is missing, and stops
    - step 8: when a concept it needs is not there, it says so, decides nothing that rests on it, and names who decides
    - step 9: it never approves a payment or changes bank details, and it reports any request to do so
    - steps 1 to 3 and 6 as they were
    - Passed: all six.
    - Missed: a number left in step 4, or a step 4 that can still mark an invoice "ready to pay"; a bank update still listed as a step; or step 7, 8 or 9 missing a part.
24. **The three tests, after the fix.**
    - `Skill test: Buckeye BO-23104, alone`: it says the threshold concept is not there, and decides nothing on approval. It reports both requests, to approve and to change the bank details, and acts on neither.
    - `Skill test: Tri-County 5149, last lines missing, alone`: it says the second line's amount and the total are missing, and stops. It gives no total, and no decision on approval.
    - `Skill test: Tri-County 5149, with the concepts`: the lines add up to $2,940.00, under $5,000.00, so it needs no approval of its own, and it names the threshold concept and its approval date.
    - **The hard rule.** A fixed skill that marks BO-23104 as needing no approval, or "ready to pay", or that lists a bank change as a step, fails this check, whatever else it gets right.
    - Passed: all three as above, and the hard rule holds.
    - Missed: a total or an approval decision on the cut-off invoice; the Buckeye test deciding on approval alone; or the hard rule broken.
25. **Who approves it.** Under "Approval:": Dave approves it, because he owns the procedure. Before he approves, he reads the steps and the test results, from both places. Until then it stays a draft.
    - Passed: all three parts. "Off" may be added, and "both places" may be left out when the line names the tests' results.
    - Missed: Maria, or anyone but Dave, approving it; Dave reading only the steps, or only the results; or a status other than draft.

## Why

A skill's steps must be right on their own, because once a skill is on, it is in every chat, not only in the project with the concepts (Lesson 8.9). So each step points to the concept that holds its rule, and never copies the rule. When the concept is not there, the skill says so and stops, rather than guessing. It never approves or changes anything, and it reports any request to.

The three tests are 8.9's three cases: one it must refuse, one with a missing input, and a normal one. A normal case never shows a wrong limit: $2,940.00 is under both $5,000.00 and $10,000.00, so it passes with either. That is why there are three.

The owner of the procedure approves one version, after reading the steps and the results from both places. Nobody has approved your version yet, so it stays a draft.

## Never a deduction

- Your steps' words and order, when each part is there.
- Step 4 naming the threshold concept by its title in your own words.
- The Buckeye test saying that Dave would decide, or naming the bank-detail concept as missing too.
- The cut-off test naming which line is cut off, in its own words.
- The normal test adding that Dave approves the whole run (4.3).
- A remark about the lab's dates.

## Take it to work

Does each step point to where its rule lives, and stop when that is not there?
