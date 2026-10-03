# Lab: One portable brief, two runtimes

Chapter 1 build step, The AI Agent Factory, Second Edition.

In this lab you run one brief that names no vendor on one vendor, then port it to the other. You see where the work runs, where results are kept, and which changes belong to the runtime rather than to your brief. You also collect the raw material for the AP Worker's Role Contract, which you draft in Chapter 2.

**The scenario.** Brightline Wholesale Supply is a distributor in Columbus, Ohio, with about 40 staff. Its office manager receives 15 vendor invoices in September 2026 and needs a register of them for human review before the payment run. The invoices hide three traps: a duplicate bill, an arithmetic error, and two bills that only look like duplicates.

**Time.** About 75 minutes of active work, plus one wait of at least a day before Part F.

**What you need.** An account on at least one of the two vendors, Anthropic or OpenAI, that can attach files to agentic work, and a plain-text editor. No code and no starter repository.

**Which vendor first.** You can start on either. These steps use Claude first and ChatGPT Work second, as the book's example does. If you start on ChatGPT, swap the two: use `results/chatgpt.md` in Parts B to D and `results/claude.md` in Part E. With only one vendor, see "Two ways to finish" below.

**Rules for the whole lab.**

- Write each prediction before you run anything.
- Do not open the `answer-key` folder until you finish Part D.
- When a port needs a change, try a runtime setting before you change the brief, and log every change.
- Do not fix any output by hand. Record what happened.

## Part A. Set up (5 minutes, active)

1. Unzip this folder. The 15 invoices are in `invoices`.
2. Read the brief in `briefs/invoice-register.md`. It has four parts: outcome, format, inputs and autonomy. Chapter 5 teaches this Four-Part Brief in full.
3. Blank results records are in `results/claude.md` and `results/chatgpt.md`. Use the one for the vendor you run first.

## Part B. Predict (5 minutes, active)

In the results record for your first vendor, fill in the prediction lines. Will a one-line request get an answer or work? With the brief, where will the register be saved? Will the run catch the duplicate, catch the arithmetic error, and leave the two cleaning invoices alone?

## Part C. Run on your first vendor (15 minutes, active)

1. On Claude, open a new conversation. On ChatGPT, open a new chat. Attach the 15 invoice files and send only: "Summarize these invoices." Record what comes back. This is Maria's 2023 habit.
2. Start fresh for the brief. On Claude, open a second new conversation. On ChatGPT, start a ChatGPT Work task. Attach the 15 files again and paste the brief exactly. Keep the default permission settings. On Claude, the default is to ask before taking an action.
3. While it runs, watch the progress it shows. Answer any question it asks, but add no new instructions.
4. When it finishes, find the register it delivered. Record where it was saved, by name, and open it there.

## Part D. Investigate and score (10 minutes, active)

1. In the same conversation, ask: "Which files did you create that you did not deliver to me?" Record the answer. If the product cannot tell you, write "not established."
2. Fill in the rest of the brief-run section of your results record.
3. Now open `answer-key/answer-key.md` and `answer-key/scoring-rubric.md`. Score the run out of 10 and compare it with your predictions.

## Part E. Port to the other vendor (20 minutes, active)

1. Write fresh predictions in the other results record.
2. On the other vendor, start the same kind of run as in Part C step 2. Attach the same 15 files and paste the same brief, unchanged.
3. If the run cannot proceed, try a runtime setting first. Change the input packaging or the brief only if a setting cannot fix it. Make the smallest change that works.
4. Log every change in `briefs/invoice-register-port.md`. Mark each one as a brief change, a setting change or an input-packaging change, and say why it was needed.
5. Repeat Part C step 1 and all of Part D for this run. Score it too.

## Part F. Observe persistence (5 minutes now, 5 minutes after the wait)

This is an observation exercise. Any of the three results below is a valid finding.

1. On either vendor, open a new conversation. Attach the same 15 files again. Paste the brief without its last Format line, "Deliver the register as a spreadsheet file."
2. Let it finish. Record what it produced and where, if anywhere, it says the result was saved.
3. Wait at least one day. Then, for the Part C register, the Part F output and the summary text in each conversation, record one result in the persistence section of your results file:
   - **Still available**, and where you found it
   - **Unavailable**
   - **Not established**, if you cannot tell
4. Write one sentence on what your results show about where results are kept. The goal is to name the saved location, confirm you can retrieve from it, and note any retention or access rules you find, not to make anything disappear.

## Part G. Make (10 minutes, active)

Complete `role/ap-work-inventory.md`, which starts with one example row. List at least five recurring accounts-payable tasks at Brightline, such as matching invoices to purchase orders or preparing the weekly payment run. Mark which ones this lab's brief covers. If you use the starter repository, commit the folder with tag `ch01`.

## Two ways to finish

- **With both vendors.** Two scored results records, a port log of the actual port, a completed persistence check, and the work inventory.
- **With one vendor.** One scored results record with a completed persistence check. In the other results record, predictions only, with the score and persistence check marked "not run." A port log written as a prediction of what would change, marked "predicted." And the work inventory.

A strong run scores 9 or 10.

## If something goes wrong

- **The surface will not take 15 files.** Combine them into one file, `invoices-all.txt`, and change the Inputs line of the brief to name that file. Log both as one input-packaging change.
- **The merged Claude experience has not reached your plan.** Run the brief wherever your plan offers tasks, and record what you saw. That record is itself a lesson in Concept 1.6.
- **You have access to only one vendor.** Use the one-vendor path under "Two ways to finish."
- **A run scores low.** Do not fix the output by hand. Record which check failed and keep it for Chapter 6, which teaches the review contract.

The port log is the point of the lab. What changed in the port belongs to the runtime. What did not change is the specification, and the specification is yours.

**Apply it to your vertical.** Write one portable brief and one work inventory for a role in the work you know best.
