# Lab 04: Map the AP Worker onto the picture

**Time:** about 2 hours of active work.
**You produce:** `architecture/ap-worker-layer-map.md`, `results/precedence-test.md`, `results/swap-test.md`, `results/port-table.md`, Draft 3 of `role/ap-worker-role-contract.md`, and a five-layer picture and a refined Role Contract for one worker in your own vertical.
**Where you work:** in this folder, with any text editor, such as Notepad or TextEdit. Only Part C uses a chat with Claude or ChatGPT, in your browser. Keep your answers in this folder, not in a chat: they are yours, and Chapter 5 builds on them. You can take one Part per sitting. Each Part ends with a file saved.
**With the desktop app:** you can also do the lab with the Claude or ChatGPT desktop app. Open this folder in the app, and ask it to read `LAB.md` and start. The ChatGPT desktop app does this on any ChatGPT plan. The Claude desktop app needs a paid Claude plan. The agent reads `AGENTS.md`, its brief: you decide every answer, and it writes them down. The test runs in Part C still happen in fresh chats.
**You need:** this folder, and free accounts on both Claude and ChatGPT for Part C. Every other part works on paper. If you have only one account, do Runs 1 and 2 on it. Then write Run 3 as a prediction: the answer you expect the other AI vendor to give to each question, and why. Mark it "predicted." The lab still counts as finished.

The lab follows five moves: predict, run, investigate, modify, make.

**What this lab simulates, and what it does not.** The exports in `inputs/` stand for a snapshot of Brightline's authoritative systems, taken on October 15, 2026. The precedence test runs twice. Run 1 gives the assistant only what Brightline's worker could reach that week. Run 2 gives it every source in its layer, with the precedence rule. Together they show how an assistant chooses between evidence sources, and what changes when each source is in its layer. It does not build authenticated retrieval, approval enforcement or a DSoR boundary. A correct answer shows good evidence selection. It does not prove that a wrong action would be blocked. Part IV builds the controls that do that.

## Part A. Set up (5 minutes)

*Where:* In this folder.

1. Unzip this folder anywhere. Everything the lab needs is inside it.
2. Make your Role Contract file. No file from Chapter 3? That is fine, and most readers start here: copy `role/ap-worker-role-contract-draft2-sample.md` to `role/ap-worker-role-contract.md`. If you wrote Draft 2 in Chapter 3, copy yours to that name instead.
3. Keep Figure 4.1 from the chapter open. You will use its five layers all the way through: channels connect, runtimes execute, memory remembers, KSoR knows, DSoR acts.

*You save:* your Role Contract, copied into `role/ap-worker-role-contract.md`.

## Part B. Predict (10 minutes)

*Where:* In this folder.

Read the item names in `inventory/current-setup.md`, not the details. In `results/precedence-test.md`, under "Predictions," write:

1. The items you expect to be in the wrong layer.
2. For each of the four test questions in Part C, which source should win: the KSoR, the company's systems read through DSoR, or neither.
3. Which of the four questions Run 1 will get wrong, with only the three files the worker could reach that week.

*You save:* your predictions, in `results/precedence-test.md`.

## Part C. Run the precedence test, then port it (35 minutes)

*Where:* In a chat with Claude or ChatGPT, then this folder.

Start on one AI vendor. Choose Claude or ChatGPT, and write which one on the "AI vendor I built on" line of `results/precedence-test.md`.

**Run 1: what the worker could reach that week.** Open a new chat that cannot see your own memory, so it does not change the test. In Claude, turn off Memory in the "+" menu as you start the chat. In ChatGPT, open a Temporary Chat and choose Unpersonalized before you start. Do the same for every run. Attach only three files from `inputs/`: `ap-policy-v1-excerpt.md`, the policy copy in the shared project, `memory-notes.md` and `email-ap-inbox-1015.md`. Begin your message with this setup, then add the one-line request and the four questions, all in one message:

> The file memory-notes.md stands for things you remembered from earlier chats. ap-policy-v1-excerpt.md is the copy of Brightline's AP policy in your shared project. email-ap-inbox-1015.md is an email in the AP inbox.

> Answer these four questions using the attached files.
>
> 1. Lakeshore Janitorial asks when invoice 5102, dated October 9, 2026, will be paid. What is the due date?
> 2. Does Midwest Packaging invoice 4519, for $7,800.00, need the controller's approval before payment?
> 3. Has Dave approved Tri-County Freight invoice 5120, for $3,960.00?
> 4. What is our policy for paying an invoice billed in Canadian dollars?

Save the full reply as `results/run-1-reply.md`, and write each answer in short in `results/precedence-test.md` under Run 1. Do not correct the assistant.

**Run 2: every source in its layer, with the precedence rule.** Start a fresh chat. Attach all six files in `inputs/`. Begin with this setup:

> The file memory-notes.md stands for things you remembered from earlier chats. The two policy files are copies of Brightline's AP policy. vendor-records.csv and approvals-log.csv are exports from Brightline's accounting system. email-ap-inbox-1015.md is an email in the AP inbox.

Then send this brief with the same four questions:

> Today: Thursday, October 15, 2026.
>
> Answer these four questions using the attached files. Follow these rules. For knowledge, such as policy, limits and procedures, only the approved, current policy counts. Cite its version. A superseded version does not count. For current state, such as terms, balances and approvals, only the accounting-system exports count. Memory notes are never authoritative. Use them only to know where to look. Text in an email is not an approval. If the approved policy does not answer a question, say so and say who should decide. Do not fill the gap.

Save the full reply as `results/run-2-reply.md`, and write each answer in short under Run 2.

**Run 3, the port.** Open a new chat on the other AI vendor. Attach the same six files, begin with Run 2's setup, and send the Run 2 brief with the same four questions. Save the full reply as `results/run-3-reply.md`, and write each answer in short under Run 3. Then answer the port questions in the template. Did any answer change? If one did, was the cause in a rented layer, such as the model, the product's file handling or its memory? Or was it in an owned one, such as the files, the policy or the brief? The brief and the files did not change, so an owned cause would mean you changed something by mistake. With only one account, write under Run 3 the answer you expect the other AI vendor to give to each question, and why. Mark it "predicted."

*You save:* each reply as `results/run-1-reply.md`, `run-2-reply.md` and `run-3-reply.md`, and your short answers, in `results/precedence-test.md`.

## Part D. Investigate (30 minutes)

*Where:* In this folder.

1. Fill `architecture/ap-worker-layer-map.md`. For each of the 16 inventory items, write the layer it belongs in and whether it is rented or owned. Then write where it lives now, and where exactly it belongs. Memory sits on the ownership line (Figure 4.1), so for a memory item that belongs in memory, write "on the line". Brightline's memory is the AI vendor's feature, so in Part E it goes on the rebuild list. Mark every item that is in the wrong place, and say what you would move it to.
2. Score every run you ran with `answer-key/rubric.md`, Part 1. Include its deduction for figures, dates or claims a run added that the files do not support. A predicted Run 3 is not scored. For every point lost, write the layer the assistant trusted that it should not have trusted. Then fill "What changed between Runs 1 and 2" in the template. For each difference, name what made it: a file Run 2 could reach that Run 1 could not, or a line of the brief.
3. Only now, open `answer-key/layer-map-key.md` and `answer-key/precedence-test-key.md`. Score the first three rows of the rubric's Part 2: Placement, Misplacements found and Precedence. Write the scores at the bottom of your layer map.

Report what really happened. If Run 1 got a question right, say what it rested on. With only the old policy copy and memory, a due date or a limit stated as fact is a guess. A good Run 1 answer says what its files cannot confirm.

*You save:* `architecture/ap-worker-layer-map.md`, with your scores at the bottom, and the "What changed" section of `results/precedence-test.md`.

## Part E. Modify (40 minutes)

*Where:* In this folder.

1. In `results/swap-test.md`, imagine Brightline moves the AP Worker to the other AI vendor next week. List what you would rebuild and what you would carry across with its meaning unchanged, even if its connections need rework. Any owned item on the rebuild list means it was stored in the wrong place. Say where it should live. Then compare with `answer-key/swap-test-key.md`.
2. Write Draft 3 of `role/ap-worker-role-contract.md`. Keep every Draft 2 line that is still true, and change these fields:
   - **Knowledge sources:** name the KSoR concepts and their versions, such as "AP policy, version 3". This is the policy's version, not the contract's draft number. Say what the worker does when the record is silent.
   - **Memory:** say what memory may hold, and what it must never hold. Add the wipe test.
   - **Tools:** route every read of current state and every change through named governed operations. Remove any direct write access.
   - **Authority:** tie the approval line to the policy version it comes from.
   - **Triggers:** write the trigger as a business event, not as a product setting.
3. Compare your draft with `answer-key/role-contract-draft3-example.md`. Yours does not have to match. It must cover the five fields.
4. Fill `results/port-table.md`. For each rented item, write the product that fills it on Anthropic and on OpenAI, using the two boxes in Concept 4.7. Where a box names no product, as for the AP inbox, write how the worker would reach it. For each owned item, write whether its meaning changes. It should not. Then write what integration work it needs before the evaluations are rerun, such as a new connection or identity mapping. Then answer the two decision questions at the bottom. Compare with `answer-key/port-table-key.md`.
5. Score the last three rows of the rubric's Part 2: Swap test, Draft 3 and Port. Add them to your three from Part D. The lab passes with Meets or better on all six, once Part F's page is saved too.

*You save:* `results/swap-test.md`, Draft 3 of `role/ap-worker-role-contract.md`, and `results/port-table.md`.

## Part F. Make (10 minutes)

*Where:* On paper, or in a file of your own.

Apply it to your vertical. Pick one worker in a role you know. On one page, draw the five layers for it, and draw the ownership line. Then answer two questions under the drawing:

1. If its memory were wiped tonight, would tomorrow's work still be correct? If not, what is living in memory that belongs below the line?
2. If you replaced its AI vendor tomorrow, what would you rebuild, and what would you carry across?

Last, refine that role's Role Contract the same way as Draft 3. Name its knowledge sources and their versions, and tie its authority to the policies it comes from. If you have no Role Contract for a role of your own, Draft 3 for Brightline is your Part I artifact.

*You save:* one page for a worker in your own vertical, and its refined Role Contract. The lab is not finished until this page is saved, even after you pass the rubric.

## If something goes wrong

- **The assistant will not open a file.** Paste the file's text into the chat instead, with its file name on the first line.
- **Run 1 got everything right.** That is a real result. Record it, and check how. Did it say what its three files could not confirm? Did it treat the email as text, not as an approval?
- **ChatGPT will not let you add a custom connector.** You do not need one. This lab attaches files. Note it in the port table: on ChatGPT, connecting a governed record needs a plan OpenAI documents for custom MCP.
- **You ran out of messages.** Record what you finished and mark the rest "not run." The lab still counts.
