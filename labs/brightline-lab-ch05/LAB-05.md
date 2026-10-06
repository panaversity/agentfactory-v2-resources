# Lab 05: one brief, two vendors

**Time:** about 110 minutes of active work.
**You need:** a Claude account on any plan that accepts file attachments. For Run C, a ChatGPT plan that includes Work, which OpenAI offers on eligible paid plans. With only free ChatGPT, run C in ordinary Chat and label it Chat, not Work. With one vendor only, fill `results/transfer-plan.md` instead of Run C.
**Before you start:** never paste real company data into these runs. Everything here is invented.

## Part A. Predict (10 minutes)
1. Read the six files in `inputs/`.
2. Read `requests/dave-request.md` and `requests/maria-recipe.md`.
3. Fill `results/predictions.md`: which of the five planted problems will each miss, and why?

## Part B. Run (35 minutes)
1. **Run A (5 minutes).** In a fresh chat on either vendor, attach the six files in `inputs/` and send Dave's line exactly. Save what comes back.
2. **Write your brief (15 minutes).** Copy `briefs/four-part-brief-template.md` to `briefs/payment-run-brief-v1.md` and fill all four parts. Mark each control. Do not look at the answer key.
3. **Run B (10 minutes).** In a fresh Claude conversation, attach the six files in `inputs/` and send your brief. Leave the permission setting on Manual. Save every file it returns.
4. **Run C (5 minutes to start).** In ChatGPT, choose Work, attach the same files, and send the same brief unchanged. If your brief names no destination for files, note where Work put them. Save everything.

Attach the same six files in all three runs, including the retired policy, so that only the request changes. Never attach `requests/`, `briefs/`, `results/` or `answer-key/`. Record the model and settings for every run. One run shows how a worker behaved once. It does not prove that every difference came from the brief.

## Part C. Investigate (30 minutes)
1. Score Runs A, B and C with `answer-key/run-rubric.md`. You may open the rubric now, but not the answer key.
2. Check the CSV by machine if you can: count its rows (15 expected) and add the amounts by action.
3. In `results/run-log.md`, list each failure and the part of the brief it came from: outcome, format, inputs or autonomy. If the brief was clear and the worker still failed, write "worker, not brief."
4. Fill `results/comparison.md`. End with one sentence about your brief, not about the vendors.
5. Now open `answer-key/payment-run-answer-key.md` and check your scoring.

Two results are possible and both are fine. Run A may do better than you predicted. Record why: which part of the situation did the worker infer correctly? And your first brief may have no material failure. Record that, with what you checked.

## Part D. Modify (25 minutes)
1. Pick the worst failure in Run B or Run C. Change only the brief part behind it. Rerun in a fresh conversation on one vendor and record the before and after in `results/iteration-log.md`. If there was no material failure, record that and move to step 2.
2. Split the brief into two stages, with a stop point after the exceptions list (Concept 5.4). Run Stage 1, make the decisions yourself as Maria, then run Stage 2.
3. Save the final brief as `briefs/payment-run-brief-v2.md`. Chapter 9 puts it on a schedule.

## Part E. Make (10 minutes)
Write a Four-Part Brief for one recurring task in a role you know. Mark the controls, and name the governed source it must answer from.

## Troubleshooting
- **The worker asks which policy to use.** Good: your brief left it open. Answer, then add the answer to the brief.
- **No file came back.** Your format line named content, not a file. Name the file type and where it goes.
- **A file landed somewhere unexpected.** Your format line named no destination, so the vendor used its default. Name the destination, for example a Google Sheet in a named folder, and the same brief works on both.
- **The worker converted the Canadian invoice.** Your autonomy line did not say what to do when the policy is silent.
