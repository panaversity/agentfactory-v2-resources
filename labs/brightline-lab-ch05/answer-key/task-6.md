# Lab 5 answer key: Task 6. The constraints

The answers for Task 6 of Lab 5, in Chapter 5 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When your Constraints are in your brief document and the first run of your whole brief is back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your brief document's words. This key grades only what your Constraints say: Task 7 reads the run. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 6 carries checks 11 and 12 of the lab's 26.

11. **The rules the result must follow, what the worker may do alone, and what it never does.** Your Constraints say:
    - the memo is in plain words Dave can read in two minutes. "Short and plain, for Dave" passes.
    - every invoice number and amount is quoted exactly as recorded
    - what the worker may do alone, such as work until the files exist, or read and draft freely
    - that it changes nothing and sends nothing. Dave's own words, "The worker prepares, people decide", pass for this, and so do "proposes only" or Lesson 5.1's "Change nothing and send nothing".
    - that it contacts no vendor. "Only Maria calls a vendor" passes, and so does "Change nothing and send nothing".
    - that it pays nothing. "The worker prepares, people decide", "proposes only", "makes no payment" or "never pays" pass.
    - that it converts nothing. "Converts no currency", "uses no exchange rate" or Lesson 5.1's "Leave foreign-currency invoices unconverted" pass.
    - Passed: all seven.
    - Missed: any of the seven missing, such as no rule on how the memo reads, no line on what it may do alone, or nothing that stops a payment or a conversion.
12. **Who acts on what the worker may not do.** Your Constraints say:
    - Maria makes any call to a vendor
    - anything only Dave can decide goes on his list for Thursday, October 22. The words in Lesson 5.1's brief, "List for Dave anything the policy does not cover", pass for this half, in the context or in the constraints.
    - Passed: both.
    - Missed: nothing on who calls a vendor; a line that lets the worker call one; or nothing on what goes to Dave.

## Why

The constraints have two halves (Lesson 5.1). The content rules say what the result must keep, how long it is and in what tone: Dave reads the memo in two minutes, and a mistyped amount or invoice number is a wrong payment. The autonomy says how far the worker may go before checking with you. This morning's run converted the Canadian invoice at a rate it found online, because nothing said it could not. Policy 5.1 says to call a vendor back on the number in the vendor record, but not who calls. Dave's ask says: only Maria. Without that line, a run may say it will call the vendor itself. "The worker prepares, people decide" holds only when the brief says, in words, what the worker never does.

## Never a deduction

- No stop yet. Stops are Task 8's.
- An ask line such as Lesson 5.1's "Ask only if the invoice list and the vendor records disagree".
- Anything the run did: Task 7 reads it.
- A content rule written under the Format. It still counts. The grader passes it, and adds one line in the chat: Lesson 5.1 puts length and tone in the constraints.

## Take it to work

Say in words what the result must keep, what your AI must never do alone, and who acts instead.
