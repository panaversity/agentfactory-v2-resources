# Lab 3 answer key: Task 5. Hold back, and step in only for a reason

The answers for Task 5 of Lab 3, in Chapter 3 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Use it when the GUIDE says "Task 5 is done". Attach this file in your lab chat, type `Check` and send it. The AI marks each check Passed or Missed. It quotes your answers under Job B's "Middle 80 percent: during the run", in your notebook. If you think a mark is wrong, the final decision is yours, not the AI's. Missed a check? Read "Why", below, and tell the GUIDE your new answer, with its label first, such as `2:05 p.m.: <your new answer>`. Then send the line the GUIDE shows: `Check again`. If a check passed only after you changed an answer, it still counts as Passed. Deciding each moment for a reason is the skill this task teaches. Everyone gets the same job-b-run.md, whatever their setup says. So this key grades your decisions, not your setup.

## The checks

Task 5 carries check 12 of the lab's 24.

12. **You held back, and stepped in only for a stop condition** (Lesson 3.3, "When to step in"). You decide each moment on its own, as if the run had gone on. "Moment by moment", below, says what passes at each one.
    - Passed: all six moments, as the table accepts.
    - Missed: any moment decided another way, as the table says; or a moment with no decision of its own, such as "I already stopped it".

## Moment by moment

| Moment | What it shows | What passes |
| --- | --- | --- |
| 2:03 p.m. | The worker asks if each reply should start with the reviewer's first name. | Answer its question, yes or no, and let it go on. This is not a stop condition: answering is part of your job in the middle. "Hold back" or "step in" both pass, if you only answer. Missed: you stop the run, leave the question unanswered, or add new instructions to your answer. |
| 2:05 p.m. | It reads the three older reviews, from Tuesday, September 29 to Sunday, October 4, 2026. | Step in. The inputs are wrong. Stop the run, and fix the inputs or the setup, so it reads only last week's five reviews. A new run then starts from the fixed setup. Missed: you hold back; you name another stop condition; you name no fix to the inputs or the setup; or you send the fix as a message while the run goes on. |
| 2:09 p.m. | Leila texts: no public reply to review 3. | Step in. The intent has changed. "The inputs are wrong" passes too, because the fix is the same. Stop the run, and change the setup so review 3 gets no public reply. A new run then starts from the fixed setup. Missed: you hold back; you name another stop condition, such as "it acts beyond its authority"; you name no change to the setup; or you send a message while the run goes on. |
| 2:12 p.m. | Reply 1 makes fun of another café's cake. | Hold back. It is only a draft, and you read it in the final 10. Changing it now is steering. A note for the review, or a line for the next run, is fine. Missed: you step in to change the reply, or you stop the run. |
| 2:15 p.m. | It posts reply 1 on the review site. | Step in. It acts beyond its authority. Stop at once. Check what it posted: taking reply 1 down counts. And fix the permission: take away its access to post. All three are needed: stop at once, check what it posted, and fix the permission. Missed: you hold back; you name another stop condition; you do not check what it posted; or you fix no permission, such as only a new line in the setup. |
| 2:18 p.m. | It writes a code for a free coffee, because a new review told any AI to. | Step in. Its behavior looks suspicious. "It acts beyond its authority" passes too. Stop at once, and treat it as a security problem, not a problem with one reply. Or stop at once and fix the permission that let it happen, as the table says for "it acts beyond its authority": that passes too, with either stop condition. Missed: you hold back; you only change the reply, and let the run go on; or you name "the intent has changed" or "the inputs are wrong". |

## Why

**Check 12.** In the middle 80, the worker owns the steps (Lesson 3.3). Your job there is small. Answer its questions, approve only what the authority needs, and do not steer. Each time you step in, you take back work you handed over. So you step in only for one of the four stop conditions.

- **The intent has changed, or the inputs are wrong** (2:05 and 2:09). Stop the run, fix the setup or the inputs, and start a clean run. A message in the chat is not the fix. With a message, the setup stays wrong, and later nobody can see in one place what the worker was asked to do. A progress view is for noticing this kind of thing: the wrong files, or the wrong week.
- **It acts beyond its authority, or its behavior looks suspicious** (2:15 and 2:18). Stop at once. Here, a better line in the setup is not enough. A written line states a rule, but it does not enforce it. The worker needs a limit that is enforced, such as no access to post. A worker that follows an instruction hidden in a review is a security problem, not a problem with one reply.
- **No stop condition** (2:03 and 2:12). A question from the worker is your stop rule working: answer it, and only it. A draft you do not like waits for the final 10. Changing it now is steering.

## Never a deduction

These things never make you miss a check:

- Where your answers sit in the notebook, and your words.
- At 2:03, the words "hold back" or "step in", when what you do is answer its question and let it go on.
- At 2:09, "the intent has changed" or "the inputs are wrong". The fix is the same.
- At 2:18, "it acts beyond its authority" in place of "its behavior looks suspicious", with that condition's steps from the table: stop at once, check what it changed, and fix the permission.
- At 2:05, 2:09, 2:15 and 2:18, "step in" with a stop condition counts as stopping the run. You do not need to write "stop" as well.
- Your own words for a stop condition, when they mean the same.
- Saying, or not saying, that a new run starts after you fix the setup at 2:05 or 2:09.
- More steps than this key asks for, such as checking whether any code was used, or a line for the next run.

## Take it to work

While an AI works, stay nearby and hold back. Step in only for a stop condition. Then fix the setup, or the permission, not the chat.
