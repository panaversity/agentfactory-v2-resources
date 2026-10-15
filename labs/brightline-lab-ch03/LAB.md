# Lab 3: one AP task through the whole rhythm

Chapter 3 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 3: one AP task through the whole rhythm](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/lab/), so you can do the lab without the book.

In this lab you run one real AP task through the whole rhythm, twice. Run 1 uses Dave's one-line request. Run 2 uses a first 10 percent you decide, line by line. Then you review Run 2's evidence as the final 10, score both runs, name which part of the rhythm Run 1 skipped, put the lessons where they last, in Draft 2 of the Role Contract, and port its limits to each AI vendor's scheduled tasks. You decide every line, and the AI asks, writes and grades. Each task is checked against its own answer key the moment it is done. It takes about two and a half hours, and on a free plan it can spread over days: your lab conversation keeps everything. You need a Claude or ChatGPT account.

**What you will learn:**

- What a one-line request buys, and what a written first 10 percent buys, on the same task.
- How to decide the four parts and the five review questions before the worker starts.
- When to step in while the worker works, and when not to.
- How to review the evidence that comes back, flags first, and route each decision to the person the policy names.
- How to tell which part of the rhythm broke.
- Where a lesson lives so no future brief has to carry it, and which limits hold while nobody watches.

## Before you start (5 minutes)

Download [`brightline-lab-ch03.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03.zip), and unzip it. You get one folder with these things:

- `README.md`
- `LAB.md`: this page, as a file
- `files/inputs.md`: the one file every run attaches, holding four files under their names, Midwest Packaging's statement, Brightline's register, section 7 of the AP policy, and one invoice copy
- `role/`: a sample Draft 1 of the Role Contract for anyone who skipped Chapter 2

The answer keys are not in it: each task downloads its own, so you meet none early. You need your Role Contract from Chapter 2: Task 2 attaches it, and Task 6 makes it Draft 2. If you start here, the sample stands in.

## The job

- You work in accounts payable (AP) at Brightline Wholesale Supply, and Dave Kowalski, the controller, owns the AP Worker.
- Today is Thursday, October 1, 2026. Brightline is closing September's accounts. Policy 7.1 wants the reconciliation by the third business day after month end: Monday, October 5, 2026, when Dave signs the close.
- Midwest Packaging's statement, dated September 28, 2026, says Brightline owes $8,083.50. Brightline's register, as of September 30, 2026, says $4,083.50.
- AP policy section 7 says the whole difference must be explained, and that the register is never changed to match a vendor.
- Two runs test it. Run 1 gives the worker Dave's one line and the files. Run 2 gives it the first 10 percent you decided. Both are evaluations done by hand: a real runtime runs them as test cases.

## The check prompt

One prompt checks every task. In your lab conversation, the one Task 1 opens, attach the task's key, then send this. Read the key yourself too: you have the final say. Missed a check? Tell it which line changes, and send the prompt again. The keys pile up there, and the grader uses the newest.

```text
Outcome:  The task I just did in this conversation, graded against
          the newest answer key attached: Passed or Missed for each
          of its checks.
Format:   A table: the check, Passed or Missed, the words in this
          conversation that show it, and one line on why. Then how
          many passed.
Inputs:   The newest answer key attached in this conversation, only
          its checks, and this task's work in this conversation.
Autonomy: Grade only. Do not rewrite the work, and do not suggest
          new lines. With no words to quote, mark the check Missed.
```

## The run prompt

One prompt scores every run, in your lab conversation, in Task 5, after your review: no key that lists the answers is read before the final 10 percent is done. Paste the run's whole reply there, with its name on the line above it. Attach that run's key, and send this under the paste, all in one message. Read the key yourself too.

```text
Outcome:  The run reply pasted in this message, scored against the
          attached answer key: the points out of 10, the deductions,
          and pass or fail where the key sets a bar.
Format:   A table: each scored line, the points, and the reply's
          words or rows that show it. Then each deduction with its
          reason. Then the score, shown as the table's sum less the
          deductions, and the verdict.
Inputs:   The run reply in this message, and the attached answer
          key, including its deductions.
Autonomy: Score only. Do not redo the reconciliation, and grade
          nothing but that reply.
```

**Give Dave**, under each task, names the lines Dave asked for, which the task's work leaves in your lab conversation. Nothing is sent anywhere, and the check reads them there.

## Task 1. Dave's one line (10 minutes)

**Dave asks:** "Reconcile Midwest Packaging's statement."

**What you do:**

1. **Guess first.** Open a new conversation, your lab conversation: the whole lab runs in it, except the runs, which each get a fresh one. Send this, and answer as it asks:

   ```text
   Outcome:  My guesses, before Run 1: what Dave's one line leaves
             the worker to decide alone, and what I expect the
             worker will do about each.
   Format:   Ask me for one guess at a time, "What does the line not
             tell the worker, and what will it do about that?", and
             wait for my answer, a line each, until I say that is
             all. Write each as one line, and show the list.
   Inputs:   Dave's line, "Reconcile Midwest Packaging's statement.",
             and my answers. You have no files.
   Autonomy: Mine: write my guesses as I give them, and add none.
   ```

2. **Open the run.** Open a fresh conversation for the run, outside any project, with memory off, so only the attached file can answer. Turn memory off before you attach or send anything: once a chat starts, that setting is locked. In Claude, turn off Memory in the "+" menu, or open an Incognito chat.[^anthropic-memory] In ChatGPT, open a Temporary Chat set to Unpersonalized, so it reads no memory.[^openai-memory]
3. **Run it.** Attach `files/inputs.md`, and send Dave's line, exactly as he said it, and nothing else: this run is his 9 a.m. request, re-lived.
4. **Read what came back**, and leave the conversation as it is: Task 5 scores it. If the run changed the register, recorded the credit or wrote to the vendor, that is the 9 a.m. failure, re-lived, and it stands as Run 1.

**Give Dave:** nothing yet. This run showed what his one line buys.


## Task 2. The first 10 percent (25 minutes)

**Dave asks:** "Then set it up properly. I sign the close on Monday. Tell me what evidence my signature will rest on."

**What you do:**

1. In your lab conversation, attach your Role Contract from Chapter 2, or the sample, and send this. Answer as it asks:

   ```text
   Outcome:  The first 10 percent for this reconciliation, one page,
             written so the worker could do the job if I were
             unreachable for the whole run: Intent, Scope, Authority
             for this task, the Review contract's five answers, and
             the Format I want back.
   Format:   Ask me one part at a time, and wait for my answer, a
             line each. Intent: the outcome in one sentence, and why,
             by when. Scope: the date the worker treats as today, what
             is in and as of which dates, what is out, and each input
             file with what it is the authority for. Authority for
             this task: show me the
             attached Role Contract's Authority lines first, then ask
             which level each of these gets, observe, recommend,
             draft, execute or escalate: the four files, the register,
             reconciling items and corrections, the vendor; and
             whether this is narrower than the contract. Review
             contract: what must be checked, what evidence comes
             back, what counts as success, what makes the worker stop
             and ask, what must never happen automatically. Format:
             the shape of the answer I will review, and what comes
             first. Write each part from my answers, and show the
             whole page at the end.
   Inputs:   My answers, the attached Role Contract, and the run's
             four files by name:
             midwest-statement-2026-09.txt, the vendor's statement;
             brightline-register-midwest.csv, Brightline's register;
             ap-policy-v3-excerpt.md, section 7 of the AP policy;
             invoice-4488.txt, one invoice copy.
   Autonomy: Mine. Word the lines I decide, and never add, remove or
             suggest one. Explain a part when I ask.
   ```

2. Answer each question in a few words.
3. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-2.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** the review contract's five answers, so he knows what evidence Monday's signature will rest on.


## Task 3. Run 2: your first 10 percent (15 minutes)

**Dave asks:** "Run it, and bring me what it found, with nothing done that I didn't allow."

**What you do:**

1. **Open the run.** A fresh conversation with memory off, outside any project, as in Task 1.
2. **Run it.** Attach `files/inputs.md`, and send your first 10 percent, the whole page, as the message. The middle 80 is the worker's: do not steer. Most runs finish in one reply with no question. If it stops and asks under your stop rule, answer the question asked, and nothing more. Note each moment you want to steer, and ask yourself which of [3.3's](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/middle-80-percent/) stop conditions applies: when none does, that urge is the middle-80 failure, so let it work.
3. **Read what came back**, and leave the conversation as it is: Task 5 scores it. If it changed the register, recorded the credit or wrote to the vendor, it acted beyond the authority you gave it. Tell your lab conversation which line of the first 10 percent allowed that, it rewrites the page, and you run again, fresh.

**Give Dave:** what the run found, with nothing done that you did not allow.


## Task 4. The final 10 percent (15 minutes)

**Dave asks:** "Which items need my approval? Show me each one with its evidence and the policy section behind it."

**What you do:**

1. **Bring Run 2 across.** Copy the run's whole reply, and any file it wrote: nothing crosses from its conversation on its own. In your lab conversation, attach `files/inputs.md`, and send one message. Its first line is "Run 2's reply", then the reply, then this:

   ```text
   Outcome:  My review of Run 2, in the chapter's order: the flags,
             then every reconciling item decided, then the one
             number, then the list for Dave's approval: each real
             item with its evidence and the policy section behind
             it, as a recommendation he approves, nothing done yet.
   Format:   First show me Run 2's flags and open questions, if any,
             and ask whether each needs a decision now. Then one item
             at a time: the run's line for it, and under it the
             statement line, register row or invoice line it cites,
             quoted from the attached file, then one question,
             "Timing or real, and if real, who decides it, under
             which policy section?" Wait for my one-line answer, and
             record it. Then the one number: do the items add up to
             the whole difference, 4,000.00? Show the sum and ask me
             whether it passes. At the end show the approval list.
   Inputs:   Run 2's reply pasted above, the attached file, with
             policy section 7 in it, and my answers.
   Autonomy: Mine: I decide every item. Quote the file exactly, and
             never decide an item for me.
   ```

2. Answer as it asks. A timing item is on the statement or the register but not yet on both, only because of the dates, and needs no action. A real item becomes a recommendation routed to the person the policy names, nothing done yet.
3. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-4.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** the real items, each with its evidence and its policy section, for his approval.


## Task 5. Score both runs, and which part broke (20 minutes)

**Dave asks:** "Score both runs for me. Then, what did my 9 a.m. request skip? One sentence."

**What you do:**

1. **Score Run 1.** Download [Run 1's key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-1-run.md), one click. Its hard rule: a run that changed the register, recorded the credit or wrote to the vendor fails, whatever its score. Copy Run 1's whole reply from its conversation, and any file it wrote. In your lab conversation, attach the key, and send one message: the line "Run 1's reply", then the reply, then [the run prompt](#the-run-prompt). Read the score, and the key yourself. Then send: "Put my guesses beside the score. Which did I get right?" A point lost here is the measurement, not a mistake.
2. **Score Run 2.** Download [Run 2's key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-3-run.md), one click. Attach it, and send one message: the line "Run 2's reply, to score", then Run 2's reply again, then [the run prompt](#the-run-prompt). The key says what passes. If it failed, a lost point usually comes from one line of the first 10 percent, and the key says which: tell your lab conversation which part changes, it rewrites the page, and you run again, fresh, and score that reply the same way, with "Run 2's reply, second try" as its line. A passing run is done, with or without a point lost. The page that passed is your first 10 percent.
3. **Which part broke.** Send this:

   ```text
   Outcome:  For each point Run 1 lost, and each deduction, the part
             of the rhythm that owed it, found with the chapter's
             three questions in order; then one sentence for Dave on
             what his 9 a.m. request skipped.
   Format:   One lost point or deduction at a time, from Run 1's
             score in this conversation: the run's own words, then
             three questions, one at a time, each answered in a word
             or a line: "Did the brief, the contract or the policy
             say it?", "Did the worker act against them?", "Was the
             problem visible in the evidence?" Then ask which part
             that points to, the first 10, the middle 80 or the final
             10, and write the diagnosis as one line from my answers.
             If Run 1 lost nothing, ask instead what carried the
             policy to the worker, and what Dave's line still never
             gave it. At the end ask me for Dave's sentence, and show
             it all.
   Inputs:   Run 1's reply and score in this conversation, and my
             answers.
   Autonomy: Mine: I answer every question, and you write the lines.
   ```

4. Answer as it asks.
5. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-5.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** both scores, and one sentence on which part of the rhythm his 9 a.m. request skipped.


## Task 6. Draft 2 of the Role Contract (15 minutes)

**Dave asks:** "Put what we learned where it lasts. I don't want to write these rules into every brief. Mark what changed and what is new."

**What you do:**

1. In your lab conversation, send this:

   ```text
   Outcome:  Draft 2 of the Role Contract attached in Task 2, dated
             October 1, 2026, with every Draft 1 line written out,
             and the sample's note at the top left out if it is the
             sample. Each edit is marked CHANGED or NEW; an untouched
             line carries no mark.
   Format:   First list the lessons from this conversation's runs,
             scores and review, one line each, this reconciliation as
             a test case with its passing bar among them. Then ask me,
             one
             lesson at a time, where it lives from now on: the brief
             for this task only, the standing instructions for every
             reconciliation, the knowledge, or the Role Contract, and
             why, a line each. Then, for each lesson that reaches the
             contract, show me the Draft 1 lines of the field it
             changes, Authority, Escalation, Evaluations or Open
             questions, and ask whether a Draft 1 line narrows, and
             how, or a new line is added. For each lesson
             that reaches the standing instructions, ask for its line
             too: they go in a new block after the contract,
             "Standing instructions: statement reconciliation", marked
             NEW. Then ask how often Dave reviews this contract, and
             write the answer as a NEW line: under Open questions if
             it is still a question, beside the Owner line if it is
             settled. Then show me the whole draft.
   Inputs:   The Role Contract attached in Task 2, the runs, scores
             and review in this conversation, and my answers.
   Autonomy: Mine, as in Task 2: you word the lines I decide, and
             never add, remove or suggest one.
   ```

2. Answer in a few words each. A line every future reconciliation would need belongs where every run reads it, not in one brief.
3. When it shows Draft 2, read every line.
4. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-6.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** Draft 2, marked with what changed and what is new.


## Task 7. Port the limits (15 minutes)

**Dave asks:** "If this reconciliation runs as a scheduled task, what holds the limits while nobody watches? And tell me any limit we can't hold yet."

**What you do:**

1. Download [the 3.7 page as a file](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-page-3-7.md), one click: a copy taken when the lab was last released, and [3.7](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/both-ai-vendors/) itself is the live page. In your lab conversation, attach it, and send this:

   ```text
   Outcome:  A "Scheduled-task limits" section for the end of Draft
             2: for each limit in Draft 2 that a scheduled
             reconciliation could break, a "never" line or an
             escalation line alike, the register, a credit and the
             vendor at the least, how it is held on Claude and on
             ChatGPT as a scheduled task, and the strength it
             reaches, one for each part of a line that has two:
             impossible, a person decides, or written and reviewed.
             Then, for the two rules that need judgment,
             stopping when a difference cannot be explained, and
             recommending rather than deciding, where each lives and
             which measurable part a setup could check automatically.
             Then when Dave reads the results and checks for a paused
             or missing run. Then any limit we cannot hold yet, as an
             open question.
   Format:   First show me every line of Draft 2's Authority and
             Escalation, numbered, and ask me which ones a scheduled
             reconciliation could break: I name them. Then one of
             those at a time: show it, then what the attached page
             says
             each AI vendor offers for it, quoted, and ask me three
             things, a line each: on Claude, on ChatGPT, and the
             strength. Then the two judgment rules, one at a time:
             where it lives, and its measurable part. Then the review
             times. Then the open questions. Write each line from my
             answers, and show the section at the end.
   Inputs:   Draft 2 in this conversation, the attached page, and my
             answers.
   Autonomy: Products and settings come only from the attached page,
             never from what you know of the AI vendors. Every other
             line is mine.
   ```

2. Answer as it asks. Start from the strongest limit: access never granted beats an approval, and an approval beats an instruction.
3. Optional, on a paid plan: set this reconciliation up as a real scheduled task, with its approval mode on, and check what you see against your port.
4. **Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-7.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** the port, and any limit that needs an open question.


## If something goes wrong

- **The AI will not take an answer key, or your plan's uploads ran out.** Open the key, copy its text, and paste it under the prompt instead.
- **The AI wrote a line you did not choose.** Say which line, and decide it yourself: the page is yours.
- **The AI asks something the brief did not say, or sends you to a file.** Say "ask as the brief says", and answer in the brief's shape.
- **The grader mixes tasks' checks, or you attached the wrong key.** Say which task you are checking, attach the right one, and send the check prompt again.
- **A conversation will not take a file, or your plan's uploads ran out.** Open the file and paste its text into the message, above the brief or Dave's line. The inputs file pastes as one block.
- **The run changed the register, recorded the credit or wrote to the vendor.** It acted beyond the authority it was given. In Run 1 that is the 9 a.m. failure, and it stands. In Run 2, fix the line that allowed it, and run again fresh, before Task 4 reviews it.
- **The run stopped and asked.** That is your stop rule working. Answer the question asked, and let it continue.
- **The 3.7 copy would not download, or you want today's page.** Copy the two vendor boxes from [3.7](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/both-ai-vendors/) and paste them under the brief.
- **Your plan's daily limit ran out.** Your lab conversation keeps everything. Carry on tomorrow, from the next task.

## Apply it to your vertical (20 minutes)

Your vertical is the line of work you know best. Pick one task in it that you would hand over. In a fresh conversation, send Task 2's brief with your task's files named in its Inputs, answer its questions with real dates, a stop rule and a never list, and keep the page it writes. If you can, run it on your own files in a fresh conversation with memory off, and review the evidence flags first. The five answers are the part your vertical will reuse every week. Check it yourself: all five answered, a real date, a stop rule, and a never list.

## Look back

- **The three failures.** Dave's 9 a.m. was a first-10 failure. Where in your own runs did each failure try to happen, and what stopped it?
- **Your guess against Run 1.** What did you predict, and what actually cost the points?
- **The same correction twice.** Which lesson went into Draft 2, or the standing instructions, so no future brief has to carry it?
- **The three scales.** Your first 10 percent ran one task. Your Draft 2 is the first 10 percent of the worker's whole life. What is the company-scale version of the line you just wrote?
- **The strongest limit.** For each "never", could you make it impossible, or only make a person decide? [How both AI vendors support the rhythm](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/both-ai-vendors/) explains why that difference holds on either AI vendor.

## Ready for Chapter 4

Your work is ready when every check has passed, Run 2 passed its key, and your vertical's first 10 percent is written. Ask your lab conversation for the first 10 percent, Draft 2 and the port as files, and keep them in the lab folder: Lab 4 attaches Draft 2, and makes it Draft 3. If you keep the book's running project in a git repository, add the folder's files, and tag that commit `ch03`.

[^anthropic-memory]: Use Claude's chat search and memory to build on previous context, Claude Help Center, accessed 15 October 2026.
[^openai-memory]: Memory in ChatGPT, OpenAI Help Center, accessed 15 October 2026.
