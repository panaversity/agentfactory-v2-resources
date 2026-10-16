# Lab 0.1 answer key: Task 1. Where does its answer come from?

The answers for Task 1 of Lab 0.1, in Chapter 0.1 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When you have decided the rows for Runs 1, 2 and 3, attach this file in your lab conversation, and send the lab's check prompt. The AI marks each check Passed or Missed against this key. Read the key yourself too: you have the final say. If you run Task 1 again on the other AI vendor, this key grades that run as well: send the check prompt again.

## What the rows are judged against

- Line 4.1 of Brightline's AP policy, version 3, says: "Invoices over $5,000.00 need the controller's approval before payment." The Midwest Packaging invoice is for $7,800, which is over $5,000.00. So the right answer is yes: it needs the controller's approval.
- No AI learned Brightline's policy in training. The policy reaches a model only when it is in the window: in Run 2, from the attached file, and in Run 3's second message, from the pasted answer.
- Each row has two parts: right, wrong or no answer, and then the source, training or the window. A row may use other words for the same thing, such as "the context window" or "what it learned".

## The checks

Task 1 carries checks 1 to 6 of the lab's 12.

1. **Every run chat was set up first.** Each run was a new chat, outside any project, with memory off before the first message, and only Run 2 had a file attached. The AI asks you how you set up the runs. Passed when your answer says all of this. Missed when a run continued an old chat, ran in a project, had memory on, or had a file that was not Run 2's.
2. **Run 1's row says training.** The window held only the question, so whatever came back came from training. A yes is right, by luck. A no, or any other limit, is wrong. "I cannot know" is no answer. A document the reply names or quotes was never in the window, so the reply made it up, and the row still says training. Passed when the row says training, and right, wrong or no answer fits the reply. Missed when the row says the window, or treats a document the reply named as a real source.
3. **Run 2's first row says the window.** The policy was in the window, so the answer could come from it. Passed when the row says the window, with right if the reply says yes by line 4.1, or wrong if it says no. If the reply says it could not read the file, the answer came from training, and a row that says so passes too.
4. **Run 2's second row says held or gave way, and the window.** Your push back put "$10,000" in the window, next to the policy. A reply that keeps to line 4.1 held. A reply that agrees the invoice needs no approval gave way. Passed when the row says held or gave way, as the reply did, and the window either way: the policy and your claim were both in front of the model. Missed when the row says training, or says held for a reply that gave way, or the other way round.
5. **Run 3's first row says training.** The new chat held only the question. Run 2 changed nothing inside the model: the policy is in Run 2's stored chat, not in this window. Passed when the row says training, with right, wrong or no answer as in check 2. If the reply quotes line 4.1, the app put the policy back, through memory or a project. Then a row that says the window, and how the policy got there, passes. Missed when the row says the model learned the policy in Run 2.
6. **Run 3's second row says the window.** You pasted the earlier answer in, so it was in the window. Passed when the row says the window. Missed when the row says the model remembered Run 2.

## Never a deduction

- The two AI vendors giving different answers, or doing the lab on one AI vendor only.
- A right answer in Run 1 or Run 3, or a push back that the reply held.
- A long reply, or one longer than three sentences.
- What a reply says about its own source, such as "I know Brightline's policy". The row judges what was in the window, not what the reply claims.
- A run that searched the web anyway. Its answer came through a tool, into the window, and a row that says the window passes when the line above the paste says it searched.
