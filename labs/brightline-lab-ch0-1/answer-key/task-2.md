# Lab 0.1 answer key: Task 2. What it cannot see, and what a tool can

The answers for Task 2 of Lab 0.1, in Chapter 0.1 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When you have decided the rows for Runs 4 and 5, and your AI field notes are made, attach this file in your lab conversation, and send the lab's check prompt. The AI marks each check Passed or Missed against this key. Read the key yourself too: you have the final say.

## What the rows are judged against

- The word "strawberry" has 3 r's.
- Line 4.1, "Invoices over $5,000.00 need the controller's approval before payment.", has 5 r's: one in "over", two in "controller's", one in "approval" and one in "before".
- If your own counts were different, these counts decide right or wrong.
- The model reads tokens, which are pieces of words, not letters. The letters of a word are in the window only when they are written out, by you, by the model's working, or by a tool.

## The checks

Task 2 carries checks 7 to 12 of the lab's 12.

7. **The counts and the note are judged.** Passed when the rows for questions 1 and 2 say right or wrong, as the counts above decide, and the row for question 4 says sendable or not. Missed when a count has no right or wrong, or the note has no decision.
8. **A bare count came from training.** Questions 1 and 2 asked for the number only, so the model did not write the letters out. Only the tokens were in the window, so each count came from training, right or wrong. If the reply's thinking spelled the letters out first, and you pasted that thinking, the count came from the window, and a row that says so passes too. Passed when the rows for questions 1 and 2 say training, or say the window and the paste shows the letters written out. Missed when a count is called the window with no letters written out in the paste.
9. **Written-out working came from the window.** Question 3 wrote the line out one letter at a time, so the letters were in the window when the model counted them again. Nothing checked that working, so it can still be wrong. Passed when the row for question 3 says the window, with right or wrong as the counts above decide. Missed when it says training.
10. **Code shown is not code run.** When a tool ran, the code's result came back into the window. When the reply only printed code and a result, with no sign that the code ran, the result was predicted, from training. Passed when Run 5's row says a tool ran and the window, or code only and training, as the app showed. The reply's own words, such as "I ran the code", are not a sign. If the paste does not show which, the AI asks you what the app showed. Missed when code only is called a tool run, or a tool run is called training. Right or wrong never decides this check.
11. **The field notes have nine rows, in order.** Passed when your AI field notes hold the nine ideas in the order the brief gave, and each row names a run from your log, with the source your log recorded, or says "none" with a reason. Missed when an idea is missing, a row names a run your log does not have, or a row's source is not the one in your log.
12. **Each run fits its idea.** The table shows the runs that fit. Passed when at least eight of the nine rows fit, or say "none" with a reason that is true. Missed when two or more rows do not fit.

| Idea | A run that fits |
| --- | --- |
| 1. Prediction, not lookup | Run 1, or Run 3's first reply: a reply with nothing in the window to look up. A reply that gives no answer fits too, because it is still predicted text |
| 2. Trained once, then frozen | Run 3's first reply: Run 2 changed nothing inside the model |
| 3. No truth-checker | An invented document or a wrong fact, stated as fact, such as in Run 1 or Run 4 |
| 4. Tokens | Run 4's bare counts, questions 1 and 2 |
| 5. The context window | Run 2, or Run 3's second reply |
| 6. Confidence as style, and sycophancy | Run 2's push back, or a sure guess in Run 1 or Run 3 |
| 7. The jagged frontier | Run 4: the counts beside the note |
| 8. Tools and the loop | Run 5, when a tool ran. When no tool ran, "none", or Run 5 with the reason that no tool ran, fits |
| 9. "Thinking" | Run 4's question 3, or a reply's thinking |

## Never a deduction

- A right bare count. Some models count right without writing the letters out, and the row still says training.
- How good the note is, beyond sendable or not.
- A reply that says it cannot count letters without code.
- Claude's thinking, which cannot be turned off. When it shows the letters written out, the count came from the window.
- Doing the lab on one AI vendor only.
- The field notes' wording, when each row names its run and its source.
