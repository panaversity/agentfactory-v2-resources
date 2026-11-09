# Lab 3 answer key: Task 8. What every setup needed, and which part broke

The answers for Task 8 of Lab 3, in Chapter 3 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Use it when the GUIDE says "Task 8 is done". Attach this file in your lab chat, type `Check` and send it. The AI marks each check Passed or Missed. It quotes your words under "All three jobs" in your notebook. If you think a mark is wrong, the final decision is yours, not the AI's. Missed a check? Read "Why", below, and tell the GUIDE your new answer, with its label first, such as `Case <number>: <your new answer>`. Then send the line the GUIDE shows: `Check again`. If a check passed only after you changed an answer, it still counts as Passed. Finding the part that broke is the skill this task teaches.

## The checks

Task 8 carries checks 20 and 21 of the lab's 24.

20. **Every setup needed the same things, and each job's risk decided what you questioned** (Lesson 3.2, the four parts and "How to choose"). Two answers in your notebook show it.
    - **Needed by all three:** three things, each with a part of the setup named. A thing counts when all three jobs needed it. For example: the date or the period, something out, what the worker may not do on its own, a stop rule or a flag, the evidence, or what counts as success. Another thing counts too, when all three jobs needed it. Which part you name for a thing is not graded.
    - **Each job:** a line for each job, with its main risk, in any words, and each check you questioned. One of them fits the risk, as "How to choose" in Lesson 3.2 says. Job A's risk was a wrong action, so a plan. Job B's risk was quality, so a sample. Job C runs alone every week, so a dry run. A line with two checks passes when one of them is the job's own, such as "a plan, then a sample" for Job B.
    - Passed: three things that all three jobs needed, each with a part; and a line for each job, with a risk, whose checks include a plan for Job A, a sample for Job B and a dry run for Job C.
    - Missed: fewer than three things; a thing with no part; a fact from one job only, such as a file, an opening hour or a person; a part's name given as the thing, such as "Scope: the scope"; the same thing twice in other words; a job with no line, or no risk; or no plan for Job A, no sample for Job B, or no dry run for Job C.

21. **Each case's broken part, found with the three questions in order** (Lesson 3.6, "Where to look first"). For each case, your line answers the questions in order, up to the first answer that points to a part. Then it names the part, and where the fix starts.
    - **Case 1:** yes, yes. The middle 80. The fix starts with the permission. For example, the worker can no longer use the tutor's email, or every email waits until the tutor approves it. Checking what it sent is good too, but the permission must be named. Taking the email away is stronger. An approval step leaves sending possible, but this check grades where the fix starts, not how strong it is.
    - **Case 2:** nothing found, with or without "yes, no, no" before it. Then, from the signs, the middle 80. The fix starts with what the landlord did during the run. Any fix that moves her worry into the first 10 passes. For example: the words she wants, written in the setup; one good letter, kept as an example; or a sample before the run. Holding back, and reading the letters once at the end, passes too.
    - **Case 3:** no. The first 10. The fix starts in the setup: a change that stops texts to patients marked "moved away". It may be a line in the instructions or the knowledge, or a list without them in the inputs.
    - **Case 4:** yes, no, yes. The final 10. The fix starts with the review: the manager reads the flags, or the evidence, before approving.
    - Passed: all four cases, as above. "The four new cases", below, shows why each question gets its answer.
    - Missed: a case with no answers to the questions, other answers, or another part; or a fix that starts in another place, such as a clearer written rule in case 1, a new or retrained worker in case 2, a person who checks each text in case 3, or a change to the worker or its setup in case 4. In case 2, "trust the AI more" is not a fix: it does not say what she changes.

## The four new cases

Answer the questions in order. "Stop" marks the first answer that points to a part.

| Case | 1. Did the specification say it? | 2. Did the worker act against it? | 3. Was the problem visible in the evidence? | The part |
| --- | --- | --- | --- | --- |
| 1. The tutor's notes | Yes: "Never send anything to parents." | Yes: it emailed twenty notes. Stop. | Not asked | The middle 80. It could use the tutor's email, so the rule was only written down. |
| 2. The landlord's letters | Yes. Nothing was missing: the AI's words were already right. | No. The worker did nothing wrong. | No. There was no problem to see. | Nothing found. The sign: the letters were right, but took her 50 minutes, and writing them herself takes about 40. So the middle 80: she did part of the worker's job. |
| 3. The dental reminders | No. "Text everyone on next week's list" says nothing about patients marked "moved away". Stop. | Not asked | Not asked | The first 10. The worker did what it was told, not what the office meant. |
| 4. The supplies order | Yes: "Flag any amount over twice the usual, and order only after the manager approves." | No. It flagged the paper, and it waited for approval. | Yes. The flag said: "Printer paper: 40 boxes, ten times the usual. Please check." Stop. | The final 10. The warning was there, and nobody read it. |

## Why

**The jobs were different. Their setups were not.** Each job needed the same four parts, and answers to the same five questions (Lesson 3.2). Each needed a date or a period, something out, a limit on what the worker may do alone, a stop rule, and evidence you can check. Only the facts under each part changed.

**The risk was different, so the check was different.** Each check shows something the others cannot (Lesson 3.2). A plan shows what the worker will do, so it fits a risky action, such as deleting files. A sample shows the worker's judgment, so it fits a risk in quality, such as replies that customers read. A dry run does the whole job on past data, and you compare the result with a known answer. So it fits work that runs alone every week.

**Find the part that broke before you fix anything.** People often fix the wrong part. They retrain the worker when the setup left something out. Or they rewrite the setup when nobody read the evidence (Lesson 3.6). The three questions, asked in order, show where to look first. In case 1, the rule was written, but the worker could still break it. A written line states a rule but does not enforce it (Lesson 3.3). So the fix is a permission, not new words. In case 2, the questions find nothing, because the AI's words were already right. The lost time is the sign: 50 minutes, against about 40 by hand. Failures can combine, so the answer is the first place to look, not the only one.

## Never a deduction

These things never make you miss a check:

- Your own words for a thing, a risk, a case or a fix. Where a line sits in your notebook is not graded.
- Which part you named for each thing.
- More than three things.
- Another check before or after the job's own, such as "a plan, then a dry run" for Job C.
- Yes and no in other words, such as "it did" or "it did not".
- In case 2, not naming which sign you used.
- In a case, more answers after the one that points to a part, or a second place to look after the right first one. Failures can combine.
- A fix with more in it than this key asks for, such as keeping the case as a test.

## Take it to work

When work you handed over goes wrong, ask the three questions, in order, before you fix anything.
