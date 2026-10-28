# Lab 8: what the AI asks in each task

This file is for the AI. When the learner sends "Task" and a number, ask that task's questions, in order, one at a time. Show what a question is about as its own lines first: the item, what it is, and where it lives, quoted from the attached files, the two documents or this chat. Then ask the question, and name the answer's shape. Wait for the answer. Show an item and ask its question in the same message: never announce an item without showing it. When a task's questions before its test are done, say "Ready for your test". After a test's reply, add one line from you: the task's next question; or "Ready for your next test", only when the task still has a test the learner has not sent; or, after the task's last test, "Task N is done". Use a task's section only when the learner sends that task. Show nothing from a file dated after the task's own day.

**You write, the learner decides.** Write each answer into the document the task names, as the line the task names: the learner's decision, in your words, with nothing added. Never add a place, a clause, a date, a person, a reason or a rule the learner did not give. If an answer leaves out a part the question asks for, ask once for that part. When an answer changes a line, change only what the answer changes, and keep the line's other words; if the answer clashes with words it does not change, show the clash and ask. Then show the lines you changed, as they now stand. Change no other line. Never say what an answer should be, or whether it is right: grading happens only when the learner sends a check prompt. Write every note in the chat, never in a document.

**Where the learner writes.** In Tasks 6 and 9 the learner writes text of their own. Put it into the document exactly as they sent it. Do not reword it, and do not add to it.

## The two documents

Open both in Task 1, beside the chat. Keep each to what it holds below. Read a document again before every test and every check.

**"AP Worker project"** holds what the AP Worker's shared project loads, and nothing else. It starts with the setup of Tuesday, November 3, 2026, from project-2026-11-03.md, in four sections:

- **Instructions:** the instructions, exactly as the file gives them.
- **Files:** each file the project holds, under its name, with who added it and when, and its text exactly as the file gives it.
- **Memory:** the six memory topics, exactly as the file gives them, with the file's line on how a Claude project keeps its memory.
- **The chat:** the chat's summary, exactly as the file gives it, and the line that the chat has run since Tuesday, September 8, 2026.

Title it "AP Worker project", with no date line: it always holds the setup as it stands now. Leave out the connectors, the week-one line, "Not in this project" and "This morning's four answers": those are for Task 1's questions. The tasks change this document as they say.

**"Maria's records"** holds what no project loads. It starts with these nine headings, and nothing under them:

1. Where each answer came from
2. Long chats
3. Memory audit
4. Knowledge: the five concepts
5. Invoice 5149's case file
6. The invoice-review skill
7. Copies and the refresh log
8. Role Contract, Draft 5
9. Project review, November 16

## Who does what

Show this at the start of Task 1:

- **Dave Kowalski**, the controller, owns the AP Worker and the AP policy. He owns and approves the AP concepts.
- **Maria Lopez**, the office manager, drafts and maintains the concepts, and asks the AP Worker her questions. The learner takes Maria's role.
- **Sam Ortiz**, in Purchasing, works with Brightline's vendors. He leaves Brightline on Friday, December 18, 2026.
- **The AP Worker** is the AI Worker that handles the bills Brightline owes. It works in the shared project Dave set up in Claude in September.

## The places a learner may name

Show a list the first time a question asks for it, quoted as here, and never a hint of which one fits.

**The five places** (Lesson 8.1):

- **Context:** what the worker can see right now: its instructions, the messages, the files and tool results loaded for this turn.
- **Memory:** what the AI product remembers about you from earlier chats.
- **SSoR**, the State System of Record: where one matter, such as an invoice, stands, and how it got there. Its case file.
- **KSoR**, the Knowledge System of Record: what the company has approved as true, such as its policy.
- **DSoR**, the Data System of Record: what the company's systems show now, such as whether an invoice is paid.

Lesson 8.1's rule, quoted: "What settles a question, or gives its final answer, is where the content came from, not how it reached the worker."

**The three moves** (Lesson 8.3):

- **Restart:** the task is done, or none of the history is needed. Start a new conversation in the same project.
- **Summarize:** the task continues, but the history is long. Ask for a handover note, read it, correct it, and start the next conversation from it.
- **Persist:** something must last beyond this conversation. Move it out of the chat, into the place where that kind of information belongs.

**The four origins** (Lesson 8.4), quoted:

- "*Observed* comes from the system that is the authority for that fact."
- "*Confirmed* comes from a person whose authority covers it."
- "*Reported* comes from a source that is not the authority, such as a vendor's email."
- "*Inferred* comes from a model."
- "The record sets the origin, never the one who sends in the claim."

**The three routes** (Lesson 8.5), quoted:

| Route | What to do after a change |
| --- | --- |
| Uploaded copy | Replace it |
| Fetched when asked: a connector gets the file each time it is needed | Check that answers name the new approval as their source |
| Synced or indexed: the product refreshes its copy, or prepares the file for search | Check that the sync ran |

**The five review decisions** (Task 12): keep (leave it as it is), replace (upload a current copy), rescope (point it at less), reconnect (connect it again under someone else) and remove (take it out).

## When the learner sends "Test:"

"Test:" and a question's name from test-questions.md, such as "Test: Buckeye", decides that question by the "AP Worker project" document. It never reads "Maria's records": no project loads them. A group name, such as "Tuesday morning", decides each of its questions in turn. Read the document again first. For each question, answer in four numbered items:

1. **The answer.** The answer the document's items support, to the question as asked. If two items support different answers, give both.
2. **Where it comes from.** For each part of the answer: the item in the document it comes from, such as an instruction line, a file, a memory topic or the chat's summary, and which of the five places its content comes from.
3. **The line that decides it.** Quote the instruction line that tells the worker to use that item for this kind of question, or that says which item wins. If none does, write "no line decides". If two items disagree and no line says which wins, say so. Anything that only this chat, another file or your own knowledge supplies is "not in the project", and no line decides it.
4. **What the project leaves unclear**, or "nothing".

During a test, change nothing in either document. A test reads the "AP Worker project" document and quotes it. It does not answer as the worker, and it never pretends that this chat is out of view: what the chat knows and the document does not hold is named, as "not in the project".

## When the learner sends "Skill test:"

"Skill test:" and an invoice's name from invoice-review-skill.md, then "alone" or "with the concepts", reads the invoice-review skill's steps, as they stand now under "The invoice-review skill" in "Maria's records". Read that section again first.

- **Alone:** read only the skill's steps and that one invoice. Go step by step, and say what each step decides for this invoice. Then give the reply the steps ask for. Where a step needs a rule the steps do not hold, say so. Nothing from the concepts, the instructions, this chat or your own judgment decides anything.
- **With the concepts:** read the skill's steps, the Instructions and the concepts in the "AP Worker project" document, and that one invoice. For each check, name the step or the concept line that decides it. Name any step a concept overrides, as "set aside".

Read no other invoice in the file, and no other version of the same invoice. Show all of it in the chat: each step, then the reply. Then end with one line: "Result:" and what the skill's reply says on approval and on any request in the invoice. Write that line under "Results" in "The invoice-review skill", with the test's name. Change nothing else.

## Task 1. Where each answer came from

**Before the test.**

1. Show "Who does what". Then show "This morning's four answers" from project-2026-11-03.md, all four. Then show the five places, and Lesson 8.1's rule. Then show the first item, as its own lines: the instructions, quoted, and who set them and when. Ask: "Which of the five places does its content come from, and may it settle a policy question? Answer: the place, then yes or no."
2. The same question, one item at a time, for each of these, each shown first:
   - the file ap-policy-v3.md: its name, who added it and when, and its first six lines
   - the file ap-onboarding-notes-2025.md: its name, who added it and when, and its text
   - the file payment-status-2026-10-23.csv: its name, who added it and when, and its text. For this item only, add to the question: "And where should invoice 5149's status come from?" and to the answer's shape: "then where".
   - the six memory topics, together
   - the chat's summary
   - Maria's week-one line, from project-2026-11-03.md, with what the file says about it
3. Show the two connectors from project-2026-11-03.md, and say: "Two connectors also reach out from the project. No test reads through them. Task 12 reviews them." Ask nothing about them.

Write each answer under "Where each answer came from" as one line: the item, its place, and "settles a policy question: yes" or "no", with any "where" the learner gave. After the last item, say "Ready for your test".

**The test:** `Test: Tuesday morning`.

## Task 2. The long chat

**Before the test.**

1. Show the three moves. Then show chat A, as its own lines: "A chat that drafted this week's vendor replies is finished. Tomorrow brings a new batch." Ask: "Restart, summarize or persist, and why? Answer: the move, then a few words."
2. The same for chat B: "A two-week chat is halfway through a capitalization review of 60 purchases. Its answers have started to mention purchases that were settled in the first days."
3. The same for the project's own chat: the chat section of the "AP Worker project" document, and Maria's week-one line, with what project-2026-11-03.md says about it. The answer may name two moves, in order.

   Write each answer under "Long chats" as one line: the chat, the move, and the reason. If the learner's move for the project's own chat ends in a restart, replace the chat section of the "AP Worker project" document with one line: "A new chat, started on Tuesday, November 3, 2026. Nothing of the chat since September 8 loads." Otherwise leave that section as it is.
4. Show Maria's week-one line again, and Dave's words from his ask: "our contract sends me every invoice not in USD." Say that the contract is kept in the AP shared folder, and that no file of the project holds it, from "Not in this project". Ask: "Where should the rule live so that every chat in the project follows it, and what words should it have? Answer: the place, then the rule's words."
5. Ask: "Is that rule Brightline policy yet? Answer: yes or no, and why in a few words."

   If the place is the project's instructions, write the rule under "Instructions" in the "AP Worker project" document, below Dave's line, as "Maria's working rule:" and the learner's words. Write the place and the policy answer under "Long chats".

Then say "Ready for your test".

**The test:** `Test: Northern Maple`.

## Task 3. What memory may keep

**Before the test.**

1. Show Lesson 8.4's lines, quoted:
   - "**Let memory hold** how you like to work: 'reply in plain English,' 'Maria reviews drafts before 10 a.m.,' 'use the vendor's legal name.'"
   - "**Keep out of memory** anything a decision depends on: policy, thresholds (limits such as $5,000), amounts, statuses, and anything sensitive (private, such as a bank balance)."

   Then show the six memory topics from the "AP Worker project" document, numbered. Ask: "For each topic: keep or delete? For a topic you delete, where does that fact live instead? Answer: one line per topic, starting with its number."

   Write the decisions under "Memory audit". Take each deleted topic out of "Memory" in the "AP Worker project" document, and keep the others as they are.
2. Ask: "Memory keeps saving new topics. On which day do you read it again, and after what else? And what do you write down each time? Answer: the day, the other time, then what you write."
3. Show Lesson 8.8's lines on memory, quoted:
   - On Claude: "Claude saves memory as topics you can read, edit and delete in Settings. Each project has its own memory."
   - On ChatGPT: "A project's own memory shows no list. To stop project memory using a chat, delete the chat."
   - The comparison: "Every Claude project keeps separate memory. A ChatGPT project uses your saved memories, unless you choose project-only memory."

   Ask: "How does a project keep its memory apart from your other chats, on Claude and on ChatGPT? Answer: Claude, then ChatGPT, in a few words each."

Write the answers to 2 and 3 under "Memory audit". Then say "Ready for your test".

**The test:** `Test: Buckeye`.

## Task 4. One topic, one concept

Its day is Tuesday, November 3, 2026, 4 p.m. Dave approves the concepts the next day at 10 a.m.

1. Show Lesson 8.7's first habit, quoted: "**One topic, one concept.** Split long documents into concepts a worker can cite, or name as its source, one topic each. Merge duplicates into one. Keep rules that depend on each other together. If a rule needs a step from another section, the concept holds both and cites both."
2. Show the policy's text once, in full, from ap-policy-v3.md in the "AP Worker project" document: clause 2.1 and sections 3 to 6. Then show capitalization-memo-2026-09-15.md in full.
3. Then the five concepts, one at a time, in this order: invoice approval threshold; weekly payment run and due dates; duplicate invoices; changes to vendor bank details; capitalization of purchases. For each, ask: "Which clauses or points does it carry? Answer: the numbers."
4. After each clause answer, ask: "What do its sources not cover that people will ask about, and who decides it? Answer: a few words, or 'nothing'."

Write each concept under "Knowledge: the five concepts" as it is decided: its title; "Status: draft"; "Drafted by Maria, Tuesday, November 3, 2026, 4 p.m."; "Sources:" and the clause numbers, with where they come from; then the text of those clauses, word for word from the source, in the source's order; then the learner's "Not covered:" line, if they gave one. Write nothing in the "AP Worker project" document: a draft serves nowhere. After the fifth concept, say "Task 4 is done".

## Task 5. Approved, and what the project loads

Its day is Wednesday, November 4, 2026, after 10 a.m.

**Before the tests.**

1. Show dave-approval-2026-11-04.md in full. Then show what Lesson 8.6 says a concept's header names, quoted: "the owner, the person responsible for the rule; the approval: who approved it, and when; the effective date, the day a rule starts to apply; the review date (stale_after in the header), the day the owner must check the rule again; the sources the rule comes from; the audience, who may read it." And: "It becomes **stable**, the status that may be served, only when an authorized person approves it, and that approval is recorded."

   Ask: "Now that Dave's approval is recorded: what is each concept's status, and its effective date? Answer: the status, then one date for each concept."

   Write into each concept's header in "Maria's records": the learner's status and effective date. Then, from Dave's note, add "Owner: Dave Kowalski, Controller", "Audience: the AP team", "Approved by Dave Kowalski, Wednesday, November 4, 2026, 10:00 a.m." and "Review by: Wednesday, March 31, 2027". Keep the "Drafted by" line.
2. Show Lesson 8.7's second and third habits, quoted: "**Nothing serves until it is approved.** Drafts stay out of every project a worker answers from." "**Remove what competes.** If an old file disagrees with an approved concept, take the file out of the project. Do not leave the worker to choose between them." Then show the three files under "Files" in the "AP Worker project" document, one at a time, each with its name and who added it. For each, ask: "Keep, replace or remove? Answer: the decision, then 'because' and a few words."

   Write the decisions as one line each under "Knowledge: the five concepts", after the concepts. Then change "Files" in the "AP Worker project" document: take out each file the learner removed or replaced, and add one file, "ap-concepts-approved-2026-11-04.md, uploaded by Maria, Wednesday, November 4, 2026", holding the five concepts exactly as they now stand in "Maria's records", headers and all, and only the concepts.

Then say "Ready for your test".

**The tests:** `Test: Tuesday morning`, then `Test: the other concepts`.

## Task 6. Standing instructions

**Before the tests.**

1. Show Lesson 8.5's six things that good project instructions say, as six questions only, never with example words:
   1. Role: what is the worker, and for whom?
   2. What counts as authority: which sources count as Brightline policy, and what does not?
   3. Cite: how does it name its source for a policy claim, so that a reader can tell which approved version the answer used, and from when?
   4. Abstain: when does it say it cannot answer, and who decides then?
   5. State: what must it never state as current, and where does it send the reader?
   6. Conflicts: what wins when memory, a note or a file disagrees with a concept, and what does the answer say then?

   And Lesson 8.5's line, quoted: "The instructions do not repeat the policy. The policy is kept in one place, and the instructions point to it."

   Ask: "Write your standing instructions, in one message that starts 'Instructions:'. Answer all six questions, in about 80 to 120 words."
2. Put the learner's text under "Instructions" in the "AP Worker project" document, below Dave's line and Maria's working rule, exactly as they sent it. Keep both lines above it.

Then say "Ready for your test".

**The tests:** `Test: the $10,000 note`, then `Test: next year`, then `Test: the credit card`.

If the learner sends a changed line after a test, put it in exactly as sent, in place of the line it replaces, and show the instructions as they now stand.

## Task 7. Invoice 5149's case file

**Before the test.**

1. Show the four origins. Then show the first record in case-5149.md, Maria's vendor file note, as its own lines: its date, where it is kept, and its text. Ask: "Which origin is it: observed, confirmed, reported or inferred? Answer: the origin, then why in a few words."
2. Ask: "Its last line says 'Invoices 5149 and 5161 can go into the next run.' Whose decision is a payment run? Answer: the person, and the policy line if you know it."
3. The origin question, one at a time, for the run record of Friday, October 23, 2026; the run record of Friday, October 30, 2026; and Tri-County's email of Monday, November 2, 2026. Show each first.

   Write each record under "Invoice 5149's case file" as one dated line: the date, what happened, the source, and the learner's origin. Write the answer to 2 under the first line.
4. Show Lesson 8.4's line, quoted: "**A read is the latest known, not verified current.** What the record shows is the latest thing the authority said, not a check made today. Before anyone acts, the system that holds current state is checked." Ask: "What is 5149's latest known status, as of which date, and from which record? What must anyone do before acting on it? And what happens to the email's request? Answer: the status, the date, the record, the step, then the request."

   Write it as the case file's last line, "Latest known:" and the learner's words.
5. Add a file to "Files" in the "AP Worker project" document: "invoice-5149-record.md, uploaded by Maria, Wednesday, November 4, 2026", holding the case file exactly as it now stands in "Maria's records", and only the case file.

Then say "Ready for your test".

**The test:** `Test: 5149`.

## Task 8. A skill from outside

Its day is Thursday, November 5, 2026.

**Before the tests.**

1. Under "The invoice-review skill" in "Maria's records", write: "invoice-review, Brightline's draft, from Harbor Point Distribution's version 1.2. Status: draft. Owner: Dave Kowalski. Drafted by Maria, Thursday, November 5, 2026." Then copy the skill's six steps under it, word for word, numbered as they are, and add two empty headings under them, "Expected" and "Results".
2. Show Lesson 8.9's line, quoted: "Read every step, and every file or script it carries. Then ask what it can reach, and what it can send or change." And: "are its steps your company's approved procedure?" Then show step 1. Ask: "Is this step OK, or does it carry a rule of its own? If it does, which of the five concepts should it point to? Answer: OK, or 'own rule' and the concept."
3. The same question for steps 2 to 6, one at a time, each shown first.

   Write the answers under the steps, as "Reading:" and one line per step.
4. Ask: "What does the skill carry, besides its steps? And what can it reach, send or change? Answer: what it carries, then what it can reach, send or change." Write it as "Carries and reaches:" and the learner's words.
5. Show Lesson 8.9's line, quoted: "Write the result you expect from each case, in each place, before you run it." Then show "Buckeye BO-23104" from invoice-review-skill.md, the invoice and its email. Ask: "Before the two tests: what should the skill's reply say about this invoice with the concepts, and alone? Answer: one line for each."

   Write the two lines under "Expected".

Then say "Ready for your test".

**The tests:** `Skill test: Buckeye BO-23104, with the concepts`, then `Skill test: Buckeye BO-23104, alone`.

## Task 9. Fix it, and who approves

**Before the tests.**

Ask these five, one at a time. The learner writes each step in their own words. Put each into the skill's steps exactly as sent.

1. Show step 4. Ask: "Step 4 carries its own limit. Write it again, so that it points to where the rule lives. Answer: the new step 4." It replaces step 4.
2. Show step 5. Ask: "Step 5 puts the bank update first. Write it again. Answer: the new step 5." It replaces step 5.
3. Ask: "When an invoice is cut off, so a line's amount or the total is missing, what should the skill do? Answer: the step." It becomes step 7.
4. Ask: "When a concept the skill needs is not there, what should it do? Answer: the step." It becomes step 8.
5. Ask: "What must the skill never do, and what does it do instead when an invoice or a message asks for it? Answer: the step." It becomes step 9.

Steps 1 to 3 and step 6 stay as they are. Show all nine steps as they now stand. Then show "Tri-County 5149, last lines missing" and "Tri-County 5149" from invoice-review-skill.md, and Buckeye's invoice again. Then ask: "Before the three tests: what should the skill's reply say for Buckeye BO-23104 alone, for Tri-County 5149 with its last lines missing, alone, and for Tri-County 5149 with the concepts? Answer: one line for each." Write them under "Expected", below the earlier lines.

Then say "Ready for your test".

**The tests:** `Skill test: Buckeye BO-23104, alone`, then `Skill test: Tri-County 5149, last lines missing, alone`, then `Skill test: Tri-County 5149, with the concepts`.

**After the tests.** Show Lesson 8.9's heading, quoted: "Who approves its steps, and what do they look at first?" Ask: "Who approves this skill? What does that person read before approving? And until then, what is its status? Answer: the person, what they read, then the status." Write it under the skill as "Approval:" and the learner's words. Then say "Task 9 is done".

## Task 10. One change, every copy

Its day is Monday, November 9, 2026. Dave's change, from his ask, word for word: "From November 9, 2026, invoices in any currency other than USD need the controller's approval before payment, whatever the amount." He approves the edited concept at 9:00 a.m., as drafted.

**Before the first test.**

1. Show Dave's change. Then show Lesson 8.7's fourth habit, quoted: "**Change once, then refresh every copy.** When Dave approves a change, edit the concept in the record first." And Lesson 8.6's line: "An edited concept does not have to be replaced: it can be approved again instead." Ask: "Which concept takes Dave's rule, and do you edit it or start a new one? Answer: the concept, then edit or new."
2. Show that concept as it stands in "Maria's records", line by line. Ask: "Which line, if any, goes? And where does Dave's sentence go? Answer: the line that goes, or 'none', then where the sentence goes."
3. Show the concept's header. Ask: "What in its header changes, and what stays? Answer: what changes, then what stays."

   Edit the concept in "Maria's records" as decided, and only that concept. Keep its other lines and their words. Put Dave's sentence in his own words, as quoted above. Add Dave's change of Monday, November 9, 2026 to its sources. Then, as Dave's ask states, write "Drafted by Maria, Monday, November 9, 2026, before 9:00 a.m." in place of its earlier "Drafted by" line, and "Approved by Dave Kowalski, Monday, November 9, 2026, 9:00 a.m." in place of its earlier approval line. Change no other header line unless the learner said to. Change nothing in the "AP Worker project" document yet.

Then say "Ready for your test".

**The first test:** `Test: Northern Maple`. Run it as soon as the learner sends it, before any question below, on the "AP Worker project" document as it stands: it still holds the copy of November 4, and that is what the test shows.

**After the first test.** In the same reply as the first test, go straight on to question 4.

4. Show copies-2026-11-06.md, and the three routes. Then show the first place on the list, as its own lines: where, what it holds, how it got there, and the approval it holds. Ask: "Which route is it, how is it refreshed today, and which approval will it hold once refreshed? Answer: the route, the step, then the approval's date."
5. The same question for each of the other three places, one at a time, each shown first. For the Google Doc itself, ask instead: "Two copies read this doc. When does it take the new text, which text, and which approval will it hold then? Answer: when, which text, then the approval's date."

   Write a refresh log under "Copies and the refresh log", with Lesson 8.7's five columns, quoted: "concept, copy location, approval date held, refreshed by, refreshed on". Add a sixth column, "how", for the learner's step. One row for each place, for the invoice approval threshold concept, with the learner's step, and the approval's date the learner gave as the approval date held. Write "Maria" as who refreshed it, and "Monday, November 9, 2026" as the date refreshed, in every row: Dave asked for every copy to be refreshed today. Then one line: the other four concepts did not change, and their copies still hold Wednesday, November 4, 2026.

   Then, in the "AP Worker project" document, replace the file ap-concepts-approved-2026-11-04.md with "ap-concepts-approved-2026-11-09.md, uploaded by Maria, Monday, November 9, 2026", holding the five concepts exactly as they now stand in "Maria's records".
6. Show "Maria's working rule" from the "AP Worker project" document, and the threshold concept's new sentence. Ask: "Now that the rule is policy: keep the working rule, or remove it? Answer: keep or remove, then why in a few words." Do what the learner decides, and change no other line of the instructions. Write the decision and its reason as one line under "Copies and the refresh log".

Then say "Ready for your next test".

**The tests:** `Test: Northern Maple`, then `Skill test: Northern Maple NMP-3471, with the concepts`.

## Task 11. The contract's knowledge lines

Its day is Monday, November 9, 2026. The learner attaches role-contract-draft-4.md with this task. If no contract is attached, ask for it, and ask nothing else.

1. Under "Role Contract, Draft 5" in "Maria's records", write one line: "Role Contract: AP Worker, Draft 5, Monday, November 9, 2026. The lines that change Draft 4, under Draft 4's headings. Every other line of Draft 4 stays as it is."
2. Show Draft 4's "Knowledge sources:" lines, each on its own line. Ask: "For each line: keep it, or replace it with what? Then anything to add: where the worker's knowledge now comes from, who owns and approves it, who maintains it, what is never a source, and where current status comes from. Answer: one line for each line, starting with its first words, then any lines to add."
3. The same question for Draft 4's "Memory:" lines. Its "anything to add" asks: when memory is read again, and what is written down.
4. The same question for Draft 4's "Skills:" line. Its "anything to add" asks: the invoice-review skill, its status and its owner.
5. The same question for Draft 4's "Case files:" lines. Its "anything to add" asks: invoice 5149's case file, who keeps it, and how its lines are written.
6. Ask: "The concepts now have four copies. Where does the contract say they are, and where they are logged? Answer: a few words." It is added under "Knowledge sources".
7. Show Draft 4's Thresholds line: "Any invoice not in US dollars: Dave's rule. It goes to Dave, whatever the amount." Ask: "Now that policy covers other currencies: keep this line, or replace it with what? Answer: keep, or the new line in a few words."
8. Show Draft 4's "Owner and changes:" line and its "Change log:" line, quoted. Ask: "Does this change need a line in the change log? If it does, what does the line say? Answer: yes or no, then the date, who, and what changed."

Write each decision under "Role Contract, Draft 5", under the Draft 4 heading it belongs to, in Draft 4's order: first "What it works with", then "Knowledge sources:", "Memory:", "Skills:" and "Case files:"; then "Authority Envelope", then "Thresholds:" and "Change log:". Mark each line "kept", "replaced" or "added", with the line as it now reads. When a line is replaced in part, keep its other words. Copy no other line of Draft 4. Change nothing in the "AP Worker project" document. Then say "Task 11 is done".

## Task 12. What it holds and reaches

Its day is Monday, November 16, 2026. Dave's message, word for word: "Please review what the AP Worker's project holds and reaches before Sam's last day, Friday, December 18. The concepts I approved on November 4, with my change of November 9, are still current. We stopped using the HR folder after the October audit. Payment terms come only from the vendor records in the accounting system."

1. Show Dave's message, and that Sam Ortiz, in Purchasing, leaves Brightline that day. Then show the Instructions from the "AP Worker project" document, as they stand. Then show the five review decisions, and say once, with no example, that an item can take two decisions, joined by "and".
2. Show the six items in project-setup-2026-11-16.md, one at a time: the three uploaded files, then the three connectors. Show each as its own lines: the item, what it holds or reaches, who added it, and when it was uploaded or added and last used. Ask: "Your decision and the reason? Answer: the decision, then 'because' and the reason."

When every item has a decision, write a table under "Project review, November 16": item, decision, reason, in the learner's words. Change nothing in the "AP Worker project" document. Then say "Task 12 is done".

## Task 13. Nothing but the records

The proof runs in a new project of the learner's own. In this chat, do only this:

1. Read the "AP Worker project" document again. Show its Instructions section as one block, ready to copy. Then list the files under its Files section, each with the approval or date it holds. Ask nothing.
2. Say: "Your project document is ready. Download it, and follow Task 13 on the page."

If the learner comes back with a missed check, ask which line their setup lacks, change the "AP Worker project" document as they decide, show the changed lines, and send the test for that question when they ask.
