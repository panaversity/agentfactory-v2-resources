# Lab 3 answer key: Task 6. Write the setup once, for runs nobody watches

The answers for Task 6 of Lab 3, in Chapter 3 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Use it when the GUIDE says "Task 6 is done". Attach this file in your lab chat, type `Check` and send it. The AI marks each check Passed or Missed. It quotes Job C's setup and Kept as tests in your notebook, and your words and the WORKER's dry runs in the chat. If you think a mark is wrong, the final decision is yours, not the AI's. Missed a check? Read "Why", below, and tell the GUIDE the change, in a few words. If the check reads a dry run, the GUIDE first shows you the line that asks for it again. Then send the line the GUIDE shows: `Check again`. If a check passed only after you changed a line, it still counts as Passed. Fixing the line is the skill this lab teaches.

## The checks

Task 6 carries checks 13 to 16 of the lab's 24.

13. **Your three Job A lines, rewritten for runs nobody watches** (Lesson 3.2, "When the worker runs day and night", and Lesson 3.3, "When nobody is watching"). Job C's setup is written once, for every Monday at 7 a.m. It says all three things below, in any words, under any part:
    - **The period, as a rule:** each run works out its own week from its own date. The week is the Monday-to-Sunday week before the run.
    - **What the worker may do, inside Little Wick's rule:** the rule for every AI tool says it may read the orders and save files in the shared folder. It never changes an order or contacts a customer. Your authority allows no more than that.
    - **What happens instead of asking:** your answer to question 4 names a case the worker can see, and says what the worker does then, without waiting for anyone. For example: it writes a flag in the report, or a note saved with it, or it leaves an item in the approval queue, and goes on.
    - Passed: all three. "Last week, Monday to Sunday" passes. So does "last week", with "A week is Monday to Sunday" anywhere in your setup. A start date beside the rule is fine, such as "The first run is Monday, October 12, 2026". An authority that lets the worker save only the report is narrower than the rule, and passes.
    - Missed: the period as fixed dates, such as "September 28 to October 4, 2026"; today fixed to one date, such as "Today is Wednesday, October 7, 2026"; "last week" or "the last seven days" with nothing that says Monday to Sunday; an authority that allows more than the rule, such as refunds or emails; "stop and ask Sana", or a stop that waits for an answer; or no answer to question 4.
14. **You chose a dry run, and ran it on a week whose answer you know** (Lesson 3.2, "How to choose" and "Three things you can question").
    - **The choice:** under "What I question first, and why", your lines name a dry run, with a reason. The reason says that the work runs alone, every week, or with nobody watching; that a mistake would be costly; that it shows how the worker copes with real data; or that you can compare the result with a known answer.
    - **The week:** your last dry run covers Sana's week, Monday, September 28 to Sunday, October 4, 2026. She counted that week by hand, so its answer is known. With the Monday-to-Sunday rule, that is a dry run as of any day from Monday, October 5 to Sunday, October 11, 2026.
    - Passed: both. A plan or a sample before the dry run passes.
    - Missed: no dry run in your lines; a dry run with no reason, or with a reason that names no risk, such as "it is the best"; or a last dry run with no date, or for another week.
15. **The fact behind the difference is in your setup** (Lesson 3.2, Step 4, "Fix the specification, not just the conversation"). Sana's note says J. Reed is Jo, and Jo's orders are tests, never sales. A dry run of Sana's week that counts them shows 33 orders and $1,548.00, not her 31 orders and $1,486.00. Job C's setup now has a line that says J. Reed's orders are not counted as sales.
    - Passed: the line names J. Reed, so the worker can find those orders every week. It sits under any part the worker works from: Intent, Scope, Authority, Review contract, Knowledge, or Inputs and tools.
    - Missed: the fact said only in the chat; the line only under Kept as tests, which the worker never follows; a line that names only this week's orders, 2178 and 2196; or "test orders are not sales", with nothing that says which orders they are.
16. **The dry run now matches Sana's numbers, and her week is kept as a test** (Lesson 3.2, "Example 3: questioning a dry run").
    - **The numbers:** your last dry run covers Monday, September 28 to Sunday, October 4, 2026, and shows 31 orders and $1,486.00. Find yours in "Find your numbers", below.
    - **The test:** under Job C's Kept as tests, a line keeps Sana's week with its known answer: the week, or "Sana's week", with her numbers or her report as the answer.
    - Passed: both.
    - Missed: other numbers on your last dry run; no line for Sana's week under Kept as tests; or the week kept only under another part, such as the knowledge.

## Find your numbers

Look for the numbers your dry run gave: the orders and the sales. A first dry run may give any of them. A difference is what a dry run is for: it shows you what to fix. Check 16 reads only your last dry run. Only paid orders count, unless a row says otherwise. Both numbers must match Sana's: 31 orders and $1,486.00.

| Your numbers | Dry run as of | What the worker did | On your last dry run |
| --- | --- | --- | --- |
| 31 orders, $1,486.00 | Any day from Monday, October 5 to Sunday, October 11, 2026 | Took the Monday-to-Sunday week before: Monday, September 28 to Sunday, October 4, 2026. Left out J. Reed's two orders. | Passed. These are Sana's numbers. |
| 33 orders, $1,548.00 | Any day from Monday, October 5 to Sunday, October 11, 2026 | The same week, with J. Reed's two orders counted as sales: 2178 ($38.00) and 2196 ($24.00). | Missed. They are Jo's tests, never sales. |
| 32 orders, $1,558.00 | Any day from Monday, October 5 to Sunday, October 11, 2026 | The same week, with J. Reed's orders left out, but cancelled order 2189 ($72.00) counted. | Missed. A cancelled order is not a sale. |
| 34 orders, $1,620.00 | Any day from Monday, October 5 to Sunday, October 11, 2026 | The same week, with J. Reed's two orders and cancelled order 2189 counted. | Missed. |
| 0 orders, $0.00 | No date: today's real date, Thursday, October 29, 2026 or later | Took the week before today's real date. The orders file ends on Monday, October 5, 2026, so it found no orders. | Missed. A first dry run with no date is never a deduction. |
| 2 orders, $100.00 | Any day from Monday, October 12 to Sunday, October 18, 2026 | Took the week of Monday, October 5 to Sunday, October 11, 2026: only orders 2206 and 2207. | Missed. That date gives the week after Sana's. |
| 25 orders, $1,150.00, or 26 orders, $1,198.00 with cancelled order 2160 | Any day from Monday, September 28 to Sunday, October 4, 2026 | Took the week of Monday, September 21 to Sunday, September 27, 2026. J. Reed has no order in it. | Missed. That date gives the week before Sana's. |
| 34 orders, $1,606.00, or 32 orders, $1,544.00 without J. Reed's | Monday, October 5, 2026 | "The last seven days", read as the 168 hours before 7 a.m., from 7 a.m. on Monday, September 28. It left out order 2172 (6:20 a.m. that Monday, $42.00). It counted orders 2206 and 2207 (before 7 a.m. on Monday, October 5, $100.00). | Missed. |
| 33 orders, $1,548.00, or 31 orders, $1,486.00 without J. Reed's | Monday, October 5, 2026 | "The last seven days", read as the seven whole days before: Monday, September 28 to Sunday, October 4, 2026. | 31 orders, $1,486.00: Passed. 33 orders, $1,548.00: Missed. Check 13 still asks your rule to say Monday to Sunday. |
| 31 orders, $1,478.00, or 29 orders, $1,416.00 without J. Reed's | Tuesday, October 6, 2026 | "The last seven days". Read either way, as the 168 hours before 7 a.m. or as the seven whole days before, it counts the orders from Tuesday, September 29 to Monday, October 5, 2026. | Missed. |
| 27 orders, $1,326.00, or 26 orders, $1,302.00 without J. Reed's | Wednesday, October 7, 2026 | "The last seven days", read either way: Wednesday, September 30 to Tuesday, October 6, 2026. | Missed. |
| 23 orders, $1,134.00, or 22 orders, $1,110.00 without J. Reed's | Thursday, October 8, 2026 | "The last seven days", read either way: Thursday, October 1 to Wednesday, October 7, 2026. | Missed. |
| 18 orders, $910.00, or 17 orders, $886.00 without J. Reed's | Friday, October 9, 2026 | "The last seven days", read either way: Friday, October 2 to Thursday, October 8, 2026. | Missed. |
| 15 orders, $746.00, or 14 orders, $722.00 without J. Reed's | Saturday, October 10, 2026 | "The last seven days", read either way: Saturday, October 3 to Friday, October 9, 2026. | Missed. |
| 10 orders, $558.00 | Sunday, October 11, 2026 | "The last seven days", read either way: Sunday, October 4 to Saturday, October 10, 2026. J. Reed has no order in these days. | Missed. |
| 31 orders, $1,368.00, or 29 orders, $1,306.00 without J. Reed's | Monday, October 5, 2026 | A Sunday-to-Saturday week: Sunday, September 27 to Saturday, October 3, 2026. | Missed. |

**Not in the table?** Start from Sana's week, Monday, September 28 to Sunday, October 4, 2026: 31 paid orders, $1,486.00. Then find the orders your dry run counted that she did not count, or left out that she counted. These are the usual ones:

- J. Reed's orders, 2178 ($38.00) and 2196 ($24.00). Each one counted adds one order and its amount.
- Cancelled order 2189 ($72.00). Counted, it adds one order and $72.00.
- Order 2172, at 6:20 a.m. on Monday, September 28, 2026 ($42.00). Left out, it takes away one order and $42.00.
- Order 2171, at 11:46 p.m. on Sunday, September 27, 2026 ($46.00). Counted, it adds one order and $46.00.
- Orders 2206 ($36.00) and 2207 ($64.00), before 7 a.m. on Monday, October 5, 2026. Counted, they add two orders and $100.00.

On your last dry run, any numbers other than 31 orders and $1,486.00, for Sana's week, are Missed. To find the cause, ask the WORKER: `Why did you do it this way?`, with the difference after it.

## Why

**Check 13.** Sana's report runs every Monday at 7 a.m., and nobody is awake. Nobody can answer a question. So every run still gets all four parts, written in advance (Lesson 3.2). That is why your three Job A lines change.

- **A date becomes a rule.** "Today is Monday, October 5, 2026" is right for one day. Written once, a line such as "Today is Wednesday, October 7, 2026" makes every Monday's run think it is still October 7. A rule, the Monday-to-Sunday week before the run, is right every Monday. "Last week" alone is a word that is not clear to a worker on its own: Monday to Sunday, or Sunday to Saturday? "Find your numbers" shows how far the numbers move.
- **The authority stays inside the company's rule.** Little Wick's rule for every AI tool is the company's own first 10 percent (Lesson 3.5). A setup for one job can narrow a limit, never widen it (Lesson 3.2).
- **The stop rule says what to do instead of asking.** At 7 a.m., "ask Sana" means a run that waits, and no report at 9 a.m. So the stop rule says what the worker does instead. What it cannot decide becomes a flag, and it goes on with the work it can do safely (Lesson 3.3).

**Check 14.** Sana's report runs alone, every week. If the worker will run alone or repeatedly, do a dry run (Lesson 3.2, "How to choose"). A plan, "I will add up last week's paid orders", sounds right. A sample of a few orders can miss the two that matter. The whole job, on past data with a known answer, finds them (Lesson 3.2, Example 3). And a dry run needs a date that gives the week whose answer you know. With no date, it uses today's real date, and the orders file has nothing from that week.

**Check 15.** Sana's note is a fact the files do not hold, so the worker could not know it. A fix said in the chat helps one run. A line in the setup helps every Monday (Lesson 3.2, Step 4: a missing fact or definition goes in the knowledge). The line names J. Reed, because the orders file shows J. Reed, not Jo. And it does not name only this week's two orders: next week, Jo's tests have new order numbers.

**Check 16.** A dry run is checked against a known answer. When it matches, you keep that week as a test: a case with a known answer, used to test the worker after every change (Lesson 3.2). A test is for checking the worker, never for following. So it goes under Kept as tests, not in the setup's parts.

## Never a deduction

These things never make you miss a check:

- Where a line sits among Intent, Scope, Authority, Review contract, Knowledge, and Inputs and tools, and your words.
- A first dry run with no date. If you send one, the WORKER uses today's real date, and the GUIDE shows you the line with a date.
- A plan or a sample before the dry run.
- Which day from Monday, October 5 to Sunday, October 11, 2026 you chose for the dry run.
- A start date in your setup, such as the first run on Monday, October 12, 2026.
- Cancelled order 2189, if your numbers match Sana's. A line that says a cancelled order is not a sale is good. If your dry run marked leaving it out as a guess, add the line: a right guess is still a guess, and next Monday's run may guess another way.
- How the report looks.
- How many rounds it took until the numbers matched.

## Take it to work

For work that repeats, write the setup once, as rules. Then test it on a past week whose answer you know, and keep that week as a test.
