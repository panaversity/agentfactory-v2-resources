# Lab 6 answer key: Task 4. Any bill twice?

The answers for Task 4 of Lab 6, in Chapter 6 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When every item your review flagged is decided and the AI has said "Task 4 is done", attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting the review in the chat and your Review findings. You have the final say. If a check passed only after you changed a check or a decision, you still get it: fixing it is the skill this lab teaches.

## The checks

Task 4 carries checks 10 and 11 of the lab's 30.

10. **The CSV pays both copies of Buckeye's bill.** Rows 9 and 10 are Buckeye Office Supply's BO-22990 and BO-23010: the same vendor, the same amount, $389.20, and the same invoice date, Tuesday, September 29, 2026. Policy 6.1 says that makes them duplicates, and says: "Hold the later copy and tell the AP lead." Row 10, BO-23010, received by email on Thursday, October 22, 2026, is the later copy. Row 9 came by mail on Tuesday, October 20, 2026. The CSV pays both. Your Review findings hold paying row 10 as a problem, with what is right: hold row 10, BO-23010, and pay the bill once, as row 9.
    - Passed: paying both copies decided a problem, with row 10, BO-23010, held as what is right.
    - Missed: both copies paid, or called right; row 9 held instead of row 10; or both held.
11. **No other pair is a duplicate.** Scioto Pallet's SP-1214 and SP-1220 are $1,750.00 each, but they have different invoice numbers and different dates, Thursday, October 22, and Monday, October 26, 2026. Lakeshore Janitorial's 5144 and 5152 are $1,180.00 each, also with different numbers and dates. Neither pair is a duplicate under policy 6.1, and the CSV is right to treat each bill as its own.
    - Passed: no finding calls SP-1214 and SP-1220, or 5144 and 5152, a duplicate. If a review flagged either pair, you decided it right, with the different number or date as the reason.
    - Missed: either pair, or one bill in it, decided a duplicate.

**The hard rule.** Task 4 fails, whatever else passes, if your Review findings accept that both Buckeye copies, rows 9 and 10, are paid: paying both called right, or not held as a problem when the task ends.

## Why

A duplicate is what the policy's test says, not what looks alike. Policy 6.1 has two tests: the same vendor and invoice number, or the same vendor, amount and invoice date. Buckeye's two rows pass the second test. They are one bill, sent twice, once by mail and once by email, under two numbers. A check of only the invoice number misses it. A check of only the vendor and the amount flags Scioto's and Lakeshore's pairs too, and those are different bills. This is accuracy: trace each row back to the source and the policy (Lesson 6.2). The memo says row 10 is held. The CSV, which the system pays from, pays it.

## Never a deduction

- "Repeated" or "files disagree" as the kind for Buckeye.
- Telling the AP lead, named or not.
- Other items a review flagged in this task, such as row 5's due date, and how you decided them. Later tasks grade them.

## Take it to work

Test a bill against your policy's own rule for a duplicate, not against what looks alike.
