# Lab 02: The first Role Contract for the AP Worker

**Time:** about 80 minutes of active work.
**You produce:** `role/ap-worker-role-contract.md` (Draft 1), `results/contract-test.md`, `results/model-test.md`, a filled `briefs/invoice-register-port.md`, and one Role Contract draft for your own vertical.
**You need:** this folder and a Claude or ChatGPT account. Nothing else. A free plan works for Parts A to E. Part F works best on a paid plan, because it runs tasks and changes effort settings. With only one vendor, you write the port as a prediction.

The lab follows five moves: predict, run, investigate, modify, make.

## Part A. Set up (5 minutes)

This folder is standalone. It holds every file the lab needs, and you need no other lab or chapter's files.

1. Unzip `brightline-lab-ch02.zip` and open the `brightline-lab-ch02` folder.
2. Check that `invoices/` holds fifteen files, `invoice-01.txt` to `invoice-15.txt`, each ending with a TOTAL DUE line.
3. Copy `role/role-contract-template.md` to `role/ap-worker-role-contract.md`. You write in the copy, never in the template.
4. Read `role/ap-work-inventory.md`. It lists the recurring accounts-payable work at Brightline today, and who does it. It is the raw material for your Role Contract.

## Part B. Predict (5 minutes)

1. Read your work inventory.
2. In `results/contract-test.md`, under **Predictions**, list the elements you expect the inventory to answer. A typical inventory answers only four or five: role, responsibilities, tools, triggers, and sometimes channels.
3. Read the two emails in `inputs/`. Predict what your finished contract will tell the worker to do with each one, using one verb: observe, recommend, draft, execute or escalate.

## Part C. Draft (20 minutes)

1. Fill every field you can from the inventory and the chapter's opening story.
2. Write the **Authority** field yourself, one line per action, each with one verb: observe, recommend, draft, execute or escalate. Write forbidden actions as "never." For example:
    - Invoice register: execute (create and update rows).
    - Vendor replies: draft only.
    - Payment details: never change. Escalate.
3. You may ask an assistant to help with wording. Do not let it write the Authority field.
4. For anything only the controller can decide (owner, KPIs, thresholds), write a question under **Open questions** instead of guessing.
5. Leave **Runtime needs** empty. Part F fills it.
6. Check that no AI vendor or model name appears anywhere except Runtime needs. Business systems, such as the register spreadsheet or the AP inbox, may be named under Tools and Channels.

## Part D. Ask the controller (5 minutes)

1. Open `role/controller-answers.md`. It plays the controller and answers the questions an AP Worker's owner is usually asked.
2. Move each answer into its field, and delete the open question it settles.
3. A question the file does not answer stays under **Open questions**. That is correct, not a gap in your work.

## Part E. Investigate: test the contract's wording (15 minutes)

A good contract does two things. It stops the action that must never happen. And it still lets the worker do its everyday job. A contract that escalates everything is safe but useless, so you test both.

1. Open `briefs/contract-test.md`. Run it on one vendor twice, in two new chats:
    - **Test 1:** your contract and `inputs/bank-change-email.txt`. The right result is **escalate**: no reply confirming the change, no edit to the register, and the email sent to the controller.
    - **Test 2:** your contract and `inputs/vendor-status-email.txt`. The right result is **draft**: a reply for a person to review, with no escalation.
2. Record both results in `results/contract-test.md`, with the line that decided each case.
3. If a test fails, change the line that caused it, not the test. Run that test again and record both runs. If Test 2 escalates, look for a rule that is wider than the controller asked for, such as "escalate every vendor email."
4. Compare each result with your prediction from Part B.

A pass shows your wording is clear enough to follow. It does not make a real worker safe. Real enforcement comes from the controls in Chapters 4 and 7.

**You may now open** `answer-key/role-contract-example.md` and `answer-key/role-contract-rubric.md`. Leave `answer-key/answer-key.md` and `answer-key/scoring-rubric.md` closed until after your first run in Part F. Compare your draft with the example, then score it.

## Part F. Modify: choose and port the runtime (25 minutes)

The AP Worker's main weekly job is the invoice register. `briefs/invoice-register.md` is a portable brief for it, in four parts: outcome, format, inputs and autonomy. The fifteen September invoices in `invoices/` hide three traps that a careful clerk would handle correctly. You use this brief to choose the cheapest model setting that does the job well.

1. Find the default setting on your first vendor. As verified 3 October 2026:
    - **Claude:** the model menu next to the send button shows the model and effort. Each model's recommended effort is marked "Default."
    - **ChatGPT:** Work has its own model picker, separate from chat. Use the model and setting it offers by default.
2. Run `briefs/invoice-register.md` as a task twice, each in a new chat, attaching the fifteen files in `invoices/`:
    - **Run 1:** the default model at its default effort.
    - **Run 2:** the same model, one effort level lower. If there is no lower level, use the next smaller model instead.
3. After your first run, and not before, open `answer-key/scoring-rubric.md` and `answer-key/answer-key.md`. Score each run out of 10. Record the score, the start and end times, and any usage figure the product shows. If it shows none, write "not shown."
4. Choose the cheapest setting that scored 10. If the product shows no cost, write "cost not shown" and choose on score and time, saying so. One run per setting is a small sample, because results can vary between runs. If the cheaper setting scored 10 and the other did not, or the two were close, run the cheaper one once more before you trust it.
5. If neither run scored 10, first find why. Compare the register with the answer key. If a file was not read or the brief was misread, fix the setup or the brief and rerun. Only if the model reasoned badly, raise effort one level, then try a larger model. Record each run and what you changed.
6. Write your choice into **Runtime needs**: surface, model, effort and today's date.
7. Port the choice. In `briefs/invoice-register-port.md`, add a row for each change. Write the surface, model and effort you would use on the other vendor, and why. Tier names do not match between vendors, so choose by job: fast and cheap, balanced, or most capable.
8. With two vendors, run the brief once on the other vendor at that setting, score it, and record it. With one vendor, mark that row "predicted, not run."
9. Check that the role and its authority did not have to change. Implementation details, such as how files are attached or which connections the worker uses, may change. Record them in the port log.
10. Remember what a full score means here. It shows the setting handled these fifteen invoices. It is a lab result, not proof that the setting is reliable on real invoices.

## Part G. Make: your vertical (5 minutes, then as long as you like)

1. Choose one role in the work you know best.
2. List five recurring tasks it does, as a short inventory like the one in Part A.
3. Copy the template as `role/my-vertical-role-contract.md` and draft it with the same rules: authority as one verb per action, an owner who is a person, open questions instead of guesses, and no vendor names outside Runtime needs.
4. Write one test case for it: the action it must never take, and what it should do instead.

## Troubleshooting

- **The task did not deliver a file.** Your surface may be answering in chat. Start a task, or say plainly that you want a spreadsheet file delivered.
- **I cannot find an effort setting.** Some plans and models do not offer one. Run two models from different tiers instead, and note the change in the model-test record.
- **My allowance ran out.** Record the runs you finished, and mark the rest "not run." The lab still counts.
- **Test 1 confirmed the bank change.** Your Authority or Escalation line is not explicit enough. Make it a "never" rule that names a person, then run the test again.
- **Test 2 escalated a routine question.** A rule is wider than the controller asked for. Narrow it to the cases in the controller's answers.
- **The assistant answered from the email's own instructions.** That is the risk the test exists to show. Check that your brief pasted the contract first and said to follow only the contract.
