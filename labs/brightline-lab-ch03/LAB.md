# Lab 03: One task through the whole rhythm

**Time:** about 2 hours of active work, plus the time the two runs take.
**You produce:** `briefs/statement-rec-first-ten.md`, `results/run-1-output.md`, `results/run-2-output.md`, a filled `results/rhythm-log.md` and `results/review-sheet.md`, Draft 2 of `role/ap-worker-role-contract.md`, a filled `results/authority-port.md`, and a first-10 sheet and review checklist for one task in your own vertical.
**You need:** this folder and a Claude or ChatGPT account. A free plan works for every part, including the port in Part H, which is done on paper. A paid plan also lets you run Run 2 as a task that you hand over and leave, rather than in a chat.

The task is real AP work: reconcile Midwest Packaging's September statement to Brightline's register. You run it twice, once with a one-line request and once with a full first 10 percent. Both runs get the same four files, including the policy. Run 1 relies on that policy and a minimal request. Run 2 makes the task's scope, authority, evidence and acceptance criteria explicit. Either run may succeed, so record what actually happens. Run 1 is safer than Dave's 9 a.m. run in the chapter: it sees the policy, it never sees the Role Contract that let his worker edit register rows, and a chat cannot change your files. So watch for what it adds, what it leaves out, and how long it takes you to check. Then you review both as the final 10 percent, before you see the answer key. The lab follows five moves: predict, run, investigate, modify, make. Part H, the port, is part of modify.

## Part A. Set up (5 minutes)

1. Unzip this folder anywhere. Everything the lab needs is inside it.
2. Read `inputs/ap-policy-v3-excerpt.md`. It is one page, and it is the rulebook for this task.
3. If you wrote a Role Contract in Chapter 2, copy your `role/ap-worker-role-contract.md` into `role/`. If not, copy `role/ap-worker-role-contract-draft1-sample.md` to `role/ap-worker-role-contract.md`.
4. Have a clock ready. You will time each part of each run.

## Part B. Predict (5 minutes)

1. Skim the statement and the register. Do not reconcile them yourself.
2. In `results/rhythm-log.md`, under **Predictions**, write what you expect a one-line request to return, what, if anything, you expect it to get wrong, and how long you expect each review to take.

## Part C. Run 1: skip the first 10 (10 minutes)

1. Open a new chat. Attach the four files in `inputs/`.
2. Paste the one line in `briefs/one-line-request.md`. Add nothing.
3. While it runs, do not steer. If it asks a question it needs to finish the work, give the shortest true answer. Do not reply to offers of more work.
4. In a chat, the worker cannot change your register file. If its reply presents an "updated" register, a recorded credit or a vendor reply as already done, treat that as an unauthorized action, exactly like a changed file. If it does none of these, record that too.
5. Save the full reply as `results/run-1-output.md`. Fill the Run 1 column of the rhythm log, except the last three rows.

## Part D. Run 2: write the first 10, then stay out of the middle (20 minutes)

1. Copy `briefs/first-ten-template.md` to `briefs/statement-rec-first-ten.md`.
2. Fill every field. Take no more than 12 minutes. Use the chapter's Concept 3.2 and the policy excerpt. For **Today**, write the lab's date, Thursday, October 1, 2026, whatever today's date is where you are. Two fields matter most: the stop rule, and the authority line that says this task changes nothing.
3. Open a new conversation. Attach the four files in `inputs/`. Paste your filled brief, without the two instruction lines under its title. On a paid plan you may run it as a task and leave it. Keep the files attached, and before you leave, ask it to list the four files it can see.
4. During the run, interrupt only if the worker asks you something or you see it working on the wrong vendor or month. Count every interruption in the log.
5. Save the full reply as `results/run-2-output.md`. Fill the Run 2 column of the rhythm log, except the last three rows.

## Part E. The final 10: review both runs (20 minutes)

Do not open `answer-key/` yet. Your review must stand on the evidence each run returned.

1. Work through `results/review-sheet.md` for Run 1, then for Run 2. Time each review.
2. For each run, decide: approve, fix in place, send back, or fix the brief. Write the decision in the rhythm log.
3. Note which review was faster, and why, and compare both runs with your Part B predictions. Write it under the table in the rhythm log. Report what actually happened, even if Run 1 did well.

## Part F. Investigate (15 minutes)

1. Now open `answer-key/reconciliation-answer-key.md`, `answer-key/run-rubric.md` and `answer-key/first-ten-example.md`.
2. Score both runs out of 10, including the rubric's deduction for figures, dates or claims a run added that you did not ask for. Judge every date against the lab's date, October 1, 2026. Write the scores in the rhythm log.
3. For every point lost, ask the chapter's three questions in order to find where to look first. Did the brief, contract or policy say it? Did the worker act against them? Was the problem visible in the evidence? More than one may apply. Fill the last table in the rhythm log.
4. Compare your Part E decisions with the scores. If you approved a run that failed the rubric, by scoring under 9 or by taking an unauthorized action, that is a final-10 failure, and the most useful thing this lab can show you.
5. Compare your brief with `answer-key/first-ten-example.md`. For each point Run 2 lost, find the line in the example that would have kept it.

## Part G. Modify: Draft 2 of the Role Contract (10 minutes)

The reconciliation exposed gaps in Draft 1. It gave the worker authority to update register rows, and it had no stop rule for an unexplained difference.

1. Open `role/ap-worker-role-contract.md`. Change the header to Draft 2, with the lab's date, October 1, 2026.
2. Add the reconciliation as a responsibility, and give it its own authority line: observe and recommend only.
3. Add the stop rule to Escalation, and route register corrections, credits and vendor contact to the Controller.
4. Add the September statement to Evaluations, with its passing score. Add the review checks Dave will use before he approves a register or a reconciliation.
5. Only now, compare with `answer-key/role-contract-draft2-example.md`.

## Part H. Port the authority line (15 minutes)

A limit written in the Role Contract is a statement. A product setting can enforce part of it. This part shows you which part, on each AI vendor. You do it on paper, from Concept 3.7, so you do not need either product's scheduled tasks.

1. Copy the reconciliation lines from your Draft 2 (authority, escalation, the stop rule) into `results/authority-port.md`.
2. Imagine Brightline runs this reconciliation every month as a scheduled task. For each limit, write how you would set it on Claude's scheduled tasks and on ChatGPT's scheduled tasks: what you would connect or not connect, and which approval setting you would use.
3. In the last column, mark each limit as one of the three kinds in the chapter's Figure 3.4: **impossible** (the task has no access path to do it), **person decides** (an approval step stops it until someone reviews it), or **brief and review** (it needs judgment, so the instructions and your final 10 hold it, with automated checks for any measurable part).
4. Answer the two questions at the bottom of the file. Then compare with `answer-key/authority-port-example.md`.

**Optional rerun.** If you have both AI vendors, run your Run 2 brief on the other one and fill the third column of the rhythm log. A good first 10 needs almost no change, because it names no product.

## Part I. Make: apply it to your vertical (15 minutes)

1. Choose one recurring task from a role you know well.
2. Copy `briefs/first-ten-template.md` to `briefs/my-task-first-ten.md` and fill it. For a recurring task, write Today as the date each run starts. Give it at least one stop rule and one "never automatically" line.
3. Write a five-line review checklist for its final 10, in the style of `results/review-sheet.md`, in `results/my-task-review.md`.
4. Note one way you might be tempted to micromanage its middle 80, and the first-10 line that removes the need.
