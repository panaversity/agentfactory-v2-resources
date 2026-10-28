# Lab 11 answer key: Task 9. The discounts

The answers for Task 9 of Lab 11, in Chapter 11 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the Inspect and the test are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 9 carries checks 31 to 33 of the lab's 47.

31. **One kind of error: capacity, the wrong feature.** One repeated kind of error: small amounts, each different, while the rate and the invoice amounts are right. The cause is capacity, the wrong feature: arithmetic written in sentences.
    - Passed: one kind, and capacity or the wrong feature.
    - Missed: many kinds; or another cause only.
32. **The check, and what it showed.** The check runs the calculation as code, or in a spreadsheet. The Inspect gave a "Compared:" line for each of the eight invoices. Five discounts are wrong: 5134 is $124.31, 5186 is $34.85, 5237 is $413.00, 5254 is $182.55 and 5288 is $48.00. Three are right: 5151 ($77.60), 5271 ($10.26) and 5305 ($280.11).
    - Passed: a calculation as code, and the Inspect's eight lines, with these figures.
    - Missed: a check by eye; a wrong figure; or a right discount called wrong.
33. **Your line, and the test.** Your line makes each discount and each amount to pay a calculation, such as code, never sentences. `Test: the early-payment list` gives all eight discounts right, with the amounts to pay ($6,091.09, $3,802.55, $1,707.75, $20,237.00, $8,944.80, $502.54, $2,351.99 and $13,725.44), and quotes your line as how they were worked out.
    - Passed: your line, all eight right, and your line quoted.
    - Missed: no line; a figure wrong; or "no line decides" how they were worked out.

## Why

"When one kind of error repeats, that suggests the wrong feature" (Lesson 11.3). The rate is 2 percent every time, and the invoice amounts are right, yet the results are off by a few cents to $41.30. So the arithmetic is the place, and the cheapest check is the arithmetic itself, run as code. That check is also the fix: a line that makes the worker calculate, not write the sums out.

The three right discounts matter too. A check that finds nothing wrong for an item still says what it compared, so you can see it was checked.

## Never a deduction

- The brief named as a second cause, because it asked for working shown in the note.
- Amounts to pay shown in the Inspect, or not.
- "In a spreadsheet" for "as code".
- Rounding shown, or not.

## Take it to work

Which numbers does your AI work out in sentences?
