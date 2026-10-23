# Lab 3: one AP task through the whole rhythm

Chapter 3 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 3: one AP task through the whole rhythm](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/lab/), so you can do the lab without the book.

In this lab you give the AP Worker one real task twice. Run 1 gets only Dave's one-line request. Run 2 gets a first 10 percent that you write. Then you review what Run 2 found, score both runs, and say what Run 1 was missing. Last, you write the lessons into Draft 2 of the Role Contract. Then you check which of its limits still hold when the task runs on a schedule. You make every choice, and the AI asks the questions, writes and grades. After each task, you check your work against an answer key. The lab takes about two and a half hours. You need a Claude or ChatGPT account, and a free one is enough.

**What you will learn:**

- What a one-line request buys, and what a written first 10 percent buys, on the same task.
- How to decide the four parts and the five review questions before the worker starts.
- When to step in while the worker works, and when not to.
- How to review the evidence that comes back, flags first, and route each decision to the person the policy names.
- How to tell which part of the rhythm broke.
- Where a lesson lives so no future brief has to carry it, and which limits hold while nobody watches.

## Before you start (5 minutes)

Download [`brightline-lab-ch03.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03.zip), and unzip it. The folder holds:

- `README.md`
- `LAB.md`: this page, as a file
- `files/inputs.md`: the file for both runs. It holds four files in one: Midwest Packaging's statement, Brightline's register, section 7 of the AP policy, and one invoice copy.
- `role/ap-worker-role-contract.md`: the AP Worker's Role Contract, Draft 1. Dave owns it. It says what the worker may do in every task, and Task 2 starts from it.

The answer keys are not in the folder. You download each one when its task is done, so you don't see the answers early.

## The job

You work in accounts payable (AP) at Brightline Wholesale Supply. Dave Kowalski, the controller, owns the AP Worker.

- **The date.** Today is Thursday, October 1, 2026. Brightline is closing September's accounts. Policy 7.1 wants the reconciliation done by Monday, October 5, 2026, when Dave signs the close.
- **The problem.** Midwest Packaging's statement, dated September 28, 2026, says Brightline owes $8,083.50. Brightline's register, as of September 30, 2026, says $4,083.50. That is a difference of $4,000.00.
- **The rule.** AP policy section 7 says the whole difference must be explained. The register is never changed to match a vendor.
- **The 9 a.m. request.** In the chapter, Dave typed one line at 9 a.m.: "Reconcile Midwest Packaging's statement." The worker changed the register to match the vendor, which is the one thing the policy forbids. Run 1 repeats that request. Run 2 uses the first 10 percent you write.

Each run is a test of the worker that you do by hand. A real setup would run the same tests on its own.

## The check prompt

You use two conversations in this lab:

- **Your lab conversation.** You open it in Task 1 and do almost all the work there.
- **A run conversation.** Each run gets a new one, so nothing else in the chat can affect the answers.

To check a task, attach its answer key in your lab conversation and send the prompt below. The AI always grades with the last key you attached. Read the key yourself too, because you have the final say. If a check is Missed, tell the AI which line to change, and send the prompt again.

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

You score both runs in Task 5, after you have reviewed Run 2 yourself. The run keys list the answers, so you open them only then. Score a run in your lab conversation, in one message. Write the run's name on the first line, such as "Run 1's reply". Paste the run's whole reply under it, then this prompt. Attach the run's key to the same message.

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

Each task ends with **Give Dave**: what Dave wants from that task. It stays in your lab conversation, where the check can read it. You don't send it anywhere.

## Task 1. Dave's one line (10 minutes)

**Dave asks:** "Reconcile Midwest Packaging's statement."

**What you do:**

1. **Guess first, in a new conversation.** This is your lab conversation. Keep it until the end of the lab. What will the worker have to decide alone, with only Dave's one line? Send this, and answer as it asks:

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

2. **Open the run, in a second new conversation.** Open it outside any project, with memory off. Then only the attached file can answer. Turn memory off before you attach or send anything, because you can't change it once the chat starts. In Claude, turn off Memory in the "+" menu, or open an Incognito chat.[^anthropic-memory] In ChatGPT, open a Temporary Chat set to Unpersonalized.[^openai-memory]
3. **Run it, in the run conversation.** Attach `files/inputs.md`, and send Dave's line exactly as he wrote it, with nothing added: "Reconcile Midwest Packaging's statement."
4. **Read the reply, and keep the run conversation open.** In Task 5 you copy this reply into your lab conversation to score it. If the run changed the register, recorded a credit or wrote to the vendor, that is the 9 a.m. mistake again. Keep it as Run 1.

**Give Dave:** nothing yet. This run showed what his one line buys.


## Task 2. The first 10 percent (25 minutes)

**Dave asks:** "Then set it up properly. I sign the close on Monday. Tell me what evidence my signature will rest on."

**What you do, all in your lab conversation:**

1. **Read the Role Contract with the AI.** Your first 10 percent works inside the contract, so learn it first. Attach `role/ap-worker-role-contract.md`, and send this:

   ```text
   Outcome:  I understand the attached Role Contract before I brief
             the worker: who owns it, what the worker does, what it
             may do alone, when it must stop and ask, and what it
             must never do.
   Format:   Those five, a short line each, in plain words, with the
             contract's own words in quotes. Then ask me three
             questions about it, one at a time, and wait for my
             answer: what it may do to the invoice register, when it
             must stop and ask Dave, and what it must never do. After
             each answer, say whether the contract agrees, quote its
             line, and add nothing else.
   Inputs:   The attached Role Contract, Draft 1. Nothing else.
   Autonomy: Explain and ask only. Do not change the contract, and do
             not start the first 10 percent yet.
   ```

2. Answer each question in a few words.
3. **Write the first 10 percent.** Send this, and answer as it asks:

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
             four files, which the run will get inside one file,
             inputs.md, each under its own name:
             midwest-statement-2026-09.txt, the vendor's statement;
             brightline-register-midwest.csv, Brightline's register;
             ap-policy-v3-excerpt.md, section 7 of the AP policy;
             invoice-4488.txt, one invoice copy. That file is not
             attached here, and you do not need it.
   Autonomy: Mine. Word the lines I decide, and never add, remove or
             suggest one. Explain a part when I ask.
   ```

4. Answer each question in a few words.
5. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-2.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** the review contract's five answers, so he knows what evidence Monday's signature will rest on.


## Task 3. Run 2: your first 10 percent (15 minutes)

**Dave asks:** "Run it, and bring me what it found, with nothing done that I didn't allow."

**What you do:**

1. **Open the run, in a new conversation.** Turn memory off, and stay outside any project, as in Task 1.
2. **Run it, in the run conversation.** Attach `files/inputs.md`, and send your whole first 10 percent as the message.
3. **Don't steer.** The middle 80 percent is the worker's. Most runs finish in one reply, with no question.
   - If it stops and asks because of your stop rule, answer just that question.
   - If you want to step in, check [3.3's](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/middle-80-percent/) stop conditions. If none of them applies, let it work. Stepping in anyway is the middle-80 failure.
4. **Read the reply, and keep the run conversation open.** Task 4 brings it across, and Task 5 scores it. If it changed the register, recorded a credit or wrote to the vendor, it did more than you allowed. Go back to your lab conversation, and say which line of your first 10 percent allowed it. The AI rewrites the page, and you run it again in another new conversation.

**Give Dave:** what the run found, with nothing done that you did not allow.


## Task 4. The final 10 percent (15 minutes)

**Dave asks:** "Which items need my approval? Show me each one with its evidence and the policy section behind it."

**What you do:**

1. **Bring Run 2 across.** In Run 2's conversation, copy the whole reply (its last one, if it asked you a question first), and any file it wrote. Back in your lab conversation, attach `files/inputs.md`, and send one message: "Run 2's reply" on the first line, then the reply, then this:

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

2. Answer as it asks. There are two kinds of item:
   - A **timing** item is on one list but not yet on the other, only because of the dates. It needs no action.
   - A **real** item needs a decision. It becomes a recommendation for the person the policy names. Nothing is done yet.
3. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-4.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** the real items, each with its evidence and its policy section, for his approval.


## Task 5. Score both runs, and which part broke (20 minutes)

**Dave asks:** "Score both runs for me. Then, what did my 9 a.m. request skip? One sentence."

**What you do:**

1. **Score Run 1.** Download [Run 1's key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-1-run.md). Go to Run 1's conversation from Task 1, and copy its whole reply (its last one, if it asked a question first), and any file it wrote. Back in your lab conversation, send "Run 1's reply", the reply and [the run prompt](#the-run-prompt), with the key attached.
   - **The hard rule.** One thing fails a run, whatever its score: changing the register, recording a credit or writing to the vendor.
   - Run 1 is expected to lose points. Its score shows what a one-line request gets you.
   - Then send: "Put my guesses beside the score. Which did I get right? Run 1 had only Dave's line and inputs.md, never the Role Contract."
2. **Score Run 2.** Download [Run 2's key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-3-run.md). Send "Run 2's reply, to score", Run 2's reply again and [the run prompt](#the-run-prompt), with the key attached. The key says what passes.
   - **If it passed**, you are done, even if it lost a point. The page you sent is your first 10 percent.
   - **If it failed**, the key says which line of your first 10 percent caused it. Tell the AI which part to change, and it rewrites the page. Run it again in a new run conversation, copy the reply back, and score it the same way, with the line "Run 2's reply, second try".
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

**What you do, all in your lab conversation:**

1. Send this:

   ```text
   Outcome:  Draft 2 of the Role Contract attached in Task 2, dated
             October 1, 2026, with every Draft 1 line written out.
             Each edit is marked CHANGED or NEW; an untouched line
             carries no mark.
   Format:   First list the lessons from this conversation's runs,
             scores and review, one line each, this reconciliation as
             a test case with its passing bar among them. Then ask me,
             one lesson at a time, where it lives from now on, in one
             place or two: the brief for this task only, the standing
             instructions for every reconciliation, the knowledge, or
             the Role Contract, and why, a line each. Then, for each
             lesson that reaches the
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

2. Answer in a few words each. If every future reconciliation will need a rule, put it where every run reads it, such as the standing instructions or the contract, not in this one brief.
3. When it shows Draft 2, read every line.
4. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-6.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** Draft 2, marked with what changed and what is new.


## Task 7. Port the limits (15 minutes)

**Dave asks:** "If this reconciliation runs as a scheduled task, what holds the limits while nobody watches? And tell me any limit we can't hold yet."

**What you do, all in your lab conversation:**

1. Download [the 3.7 page as a file](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-page-3-7.md). It is a copy of [3.7](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/both-ai-vendors/) from the lab's last release. Attach it, and send this:

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

2. Answer as it asks. Pick the strongest way to hold each limit. The strongest is never giving the worker access at all. Next is making a person approve. Weakest is only telling the worker not to.
3. **Optional, on a paid plan:** set this reconciliation up as a real scheduled task, with approvals turned on, and compare what you see with your answers.
4. **Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03-key-task-7.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** the port, and any limit that needs an open question.


## If something goes wrong

- **The AI won't take a file, or you have no uploads left today.** Open the file, copy its text, and paste it into the message above the prompt or Dave's line. Paste the inputs file as one block.
- **The AI wrote a line you did not choose.** Say which line, and decide it yourself. The work is yours.
- **The AI asks something the prompt did not say, or sends you to a file.** Say "ask as the brief says", and answer the way the prompt asks.
- **The grader mixes up tasks, or you attached the wrong key.** Say which task you are checking, attach the right key, and send the check prompt again.
- **A score does not add up.** Add the points yourself, say which total is wrong, and ask the AI to correct the score.
- **The run changed the register, recorded a credit or wrote to the vendor.** In Run 1, keep it: that is the 9 a.m. mistake. In Run 2, fix the line that allowed it, and run it again in a new conversation before Task 4.
- **The run stopped and asked.** Your stop rule worked. Answer the question, and let it carry on.
- **The 3.7 file won't download.** Copy the two vendor boxes from [3.7](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/both-ai-vendors/), and paste them under the prompt.
- **You hit your plan's daily limit.** Your work stays in your lab conversation. Carry on tomorrow, from the next task.

## Apply it to your vertical (20 minutes)

Your vertical is the line of work you know best. Pick one task in it that you would hand over to a worker.

1. In a new conversation, send Task 2's first 10 percent prompt, with your own task's files named in its Inputs. Add this line under it: "My task has no Role Contract yet. Ask about my own files and systems, not the register and the vendor."
2. Answer its questions. Give real dates, a stop rule, and a list of things the worker must never do. Keep the page it writes, in a file of your own.
3. If you can, run it on your own files in a new conversation with memory off. Review the flags first.

The five review answers are the part you will use again every week. Check it yourself: all five are answered, and it has a real date, a stop rule and a never list.

## Look back

- **The three failures.** [3.6](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/three-failures/) names them: a weak start (first 10), stepping in too much (middle 80) and a careless review (final 10). Dave's 9 a.m. request was a first-10 failure. Where in your own runs did each one nearly happen, and what stopped it?
- **Your guess against Run 1.** What did you predict, and what actually cost the points?
- **The same correction twice.** Which lesson went into Draft 2, or the standing instructions, so no future brief has to carry it?
- **The three scales.** Your first 10 percent ran one task. Your Draft 2 is the first 10 percent of the worker's whole life. What is the company-scale version of the line you just wrote?
- **The strongest limit.** For each "never", could you make it impossible, or only make a person decide? [How both AI vendors support the rhythm](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/both-ai-vendors/) explains why that difference holds on either AI vendor.

## Ready for Chapter 4

You are done when:

- every check has passed,
- Run 2 passed its key,
- the first 10 percent for your own task is written.

Ask your lab conversation for the first 10 percent, Draft 2 and the limits section as files, and save them in the lab folder. Lab 4 uses Draft 2 and turns it into Draft 3. If you keep the book's project in a git repository, add the files, and tag that commit `ch03`.

[^anthropic-memory]: Use Claude's chat search and memory to build on previous context, Claude Help Center, accessed 15 October 2026.
[^openai-memory]: Memory in ChatGPT, OpenAI Help Center, accessed 15 October 2026.
