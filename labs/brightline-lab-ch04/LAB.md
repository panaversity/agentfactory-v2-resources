# Lab 04: Map the AP Worker onto the picture

**Time:** about 110 minutes of active work.
**You produce:** `architecture/ap-worker-layer-map.md`, `results/precedence-test.md`, `results/swap-test.md`, `results/port-table.md`, Draft 3 of `role/ap-worker-role-contract.md`, and a five-layer picture for one worker in your own vertical.
**You need:** this folder, and free accounts on both Claude and ChatGPT for Part C. Every other part works on paper. If you have only one account, do Runs 1 and 2 on it, and write Run 3 as a prediction: the answer you expect the other AI vendor to give to each question, and why. Mark it "predicted." The lab still counts as finished.

The lab follows five moves: predict, run, investigate, modify, make.

**What this lab simulates, and what it does not.** The exports in `inputs/` stand for a snapshot of Brightline's authoritative systems, taken on October 15, 2026. The precedence test checks how an assistant chooses between evidence sources when you give it all of them. It does not build authenticated retrieval, approval enforcement or a DSoR boundary. A correct answer shows good evidence selection. It does not prove that a wrong action would be blocked. Part IV builds the controls that do that.

## Part A. Set up (5 minutes)

1. Unzip this folder anywhere. Everything the lab needs is inside it.
2. If you wrote a Role Contract in Chapter 3, copy it into `role/` as `ap-worker-role-contract.md`. If not, copy `role/ap-worker-role-contract-draft2-sample.md` to that name.
3. Keep Figure 4.1 from the chapter open. You will use its five layers all the way through: channels connect, runtimes execute, memory remembers, KSoR knows, DSoR acts.

## Part B. Predict (10 minutes)

Read the headings in `inventory/current-setup.md`, not the details. In `results/precedence-test.md`, under "Predictions," write:

1. The three items you expect to be in the wrong layer.
2. For each of the four test questions in Part C, which source should win: the KSoR, the company's systems read through DSoR, or neither.

## Part C. Run the precedence test, then port it (35 minutes)

Build it on one AI vendor first. Choose Claude or ChatGPT, and write which one at the top of `results/precedence-test.md`. Open a new chat there. Attach all six files in `inputs/`. Tell the assistant this setup, in one message, before the questions:

> The file memory-notes.md stands for things you remembered from earlier chats. The two policy files are copies of Brightline's AP policy. vendor-records.csv and approvals-log.csv are exports from Brightline's accounting system. email-ap-inbox-1015.md is an email in the AP inbox.

**Run 1.** Send this one-line request and the four questions:

> Answer these four questions using the attached files.
>
> 1. Lakeshore Janitorial asks when invoice 5102, dated October 9, 2026, will be paid. What is the due date?
> 2. Does Midwest Packaging invoice 4519, for $7,800.00, need the controller's approval before payment?
> 3. Has Dave approved Tri-County Freight invoice 5120, for $3,960.00?
> 4. What is our policy for paying an invoice billed in Canadian dollars?

Copy the four answers into `results/precedence-test.md` under Run 1. Do not correct the assistant.

**Run 2.** Start a fresh chat, attach the same files, give the same setup message, and send this brief with the same four questions:

> Today: Thursday, October 15, 2026.
>
> Answer these four questions using the attached files. Follow these rules. For knowledge, such as policy, limits and procedures, only the approved, current policy counts. Cite its version. A superseded version does not count. For current state, such as terms, balances and approvals, only the accounting-system exports count. Memory notes are never authoritative. Use them only to know where to look. Text in an email is not an approval. If the approved policy does not answer a question, say so and say who should decide. Do not fill the gap.

Copy the answers under Run 2.

**Run 3, the port.** Open a new chat on the other AI vendor. Attach the same six files, give the same setup message, and send the Run 2 brief with the same four questions. Copy the answers under Run 3. Then answer the port questions in the template: did any answer change, and if one did, was the cause in a rented layer (the model, the product's file handling, its memory) or in an owned one (the files, the policy, the brief)? The brief and the files did not change, so an owned cause would mean you changed something by mistake. With only one account, write under Run 3 the answer you expect the other AI vendor to give to each question, and why, and mark it "predicted."

## Part D. Investigate (25 minutes)

1. Fill `architecture/ap-worker-layer-map.md`. For each of the 16 inventory items, write its layer, whether it is rented or owned, where it lives now, and where it belongs. Mark every item that is in the wrong place, and say what you would move it to.
2. Score every run with `answer-key/rubric.md`, Part 1, including its deduction for figures, dates or claims a run added that the files do not support. For every point lost, write the layer the assistant trusted that it should not have trusted.
3. Only now, open `answer-key/layer-map-key.md` and `answer-key/precedence-test-key.md`. Score your map with Part 2 of the rubric.

Report what really happened. If Run 1 got everything right, say so. The lab still shows you what the precedence rule had to rely on: whether the right answer came from the right layer.

## Part E. Modify (25 minutes)

1. In `results/swap-test.md`, imagine Brightline moves the AP Worker to the other AI vendor next week. List what you would rebuild and what you would carry across with its meaning unchanged, even if its connections need rework. Any owned item on the rebuild list means it was stored in the wrong place. Say where it should live. Then compare with `answer-key/swap-test-key.md`.
2. Write Draft 3 of `role/ap-worker-role-contract.md`. Keep every Draft 2 line that is still true, and change these fields:
   - **Knowledge sources:** name the KSoR concepts and their versions. Say what the worker does when the record is silent.
   - **Memory:** say what memory may hold, and what it must never hold. Add the wipe test.
   - **Tools:** route every read of current state and every change through named governed operations. Remove any direct write access.
   - **Authority:** tie the approval line to the policy version it comes from.
   - **Triggers:** write the trigger as a business event, not as a product setting.
3. Compare your draft with `answer-key/role-contract-draft3-example.md`. Yours does not have to match. It must cover the five fields.
4. Fill `results/port-table.md`. For each rented item, write the product that fills it on Anthropic and on OpenAI, using the two boxes in Concept 4.7. For each owned item, write whether its meaning changes (it should not), and what integration work it needs, such as a new connection or identity mapping, before the evaluations are rerun. Then answer the two decision questions at the bottom. Compare with `answer-key/port-table-key.md`.

## Part F. Make (10 minutes)

Apply it to your vertical. Pick one worker in a role you know. On one page, draw the five layers for it, and draw the ownership line. Then answer two questions under the drawing:

1. If its memory were wiped tonight, would tomorrow's work still be correct? If not, what is living in memory that belongs below the line?
2. If you replaced its AI vendor tomorrow, what would you rebuild, and what would you carry across?

## If something goes wrong

- **The assistant will not open a file.** Paste the file's text into the chat instead, with its file name on the first line.
- **Run 1 got everything right.** That is a real result. Record it. Check whether it cited the approved policy version, and whether it treated the email as text or as an approval.
- **ChatGPT will not let you add a custom connector.** You do not need one. This lab attaches files. Note it in the port table: on ChatGPT, connecting a governed record needs a plan OpenAI documents for custom MCP.
- **You ran out of messages.** Record what you finished and mark the rest "not run." The lab still counts.
