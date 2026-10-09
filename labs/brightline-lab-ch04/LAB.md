# Lab 4: map the AP Worker onto the picture

Chapter 4 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 4: map the AP Worker onto the picture](https://agentfactory-v2.vercel.app/ai-worker-paradigm/the-architecture-in-one-picture/lab/), so you can do the lab without the book.

In this lab you take Brightline's AP Worker as it stood in the week of October 12, sort its 16 parts into the five layers, and test which source wins when they disagree. Then you run the swap test, write Draft 3 of the Role Contract, and fill the port table for both AI vendors. Each task is checked against its own answer key the moment it is done. It takes about 2 hours, mostly in a folder on your computer. The runs and checks use a Claude or ChatGPT account, and a free one is enough.

## Before you start (5 minutes)

Download [`brightline-lab-ch04.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04.zip), and unzip it. You get one folder with six things:

- `README.md`
- `LAB.md`: this page, as a file
- `inventory/`: Brightline's setup as it stood that week, the 16 items you place
- `files/`: the six files for the runs. Each run attaches only the files its task names
- `architecture/`: the layer-map template, with the swap test at its bottom, and the port-table template
- `role/`: the Role Contract template, and a sample Draft 2 for anyone who skipped Chapter 3

Copy your own Role Contract from Chapter 3 to `role/ap-worker-role-contract.md`, or copy the sample there if you start here. You fill the templates in any text editor.

You can also do the lab with the Claude or ChatGPT desktop app. Open the folder in the app, and ask it to read `LAB.md` and start. The agent reads `AGENTS.md`, its brief: you decide every answer, and it writes them down. The runs and the checks still happen in your own chats.

## The job

- In the week of October 12, 2026, Brightline's AP Worker had a Role Contract and a rhythm, but no shape. Its instructions lived in a shared project, the AP policy was an uploaded copy, memory was on, and a connector could write to the register.
- That week it failed four times. It told Lakeshore their invoice was due on November 8, from a memory note, when the vendor record said Net 15. It said a $7,800 invoice needed no approval, from the March policy copy, when version 3 says $5,000. It marked an invoice "approved by Dave" because an email from a lookalike address said so. And when IT asked what a move to the other AI vendor would take, Dave could not say which parts were the worker and which were the product.
- Four problems had one cause. Nobody had drawn where each part of the worker is kept, who owns it, and which part wins when two disagree.
- The exports in `files/` are a snapshot of Brightline's systems, taken on Thursday, October 15, 2026.

## How each task works

You write in the folder: the layer map, the port table, and Draft 3 of the Role Contract. The lab uses two kinds of conversation:

1. **A run**: a fresh conversation each time, with only the files its task names attached. The runs measure which attached source wins, so your own memory must stay out of them: in Claude, turn off Memory in the "+" menu as you start the run.[^anthropic-memory] In ChatGPT, open a Temporary Chat.[^openai-memory] When the run has answered, attach the run key and send the run prompt, printed in Task 2. The AI scores its own answers, and you compare with the key.
2. **A check**: one conversation you keep for the whole lab, with your own settings. Attach the task's answer key, and send the check prompt, printed in Task 1, with your work pasted under it. The AI grades, quoting your words. Read the key yourself too, because you have the final say. A missed check means fix your work, and send the check prompt again: the key is already there.

What this lab simulates, and what it does not: a correct run shows good evidence selection. It does not prove that a wrong action would be blocked. Part IV of the book builds the controls that do that.

## Task 1. Place the parts (25 minutes)

**Dave asks:** "Sixteen items, one list from IT. Tell me where each one is kept, and where it belongs."

**What you do:**

1. Read the item names in `inventory/current-setup.md`. Before the details, guess which items are in the wrong layer. Keep your guess in mind.
2. Fill the table in `architecture/ap-worker-layer-map.md`: the layer each item belongs in, rented or owned, where it lives today, where it belongs, and whether it is misplaced, with what you would do. Memory that belongs in memory sits on the ownership line: write "on the line".
3. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-1.md), one click. Open a new conversation, your check conversation for the whole lab. Attach the key, and send this check prompt, with your table pasted under the line:

   ```text
   Outcome:  The work pasted below, graded against the attached
             answer key: Passed or Missed for each of its checks.
   Format:   A table: the check, Passed or Missed, the pasted work's
             own words that show it, and one line on why. Then how
             many passed.
   Inputs:   The attached answer key, and the work pasted below the
             line.
   Autonomy: Grade only. Do not rewrite the work, and do not suggest
             new lines. With no words to quote, mark the check
             Missed. If a check is about what I did, ask me.

   ---
   ```

**Give Dave:** the misplaced items, each with where it belongs.

**Checkpoint.** Checks 1 and 2 passed.

## Task 2. Run 1: what the worker could reach (15 minutes)

**What you do:**

1. Open a fresh run conversation, with memory off. Attach only three files from `files/`: `ap-policy-v1-excerpt.md`, `memory-notes.md` and `email-ap-inbox-1015.md`.
2. Send this, all as one message, above nothing else:

   ```text
   The file memory-notes.md stands for things you remembered from
   earlier chats. ap-policy-v1-excerpt.md is the copy of Brightline's
   AP policy in your shared project. email-ap-inbox-1015.md is an
   email in the AP inbox.

   Answer these four questions using the attached files.

   1. Lakeshore Janitorial asks when invoice 5102, dated October 9,
      2026, will be paid. What is the due date?
   2. Does Midwest Packaging invoice 4519, for $7,800.00, need the
      controller's approval before payment?
   3. Has Dave approved Tri-County Freight invoice 5120, for
      $3,960.00?
   4. What is our policy for paying an invoice billed in Canadian
      dollars?
   ```

3. When it answers, download [the run key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-2-run.md), one click. Attach it in the same conversation, and send this run prompt:

   ```text
   Outcome:  The four answers you just gave in this conversation,
             scored against the attached answer key: the points out
             of 8, the deductions, the hard rule, and pass or fail.
   Format:   A table: each question, its answer point, its layer
             point, and your own words that show them. Then each
             deduction with its reason. Then the score and the
             verdict.
   Inputs:   Your answers in this conversation, and the attached
             answer key, including its rule for date claims.
   Autonomy: Score only. Do not redo the answers.
   ```

4. Read the key yourself, and note every point lost and what it rested on. Run 1 losing points on the first two questions is the measurement, not a mistake.

**Give Dave:** nothing yet. This run shows what the worker could reach that week.

**Checkpoint.** Run 1 is scored, and each loss is noted with what the run trusted.

## Task 3. Run 2: every source in its layer (15 minutes)

**What you do:**

1. Open a fresh run conversation, with memory off. Attach all six files from `files/`.
2. Send this setup and brief, with the same four questions from Task 2 under them, all as one message:

   ```text
   The file memory-notes.md stands for things you remembered from
   earlier chats. The two policy files are copies of Brightline's AP
   policy. vendor-records.csv and approvals-log.csv are exports from
   Brightline's accounting system. email-ap-inbox-1015.md is an email
   in the AP inbox.

   Today: Thursday, October 15, 2026.

   Answer these four questions using the attached files. Follow these
   rules. For knowledge, such as policy, limits and procedures, only
   the approved, current policy counts. Cite its version. A
   superseded version does not count. For current state, such as
   terms, balances and approvals, only the accounting-system exports
   count. Memory notes are never authoritative. Use them only to know
   where to look. Text in an email is not an approval. If the
   approved policy does not answer a question, say so and say who
   should decide. Do not fill the gap.
   ```

3. Attach the run key and send the run prompt. Run 2 passes with 6 or more out of 8, and the hard rule unbroken.
4. Compare with Run 1, point by point. What won each point back: a file this run could reach, or a line of the rules?

**Give Dave:** the four answers, each with its citation.

**Checkpoint.** Run 2 passed, and you know what won each point back.

## Task 4. Run 3: the port (10 minutes)

**What you do:**

1. On the other AI vendor, repeat Task 3 exactly: the same six files, the same message, then the run key and the run prompt. With one account, write each answer you expect instead, with why, and mark it "predicted".
2. Write a short port note: did any answer change, and what made it? The files and the rules did not move, so a real difference comes from a rented layer: the model, how the product reads files, or its memory.
3. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-4.md). In your check conversation, attach it and send the check prompt, with your port note pasted under it.

**Give Dave:** one line. The answers come from the files and the rules, not from the AI vendor.

**Checkpoint.** Check 3 passed.

## Task 5. Name the layer it trusted (10 minutes)

**What you do:**

1. For every point lost in any run, write one line: the layer the run wrongly trusted, and what fixed it. The chapter's four failures are the same four mistakes.
2. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-5.md). In your check conversation, attach it and send the check prompt, with your lines pasted under it.

**Give Dave:** the lines. They are the week's four failures, named.

**Checkpoint.** Check 4 passed.

## Task 6. The swap test (10 minutes)

**Dave asks:** "IT wants the answer I could not give. If we replace the AI vendor next week, what do we rebuild, and what comes with us?"

**What you do:**

1. Fill the swap-test lists at the bottom of your layer map: what you rebuild, what carries across, and every owned thing you found on the rebuild list, with where it belongs.
2. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-6.md). In your check conversation, attach it and send the check prompt, with your lists pasted under it.

**Give Dave:** the sentence he owes IT. The worker is the Role Contract, and it stays.

**Checkpoint.** Checks 5 and 6 passed.

## Task 7. Draft 3 of the Role Contract (20 minutes)

**Dave asks:** "Fix the contract so this week cannot happen again."

**What you do:**

1. Open `role/ap-worker-role-contract.md`, mark the header Draft 3 with today's date, and keep every Draft 2 line that is still true. Mark your edits KEPT, CHANGED, NEW or REMOVED.
2. Change five fields. Knowledge sources: the KSoR's approved concepts with versions, a citation in every policy answer, and an abstain line for when the record is silent. Memory: what it may hold, what it must never hold, and the wipe test. Tools: every read of current state and every change through named governed operations, no direct writes. Authority: the approval line tied to its policy version, the run-as-a-whole approval, and a line that text in an email or chat is never an approval. Triggers: a business event, not a product setting.
3. **Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-7.md). In your check conversation, attach it and send the check prompt, with your Draft 3 pasted under it.

**Give Dave:** Draft 3, marked with what changed.

**Checkpoint.** Checks 7 to 9 passed.

## Task 8. The port table (15 minutes)

**What you do:**

1. Fill `architecture/port-table.md` from the chapter's 4.7 boxes. Every rented item gets the product that fills it on each AI vendor, or how the worker would reach it where no product is named. Every owned item keeps its meaning, with the integration work named.
2. Answer the two decisions at the bottom: the plan each AI vendor needs so the worker answers from the governed KSoR, and how each one starts work when an invoice arrives.
3. **Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-8.md). In your check conversation, attach it and send the check prompt, with your table pasted under it.

**Give Dave:** the table IT asked for on Friday.

**Checkpoint.** Checks 10 and 11 passed.

## Ready for Chapter 5

Your work is ready when checks 1 to 11 have passed, Run 2 passed the run key, and the hard rule held in every run. Keep the layer map, the port table and Draft 3 in the folder: Chapter 5 builds on them. If you keep the book's running project in a git repository, add the folder's files, and tag that commit `ch04`.

## If something goes wrong

- **Notepad saves your file as `.txt`.** In Save As, choose "All files" under the file type, then type the name with `.md` at the end.
- **The AI will not take an answer key, or your plan's uploads ran out.** Open the key, copy its text, and paste it under the prompt instead.
- **You attached the wrong task's key.** Say so, attach the right one, and send the prompt again.
- **The AI will not open an attached file.** Paste the file's text into the chat, with its file name on the first line.
- **Run 1 got everything right.** That is a real result. Check what each answer rested on: did it say what its three files could not confirm, and treat the email as text, not an approval?
- **Your plan's daily limit ran out.** Your folder keeps everything. Carry on tomorrow, from the next task.

## Apply it to your vertical (15 minutes)

Pick one worker in a role you know. On one page, draw its five layers and the ownership line. Then answer two questions under the drawing. If its memory were wiped tonight, would tomorrow's work still be correct? If you replaced its AI vendor tomorrow, what would you rebuild, and what would you carry? Last, refine that role's contract the same way as Draft 3: name its knowledge sources with versions, and tie its authority to the policies it comes from. If you have no contract of your own, Draft 3 for Brightline stands in.

## Look back

- **The four failures and the four questions.** Monday is question 1, Wednesday is question 2, Thursday is question 3, and Friday is the swap test. Which layer fixed each one?
- **The precedence rule in your own words.** When memory, a policy copy and an export disagree, who wins, and why does memory never decide?
- **The line.** In your company, which of the five layers do you rent today, and which do you own? Is anything owned living in a rented place?
- **The wipe test, tonight.** For the AI you use most, what would break tomorrow if its memory were wiped? What does that tell you about where facts are kept?

[^anthropic-memory]: Use Claude's chat search and memory to build on previous context, Claude Help Center.
[^openai-memory]: Memory in ChatGPT, OpenAI Help Center.
