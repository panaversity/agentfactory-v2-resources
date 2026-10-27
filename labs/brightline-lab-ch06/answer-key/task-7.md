# Lab 6 answer key: Task 7. Do the files agree?

The answers for Task 7 of Lab 6, in Chapter 6 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When every item your review flagged is decided and the AI has said "Task 7 is done", attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting the review in the chat and your Review findings. You have the final say. If a check passed only after you changed a check or a decision, you still get it: fixing it is the skill this lab teaches.

## The checks

Task 7 carries checks 17 to 19 of the lab's 30.

17. **The memo does not tie out to its own CSV.** The memo's headline says "Pay on Friday: $22,010.80 across 10 invoices." The CSV's 10 PAY rows add up to $22,100.80. They are $90.00 apart. Neither is the figure Dave signs, which comes from the sources.
    - Passed: the difference between the memo's $22,010.80 and the CSV's $22,100.80 decided a problem, in this task or in an earlier one, with "none is" right, or with the figure from the sources as what is right.
    - Missed: the difference not found; found and called right; or the memo's figure or the CSV's called the right one.
18. **Buckeye: the memo holds row 10, and the CSV pays it.** The memo's Exceptions say of BO-23010, row 10, "The later copy is held (policy 6.1)." The note to Maria says "Hold the Buckeye duplicate, BO-23010." The CSV, the file the system pays from, marks row 10 PAY. The memo and the note are right, and the CSV is wrong, by policy 6.1.
    - Passed: the difference decided, with the memo and the note right and the CSV wrong, by policy 6.1.
    - Missed: the difference not found; or the CSV called right.
19. **The note tells Maria to hold all three Tri-County invoices, and the note is wrong.** The note's first line says "Hold all three Tri-County invoices until the bank change is verified." The CSV and the memo pay them, which is right: Maria's call on Thursday, October 22, 2026, recorded in the vendor file notes, verified Tri-County's bank details under policy 5.1.
    - Passed: the difference decided, with the CSV and the memo right and the note wrong, by the vendor file note of October 22.
    - Missed: the difference not found; or the note called right, or Tri-County held.

## Why

The same figure must agree everywhere it appears (Lesson 6.4), and the same fact must be the same in every version (Lesson 6.6). Compare the facts, not the wording: amounts, counts, decisions and names. Each file has its reader. The system pays from the CSV, so its mistake costs money: Buckeye's bill paid twice. Dave approves from the memo, so its headline must match the file, and here it matches neither the file nor the sources. Maria acts on her note, so its mistake stops payments: three valid Tri-County invoices held. When two versions disagree, at least one is wrong, so find the source that decides it. When they agree, keep checking: both can repeat the same mistake.

## Never a deduction

- Other differences found, such as the memo's counts adding to 16.
- "Files disagree" or "a wrong number" as the kind.
- The memo's not-due total of $4,370.00, found or not.
- Which of the three files you name first.

## Take it to work

When one result goes to several readers, line up each fact in every version, and fix the version a system acts on.
