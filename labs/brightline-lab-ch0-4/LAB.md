# Lab 0.4: Your 4D plan, before the run

Chapter 0.4 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 0.4: Your 4D plan, before the run](https://agentfactory2.panaversity.org/how-ai-works/ai-fluency/lab/), so you can do the lab without the book.

In this lab you write the 4D plan for Brightline's monthly vendor-statement reconciliation before any run, keep its behavior line where the app puts it back into every chat, and let the AI run the job alone. Then you read the run's output afterward, as Dave would the next morning, and check it against the source. Each task has its own answer key, and you check it the moment the task is done. The lab takes about 30 minutes.

**What you will learn:**

- To write a 4D plan before any run, with a "when" on every line.
- To keep a performance description where the app puts it back into every chat.
- To let a run work from the plan alone, and to judge its output afterward from the source.

## Before you start (3 minutes)

Download [`brightline-lab-ch0-4.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-4.zip), and unzip it. You get one folder with three files:

- `README.md`
- `LAB.md`: this page, as a file
- `inputs.zip`: Buckeye Office Supply's August statement, Brightline's register for Buckeye, and Brightline's AP policy

Use your free account with Claude, and with ChatGPT if you like, with the settings you chose in Lab 0.2, or, if you skipped it, with training and memory set as you want them. This lab uses only the book's invented files.

## The job

- Brightline Wholesale Supply is the book's example company. Everything about it is invented, and you work only with its files.
- Each month, Brightline reconciles each vendor's statement with its register, its own list of the invoices it has received. Its accounts payable (AP) policy, version 3, approved on September 1, 2026, sets the rules in section 7. Line 7.4 says: "Never change the register to match a vendor statement." Line 7.7 says: "Do not contact a vendor about a reconciliation without the Controller's approval."
- Dave, the controller, wants the job done by an AI, alone, each month. This month it is Buckeye Office Supply's statement of August 28, 2026, against the register as of August 31.
- You write the 4D plan before the first run. The run works from the plan alone, and you read its output afterward.

## How the lab works

The lab uses two kinds of chat. Your **lab conversation** is one chat on Claude. It holds your plan, your notes and your checks, from Task 1 to the end. The other chats run as each step says. You copy what a step asks into your lab conversation, under the line the step prints, and the AI there asks you about it.

Copy every message and brief exactly as it is printed.

Each task works the same way:

1. Do the task's steps. Paste each reply into your lab conversation, under the line the step prints.
2. Answer the AI's questions in a few words, in the shape it asks for.
3. Download the task's answer key, one click. Attach it, and send the check prompt.
4. Missed a check, or you disagree with a grade? Tell the AI which row changes and why. Then send the check prompt again. The key is already attached.

## The check prompt

One prompt checks every task, in your lab conversation. Attach the task's key, then send this. Read the key yourself too: you have the final say.

```text
Outcome:  The task I just did in this conversation, graded against
          its answer key, attached here: Passed or Missed for each
          of its checks.
Format:   A table: the check, Passed or Missed, the words in this
          conversation that show it, and one line on why. Then how
          many passed.
Inputs:   The task's answer key, attached in this conversation, only
          its checks, and this task's rows.
Autonomy: Grade only. Do not change my rows or suggest answers.
          With no words to quote, mark the check Missed. If a check
          is about what I did, ask me.
```

## Task 1. The 4D plan, before any run (10 minutes)

**Your question:** "Before the AI does this job alone, what must be written down, and when is each line done?"

**What you do:**

1. **Open your lab conversation.** On Claude, open a new chat, and send this:

   ```text
   Outcome:  My 4D plan for Brightline's monthly vendor-statement
             reconciliation, as a markdown page: a heading for each
             D, its lines, and a "When" on each line.
   Format:   Ask me about one D at a time, in this order:
             Delegation, Description, Discernment, Diligence. For
             each, ask one question that names what its lines must
             settle, and wait. Write my answer as that D's lines, in
             my words, with its "When". After the fourth, show me
             the whole page in one code block.
   Inputs:   My answers, and these meanings. Delegation: what the
             AI does alone, and what waits for a person.
             Description: what the run hands back, and how it
             behaves when the statement does not show something.
             Discernment: who checks the output, when, and against
             what. Diligence: what may go in, who is told that AI
             made it, and who signs. When: when the line is done,
             before the first run, after each run, or throughout.
   Autonomy: I decide every line. Never suggest one. If an answer
             has no "when", ask me for it.
   ```

2. Answer each question in a few words. The job above holds the policy lines you need.
3. Copy the page from its code block, paste it into a plain text editor, and save it as `4d-plan.md`, as in Lab 0.3.
4. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-4-key-task-1.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint:** your 4D plan has each D's lines with a "When" on each, it is saved as `4d-plan.md`, and every one of Task 1's checks has passed.

## Task 2. A behavior line that vanishes (8 minutes)

**Your question:** "Where must a line about the AI's behavior live, so that every run reads it?"

**What you do:**

1. In your lab conversation, send this:

   ```text
   Outcome:  Task 2's rows, added in this conversation under my
             plan: for each of three chats, where the behavior line
             was, and whether the answer guessed.
   Format:   For each reply I paste, show its first line. Then ask
             me once, "Did it guess a reason, or say the statement
             does not show one?", and record my answer. After the
             third, ask me once, "Where must a line about the AI's
             behavior live, so that a run nobody watches reads it?",
             and record my answer.
   Inputs:   The replies I paste, and my answers.
   Autonomy: I decide every answer. Never tell me which chat was
             right.
   ```

2. **The line in the message.** On either AI vendor, open a new chat, outside any project, and send this:

   ```text
   For this chat: explain each item in one line, and write "the
   statement does not show" instead of guessing a reason.
   A vendor's statement line reads "CM 1182, Credit: 4 pallets
   returned, 240.00". Why is this credit not in Brightline's
   register?
   ```

3. Copy the reply. In your lab conversation, send the line "Chat 1, the line in the message:" with the reply under it. Answer the AI's question.
4. **A new chat, without the line.** Open a second new chat, outside any project, and send only the last three lines of the message above, from "A vendor's statement line reads". Copy the reply. In your lab conversation, send the line "Chat 2, a new chat without the line:" with the reply under it. Answer the AI's question.
5. **The line in a project.** Make a project for the reconciliation, as 0.2 shows. On Claude, open Projects, then "+ New Project". On ChatGPT, choose "New project". Put your plan's Description lines in the project's instructions. Open a chat inside the project, and send the same three lines as step 4. Copy the reply. In your lab conversation, send the line "Chat 3, in the project:" with the reply under it. Answer the AI's question.
6. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-4-key-task-2.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint:** your three rows say where the behavior line was in each chat and whether its answer guessed, your project holds your Description lines, and every one of Task 2's checks has passed.

## Task 3. The run, read afterward (12 minutes)

**Your question:** "When nobody watched the run, how do I know its table is right?"

**What you do:**

1. **The run.** Open a new chat inside your project, on the same AI vendor as in Task 2. Attach `4d-plan.md` and `inputs.zip`, and send this:

   ```text
   Run this month's reconciliation for the attached statement,
   following the attached plan.
   ```

   Then send nothing else, and answer none of its questions. Nobody watches a run. When it stops, copy its whole reply.
2. **The next morning.** You are Dave now, reading at the set time your plan names. In your lab conversation, send this:

   ```text
   Outcome:  My review of the run, added in this conversation
             under my plan: each difference the run listed, the two
             I checked, the balances, and my verdict.
   Format:   When I paste the run's reply, list each difference it
             gives, with its amount and reason. Then ask me, one at
             a time: which two differences I checked, against which
             line of the statement or the register, and what I
             found, then whether its two balances match the files
             and its differences add up to the whole gap between
             them, then whether the run changed the register or
             wrote to the vendor, then my verdict, "accept" or
             "send back, because" with the line that is wrong.
   Inputs:   The run's reply, and my answers.
   Autonomy: I decide every answer and the verdict. Never say
             whether a difference is right.
   ```

3. Send the line "The run's reply:" with the run's reply under it.
4. Open `inputs.zip` on your computer. Check two of the run's differences against their own lines in the statement or the register, word for word and to the cent. Then check its two balances: the statement's balance due, and the open rows of the register, added up. Do the run's differences add up to the whole gap between them? Answer the AI's questions.
5. **Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-4-key-task-3.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint:** your review lists the run's differences, two checked against their lines, whether the run changed or contacted anything, and your verdict, and every one of Task 3's checks has passed.

## Apply it to your vertical (3 minutes)

Think of one job at your work that repeats, such as a weekly report. If an AI did it alone, which line would you write down first, and when would you read its output? Put nothing from work into this lab's accounts.

## If something goes wrong

- **The AI suggests your plan's lines.** Remind it of the brief's Autonomy line, and give your own answer.
- **The AI cannot open `inputs.zip`.** Unzip it on your computer, attach its three files instead, and send the message again.
- **The app will not attach `4d-plan.md`.** Rename the file `4d-plan.txt`, and attach that.
- **The run asks you a question.** Do not answer. A run that nobody watches gets no answers, so its output shows what the plan left out.
- **You cannot make a project.** A free account has room for a few. Delete a practice project you no longer need, or use the other AI vendor.
- **You reach a usage limit.** Free plans limit how much you can send, and ChatGPT's free plan allows three file uploads a day.[^openai-uploads] Wait until the limit resets, then go on from the step where you stopped. Your lab conversation keeps your rows.

[^openai-uploads]: Uploading files and audio to ChatGPT, OpenAI Help Center, verified 16 October 2026.
