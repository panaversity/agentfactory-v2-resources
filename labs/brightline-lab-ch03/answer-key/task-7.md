# Lab 3 answer key: Task 7. Limits, and the review at a set time

The answers for Task 7 of Lab 3, in Chapter 3 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Use it when the GUIDE says "Task 7 is done". Attach this file in your lab chat, type `Check` and send it. The AI marks each check Passed or Missed. It quotes Job C's middle 80 and final 10 in your notebook. If you think a mark is wrong, the final decision is yours, not the AI's. Missed a check? Read "Why", below, and tell the GUIDE your new answer, with its label first, such as `Monday, October 19, 2026, 9 a.m.: <your new answer>`. Then send the line the GUIDE shows: `Check again`. If a check passed only after you changed an answer, it still counts as Passed. Holding each limit, and reviewing at a set time, is the skill this task teaches. Everyone gets the same three Mondays, whatever their setup says. So this key grades your decisions, not the runs.

## The checks

Task 7 carries checks 17 to 19 of the lab's 24.

17. **Each limit is held at the strength it needs** (Lesson 3.7, "The invariant"). Under "Middle 80 percent: limits for runs nobody watches", your answers hold these three, whichever of your lines they belong to:
    - **Changing or refunding an order: impossible.** The worker gets no access that can change an order: read-only access, or only a copy of the orders, and no other tool that can change them. Sana's box says anyone who can open the orders can also change or refund them. So the worker must not get the access a person has.
    - **Contacting a customer: impossible.** The worker has no email or message tool. The report goes in the shared folder, so it needs none.
    - **Each line that needs judgment: written and checked.** A line needs judgment when the worker must decide whether it applies, such as what counts as a sale, or your stop rule. It is written in the instructions, and checked in the final 10.
    - Passed: all three. The name of the product's setting is not needed.
    - Missed: changing an order, or contacting a customer, held as "a person decides" or "written and checked", or not held at all; "impossible" with no way given for that limit, or with only a setup line as the way, such as "the authority says read only"; or a line that needs judgment called "impossible" or "a person decides".
18. **A named person reviews at a set time, and reads each Monday in the right order** (Lesson 3.4, "When the worker runs without you"). Job C's final 10 says:
    - **Who reviews, and when:** a person you name, and a set time. For example: "Sana, every Monday at 8 a.m.", or "Jo, every Monday at 9 a.m.".
    - **Monday, October 12, 2026:** you read the flag first. A person, not the worker, deals with order 2231's request for a refund and a discount code.
    - **Monday, October 19, 2026:** no report is not a quiet week. Your first answer looks for the missing run, such as on the Scheduled page. Your next answer acts on what the page shows: you approve the save after you read what it asks, run the task again, or tell Jo the report is late.
    - **Monday, October 26, 2026:** no flags, and you still check what the report says: for example its week, its totals, or some of its lines against the orders.
    - Passed: all four. "Every Monday", with no hour, is a set time. "Me", with a set time, passes as the person who reviews. The person who deals with order 2231 may be Sana, Jo or you.
    - Missed: no person, or no set time, such as "Sana, when there is a problem"; on October 12, anything read before the flag, or the worker left to refund or to send a code; on October 19, "a quiet week", a first answer that does not look for the missing run, nothing done, or waiting for next Monday; on October 26, no check of what the report says, such as "no flags, so nothing to check".
19. **The month looks back at the worker, not at one Monday** (Lesson 3.5, "A worker's working life"). Your answer under "The month:" says:
    - **Which case she runs again:** a case from your Kept as tests, with its known answer, such as Sana's week, Monday, September 28 to Sunday, October 4, 2026, and her numbers.
    - **What she looks for across the Mondays:** at least one of these: the same correction or flag more than once; a missed, late or paused run; a setup that no longer fits the job; or whether every Monday's report came on time and was right.
    - Passed: both.
    - Missed: no case, or a case that is not kept as a test, such as next Monday's report; or one Monday only, with nothing across the Mondays.

## Why

**Check 17.** When nobody watches, each limit must hold without you. Lesson 3.7 names three strengths, from the strongest:

- **Impossible.** Remove every access path, and the worker cannot do the action. A task with read-only access to the orders cannot change them through that connection, as long as no other tool can change them.
- **A person decides.** An approval step holds the action until a person says yes. It has a cost: the run waits. At 7 a.m., a waiting run can mean no report at 9 a.m.
- **Written and checked.** A rule that needs judgment cannot be made impossible. It is written in the instructions, and a person checks it in the final 10.

A product setting can make a person decide. Only removing every access path makes an action impossible (Lesson 3.7). So give the least access that works. The report only needs to read the orders and save a file, so changing an order and contacting a customer can both be made impossible. An approval step would leave contact possible: a person's yes would let the worker reach a customer, and Little Wick's rule says never.

**Check 18.** Work that runs alone still has a final 10. It moves to a set time that you choose (Lesson 3.4). The rhythm never runs without a person at both ends (Lesson 3.5). At that time, read the flags first: there, the worker tells you where to look. A missing report is not a quiet week. A run that never started raises no flag. A task that waits for approval produces nothing, so it looks just like a quiet week (Lesson 3.7). So check the Scheduled page. And a report with no flags still gets a spot check. A worker that never raises a flag is either doing perfect work or not noticing its mistakes. Only a spot check tells you which (Lesson 3.4).

**Check 19.** Each Monday is one task inside the worker's working life. That working life has its own final 10: a look back at the month (Lesson 3.5). Run the tests again, because a change to the setup, the data or the model can break what used to work. Look for the same correction twice: it shows a gap in the setup. Look for missed runs. And ask whether the setup still describes the job.

## Never a deduction

These things never make you miss a check:

- Where your answers sit in the notebook, and your words.
- Naming Claude's or ChatGPT's setting, or neither. The strength, and how the limit is held, are graded, not the product's name.
- An approval step on top of a limit that is already impossible, such as choosing Manually approve as well.
- How you hold lines that check 17 does not name, such as reading the orders or saving the report.
- Who reviews: Sana, Jo, you, or another named person.
- Whether order 2231's customer gets a refund. That is the shop's choice.
- More steps than this key asks for, such as a change to a setting, so the next run does not wait.
- More than one thing to look for across the Mondays.

## Take it to work

Make what must never happen impossible where you can. Then put your review in the calendar, and check that each run happened: a missing run is a failure too.
