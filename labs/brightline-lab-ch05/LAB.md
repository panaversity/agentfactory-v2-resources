# Lab 05: One brief, two AI vendors

**Time:** about 110 minutes of active work.
**You produce:** `results/predictions.md`, `briefs/payment-run-brief-v1.md`, `results/run-log.md`, `results/comparison.md` (or `results/transfer-plan.md`), `results/iteration-log.md`, `briefs/payment-run-brief-v2.md`, and a Four-Part Brief for one task in a role you know.
**Where you work:** in this folder, with any text editor, such as Notepad or TextEdit. Only the runs in Parts B and D use chats with Claude and ChatGPT. Keep your briefs and answers in this folder, not in a chat: they are yours, and Chapter 9 puts your saved brief on a schedule. You can take one Part per sitting. Each Part ends with a file saved.
**With the desktop app:** you can also do the lab with the Claude or ChatGPT desktop app. Open this folder in the app, and ask it to read `LAB.md` and start. The ChatGPT desktop app does this on any ChatGPT plan. The Claude desktop app needs a paid Claude plan. The agent reads `AGENTS.md`, its brief: you write the brief and decide every answer, and it writes your answers down. The runs in Parts B and D still happen in fresh chats.
**You need:** for Run B, a Claude account on any plan that accepts file attachments. For Run C, a ChatGPT plan that includes Work, which OpenAI offers on eligible paid plans. With only free ChatGPT, do Run C in ordinary Chat and label it Chat, not Work. With only one AI vendor, fill `results/transfer-plan.md` instead of Run C.
**Before you start:** never paste real company data into these runs. Everything here is invented.

Open each file only when a step names it.

## Part A. Predict (10 minutes)

*Where:* In this folder.

1. Read the six files in `inputs/`.
2. Read `requests/dave-request.md` and `requests/maria-recipe.md`.
3. Fill `results/predictions.md`: which of the five planted problems will each one miss, and why?

*You save:* `results/predictions.md`.

## Part B. Run (35 minutes)

*Where:* In this folder, then in chats with Claude and ChatGPT.

Every run is a fresh chat that cannot see your own memory, so your memory does not change the test. In Claude, turn off Memory in the "+" menu as you start the chat. In ChatGPT, open a Temporary Chat and choose Unpersonalized before you send the first message. If ChatGPT does not offer Work in a Temporary Chat, use an ordinary chat for Run C. Before you start it, open Settings, then Personalization, then Memory, and turn memory off. Turn it back on after the lab. Write in `results/run-log.md` which way you did it.

1. **Run A (5 minutes).** In a fresh chat on either AI vendor, attach the six files in `inputs/` and send Dave's line exactly. Save what comes back as `results/run-a-reply.md`.
2. **Write your brief (15 minutes).** Copy `briefs/four-part-brief-template.md` to `briefs/payment-run-brief-v1.md` and fill all four parts. Mark each control. Do not look at the answer key.
3. **Run B (10 minutes).** In a fresh Claude chat, attach the six files in `inputs/` and send your brief. If the chat shows a permission setting, leave it on Manual. Save the reply as `results/run-b-reply.md`. Save every file it returns in `results/`, with `run-b-` at the start of its name.
4. **Run C (5 minutes to start).** In ChatGPT, choose Work, attach the same files, and send the same brief unchanged. If your brief names no destination for files, note where Work put them. Save the reply as `results/run-c-reply.md`. Save every file it returns in `results/`, with `run-c-` at the start of its name, so Run B's files are not overwritten.

Attach the same six files in all three runs, including the retired policy, so that only the request changes. Never attach `requests/`, `briefs/`, `results/` or `answer-key/`. Record the model and settings for every run in `results/run-log.md`. One run shows how a worker behaved once. It does not prove that every difference came from the brief.

*You save:* `briefs/payment-run-brief-v1.md`, and each run's reply and files in `results/`.

## Part C. Investigate (30 minutes)

*Where:* In this folder.

1. Score Runs A, B and C with `answer-key/run-rubric.md`. You may open the rubric now, but not the answer key.
2. Check the CSV by machine if you can: count its rows (15 expected) and add the amounts by action.
3. In `results/run-log.md`, list each failure and the part of the brief it came from: outcome, format, inputs or autonomy. If the brief was clear and the worker still failed, write "worker, not brief."
4. Fill `results/comparison.md`. End with one sentence about your brief, not about the AI vendors.
5. Now open `answer-key/payment-run-answer-key.md` and check your scoring.

Two results are possible, and both are fine. Run A may do better than you predicted. Record why: which part of the situation did the worker infer correctly? And your first brief may have no material failure. Record that, with what you checked.

*You save:* `results/run-log.md`, and `results/comparison.md` or `results/transfer-plan.md`.

## Part D. Modify (25 minutes)

*Where:* In this folder, then in a fresh chat.

1. Pick the worst failure in Run B or Run C. Change only the brief part behind it. Rerun in a fresh chat on one AI vendor, with your memory off as in Part B, and record the before and after in `results/iteration-log.md`. If there was no material failure, record that and move to step 2.
2. Split the brief into two stages, with a stop point after the exceptions list (Concept 5.4). Run Stage 1, make the decisions yourself as Maria, then run Stage 2. Save the replies as `results/stage-1-reply.md` and `results/stage-2-reply.md`.
3. Save the final brief as `briefs/payment-run-brief-v2.md`. Chapter 9 puts it on a schedule.

*You save:* `results/iteration-log.md` and `briefs/payment-run-brief-v2.md`.

## Part E. Make (10 minutes)

*Where:* On paper, or in a file of your own.

Write a Four-Part Brief for one recurring task in a role you know. Mark the controls, and name the governed source it must answer from.

*You save:* your own brief, as `briefs/my-own-brief.md`. The lab is not finished until it is saved, even after you pass the rubric.

## If something goes wrong

- **The worker asks which policy to use.** Good: your brief left it open. Answer, then add the answer to the brief.
- **No file came back.** Your format line named content, not a file. Name the file type and where it goes.
- **A file landed somewhere unexpected.** Your format line named no destination, so the AI vendor used its default. Name the destination, for example a CSV file to download, and the same brief works on both.
- **The worker converted the Canadian invoice.** Your autonomy line did not say what to do when the policy is silent.
- **A connected app does not work in a Temporary Chat.** A Temporary Chat set to Unpersonalized does not use plugins, such as connected apps. Ask for files to download instead.
- **Notepad saves your file as `.txt`.** In Save As, choose "All files" under the file type, then type the name with `.md` at the end, such as `payment-run-brief-v1.md`.
- **The assistant will not open a file.** Paste the file's text into the chat instead, with its file name on the first line.
- **You ran out of messages.** Record what you finished and mark the rest "not run." The lab still counts.
