# Lab 3: one AP task through the whole rhythm

Chapter 3 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 3: one AP task through the whole rhythm](https://agentfactory-v2.vercel.app/ai-worker-paradigm/the-10-80-10-operating-rhythm/lab/), so you can do the lab without the book.

In this lab you run one real AP task through the whole rhythm, twice. Run 1 uses Dave's one-line request. Run 2 uses a first 10 percent that you write. Then you review the evidence as the final 10, and diagnose where Run 1 lost its points. The lessons become Draft 2 of the Role Contract, and its limits are ported to each AI vendor's scheduled tasks. Each task is checked against its own answer key the moment it is done. It takes about 2 hours. You need a Claude or ChatGPT account.

## Before you start (5 minutes)

Download [`brightline-lab-ch03.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03.zip), and unzip it. You get one folder with four things:

- `README.md`
- `LAB.md`: this page, as a file
- `role/`: the blank first 10 percent, and a sample Draft 1 for anyone who skipped Chapter 2
- `inputs.zip`: the vendor's statement, Brightline's register, the AP policy's section 7, and one invoice copy

If you wrote your own Role Contract in Chapter 2, use it: Task 6 turns it into Draft 2. The sample is only for readers who start here.

## The job

- You still work in accounts payable (AP) at Brightline Wholesale Supply, and Dave Kowalski, the controller, still owns the AP Worker.
- Today is Thursday, October 1, 2026. Brightline is closing September's accounts, and Dave signs the close on Monday, October 5 (policy 7.1).
- Midwest Packaging's statement says Brightline owes $8,083.50. Brightline's register says $4,083.50.
- AP policy section 7 says the whole difference must be explained, and that the register is never changed to match a vendor.
- The controller supplies the policy, the deadline and the approvals. You write the first 10 percent and do the final 10. The worker does the middle.

## How each task works

You write two documents yourself, in any text editor: the first 10 percent for this task, and Draft 2 of the Role Contract. The lab uses two kinds of conversation:

1. **A run**: a fresh conversation each time. Send the request, with `inputs.zip` attached. The worker owns the middle 80: do not steer it. If it stops and asks under your stop rule, answer the question asked, and nothing more. When it finishes, attach the run key and send the run prompt, printed in Task 1. The AI scores its own reconciliation, and you compare with the key.
2. **A check**: one conversation you keep for the whole lab. Attach the task's answer key, and send the check prompt, printed in Task 2, with your document pasted under it. The AI grades, quoting your words. Read the key yourself too, because you have the final say. A missed check means fix your document, and send the check prompt again: the key is already there.

## Task 1. Dave's one line (15 minutes)

**Dave asks:** "Reconcile Midwest Packaging's statement."

**What you do:**

1. Before anything runs, decide what you expect: what will a one-line request get wrong? Keep your guess in mind.
2. Open a fresh conversation. Send Dave's line, exactly as he said it, with `inputs.zip` attached. Do not add anything: this run is his 9 a.m. request, re-lived.
3. When it finishes, download [the run key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-1-run.md), one click. Attach it in the same conversation, and send this run prompt:

   ```text
   Outcome:  The reconciliation you just made in this conversation,
             scored against the attached answer key: its points out
             of 10, its deductions, and pass or fail.
   Format:   A table: each scored line, the points, and your own
             words or rows that show it. Then the deductions, each
             with its reason. Then the score, and pass or fail.
   Inputs:   Your answers in this conversation, and the attached
             answer key, including its rule for date claims.
   Autonomy: Score only. Do not redo the reconciliation.
   ```

4. Read the key yourself, and compare the scoring with your guess from step 1. Note each point lost, and each deduction: Task 5 diagnoses them.

**Give Dave:** nothing yet. This run showed what his one line buys.

**Checkpoint.** You know Run 1's score, its deductions, and how it compares with your guess.

## Task 2. Write the first 10 percent (25 minutes)

**Dave asks:** "Then set it up properly. I sign the close on Monday."

**What you do:**

1. Copy `role/first-ten-template.md` to a file of your own, such as `role/first-ten-midwest.md`, and fill every field: intent, scope, authority for this task, the review contract's five questions, and the format you want back. Write it so the worker could do the job if you were unreachable for the whole run.
2. Two fields do the most work. The authority must be narrower than the Role Contract, and say so: this task recommends, and changes nothing. The review contract's stop rule and never-list are what keep the run safe while you are away.
3. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-2.md), one click. Open a new conversation, your check conversation for the whole lab. Attach the key, and send this check prompt, with your first 10 percent pasted under the line:

   ```text
   Outcome:  The document pasted below, graded against the attached
             answer key: Passed or Missed for each of its checks.
   Format:   A table: the check, Passed or Missed, the document's own
             words that show it, and one line on why. Then how many
             passed.
   Inputs:   The attached answer key, and the document pasted below
             the line.
   Autonomy: Grade only. Do not rewrite the document, and do not
             suggest new lines. With no words to quote, mark the check
             Missed. If a check is about what I did, ask me.

   ---
   ```

**Give Dave:** the review contract's five answers, so he knows what evidence Monday's signature will rest on.

**Checkpoint.** Checks 1 to 4 passed.

## Task 3. Run it (20 minutes)

**What you do:**

1. Open a fresh conversation. Send your first 10 percent, with `inputs.zip` attached.
2. The middle 80 is the worker's. Stay reachable, and do not steer. If it stops and asks under your stop rule, answer the question asked.
3. When it finishes, attach the run key in the same conversation, and send the run prompt. Compare with the key yourself.
4. A lost point usually comes from your first 10 percent. Fix the field that caused it, check it again in your check conversation, and run again in a fresh conversation. The brief that passes is your final first 10 percent.

**Give Dave:** a run that passed, with 9 or more and no unauthorized action.

**Checkpoint.** Run 2 passed, on a first 10 percent that passed checks 1 to 4.

## Task 4. The final 10 percent (15 minutes)

**What you do:**

1. Review Run 2's evidence against your own review contract, item by item. Read what the worker flagged first, because a flag is the worker telling you where it was unsure.
2. Open `inputs.zip` on your computer, and check two cited lines yourself: does the statement line or register row say what the run claims?
3. Decide each item. The timing items need no action. Each real item becomes a recommendation routed to the person the policy names, nothing done yet.
4. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-4.md). In your check conversation, attach it and send the check prompt, with your first 10 percent pasted under it. Its checks are about your review, so the AI asks: answer it.

**Give Dave:** the three real items, each with its evidence and its policy section, for his approval.

**Checkpoint.** Checks 5 and 6 passed.

## Task 5. Which part broke (10 minutes)

**What you do:**

1. Take each point Run 1 lost, and each deduction, and ask the chapter's three questions in order. Did the brief, contract or policy say it? Did the worker act against them? Was the problem visible in the evidence?
2. Write your diagnosis as a few lines: each loss, and the part of the rhythm that owed it. If Run 1 lost nothing, write why: what carried the policy to the worker, and what your one line still never gave it.
3. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-5.md). In your check conversation, attach it and send the check prompt, with your diagnosis pasted under it.

**Give Dave:** one sentence on which part of the rhythm his 9 a.m. request skipped.

**Checkpoint.** Check 7 passed.

## Task 6. Draft 2 of the Role Contract (15 minutes)

**Dave asks:** "Put what we learned where it lasts. I don't want to write these rules into every brief."

**What you do:**

1. Open your Role Contract from Chapter 2, or the sample in `role/`. Mark the header Draft 2, with today's date.
2. Keep every Draft 1 line. Narrow the register authority to register-building, and add the reconciliation lines: observe and recommend only, never change the register to match a statement. Add the stop-and-report rule and Dave's routing to Escalation. Add this statement, with its passing bar, and Dave's review checks, to Evaluations. Add an open question: how often Dave reviews this contract.
3. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-6.md). In your check conversation, attach it and send the check prompt, with your Draft 2 pasted under it.

**Give Dave:** Draft 2, marked with what changed and what is new.

**Checkpoint.** Checks 8 to 10 passed.

## Task 7. Port the limits (15 minutes)

**Dave asks:** "If this reconciliation runs as a scheduled task, what holds the limits while nobody watches?"

**What you do:**

1. Write a short section at the end of your Draft 2, "Scheduled-task limits". For each "never" in this task, say how you would hold it on Claude and on ChatGPT. Name the strength it reaches: impossible, a person decides, or brief and review. [How the two leaders support the rhythm](https://agentfactory-v2.vercel.app/ai-worker-paradigm/the-10-80-10-operating-rhythm/two-leaders/) has each AI vendor's controls.
2. Start from the strongest limit. Access you never granted beats any approval, and an approval beats an instruction.
3. Judgment rules cannot be settings. Say where each one lives instead, and which measurable part a setup could check automatically.
4. **Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-7.md). In your check conversation, attach it and send the check prompt, with your port pasted under it.

**Give Dave:** the port, and any limit that needs an open question.

**Checkpoint.** Checks 11 and 12 passed.

## Ready for Chapter 4

Your work is ready when checks 1 to 12 have passed and Run 2 passed the run key. Keep your first 10 percent and your Draft 2 where you can find them again: the book keeps building on the contract. If you keep the book's running project in a git repository, add both files, and tag that commit `ch03`.

## If something goes wrong

- **The AI will not take `inputs.zip`.** Unzip it, and upload the four files inside it instead.
- **The AI will not take an answer key, or your plan's uploads ran out.** Open the key, copy its text, and paste it under the prompt instead.
- **You attached the wrong task's key.** Say so, attach the right one, and send the prompt again.
- **The run changed the register, or "sent" something.** It acted beyond the authority it was given. Check what your first 10 percent allowed, fix it, and run again fresh.
- **The run used the wrong date.** Your scope did not say what today is. The worker judges "due" and "overdue" by its own clock unless you tell it.
- **The run stopped and asked.** That is your stop rule working. Answer the question asked, and let it continue.
- **Your plan's daily limit ran out.** Your documents keep. Carry on tomorrow, from the next task.

## Apply it to your vertical (20 minutes)

Your vertical is the line of work you know best. Pick one task in it that you would hand over. Copy the first-ten template and write its first 10 percent, with real dates, a stop rule, and a never-list. If you can, run it on your own files in a fresh conversation, and review the evidence flags first. The five questions are the part your vertical will reuse every week.

## Look back

- **The three failures.** Dave's 9 a.m. was a first-10 failure. Where in your own runs did each failure try to happen, and what stopped it?
- **Your guess against Run 1.** What did you predict, and what actually cost the points?
- **The same correction twice.** Which lesson went into Draft 2, so no future brief has to carry it?
- **The three scales.** Your first 10 percent ran one task. Your Draft 2 is the first 10 percent of the worker's whole life. What is the company-scale version of the line you just wrote?
- **The strongest limit.** For each "never", could you make it impossible, or only make a person decide? [How the two leaders support the rhythm](https://agentfactory-v2.vercel.app/ai-worker-paradigm/the-10-80-10-operating-rhythm/two-leaders/) explains why that difference holds on either AI vendor.
