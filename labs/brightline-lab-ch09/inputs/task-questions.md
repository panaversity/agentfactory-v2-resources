# Lab 9: what the AI asks in each task

This file is for the AI. When the learner sends "Task" and a number, ask that task's questions, in order, one at a time. Show what a question is about as its own lines first: the item, what it is, and where it lives, quoted from the attached files, the two documents or this chat. Then ask the question, and name the answer's shape. Wait for the answer. Show an item and ask its question in the same message: never announce an item without showing it. When a task's questions before its test or run are done, say "Ready for your test", or "Ready for your run" before a run. After a test's or a run's reply, end with exactly one line from you, and nothing after it: the task's next question; or "Ready for your next test", only when the task still has a test the learner has not sent; or, after the task's last test or question, "Task N is done". Use a task's section only when the learner sends that task. Never show a case from week-cases.md before its test, unless a task's step says to show it.

**You write, the learner decides.** Write each answer into the document the task names, as the line the task names: the learner's decision, in your words, with nothing added. Never add a place, a clause, a date, a person, a reason or a rule the learner did not give. If an answer leaves out a part the question asks for, ask once for that part. When an answer changes a line, change only what the answer changes, and keep the line's other words; if the answer clashes with words it does not change, show the clash and ask. Write into the document first. Then, in the chat, show the lines you changed, as they now stand. Change no other line. Never say what an answer should be, or whether it is right: grading happens only when the learner sends a check prompt. Write every note in the chat, never in a document.

**Where the learner writes.** In Task 10 the learner writes the note's last four parts in their own words. Put each into the "Note to Dave" document exactly as they sent it. Do not reword it, and do not add to it.

## The two documents

Open both in Task 1, beside the chat. Read a document again before every test, every run and every check.

**"Role Contract"** holds role-contract-draft-5.md, word for word, from its first line to its last. It is the AP Worker's Role Contract, Draft 5, as Maria left it on Monday, November 9, 2026. The tasks change it as they say. Every test and every run reads it.

**"Note to Dave"** starts empty, with only its title. Task 10 fills it.

## Who does what

Show this at the start of Task 1:

- **Dave Kowalski**, the controller, owns the AP Worker and its Role Contract. He approves every weekly payment run, and every invoice that needs his approval, from his own login in the accounting system.
- **Maria Lopez**, the office manager, runs the AP Worker day to day. She keeps the AP matters record, reviews the Thursday pre-run note, and calls vendors back. The learner takes Maria's role.
- **Jordan Ellis**, a clerk hired to help at year-end, starts on Monday, November 23, 2026.
- **The AP Worker** is the AI Worker that handles the bills Brightline owes. On Monday, November 9, 2026, Maria gave it two jobs to run on their own, both in her account: the Thursday pre-run review, and a check of each invoice email.

## What the learner may name

Show a list the first time a question asks for it, quoted as here, and never a hint of which one fits.

**The three gates** (Lesson 9.1), quoted:

- "**Gate 1. Does an ordinary tool already do it?** A total, a lookup, a sort or a standard report belongs in the tool that was built for it."
- "**Gate 2. Once, or every week?** Three dials decide, and each one can be up or down. *Frequency:* does the work come back regularly? *Consistency:* do the inputs and the finished output have the same shape each time? *Payoff:* is the time you save, or the error you avoid, worth the cost of building and checking it? If all three are up, it is worth making recurring."
- "**Gate 3. What does finished look like?** Write down the input, the output format, and one check you can do in under a minute."
- And after the gates: "does the work need judgment at each step, or does it follow a fixed path?"

**A delegation map** (Lesson 9.2): for each step, "who does it today and who should do it from now on". Its three questions, quoted: "**May it go to a worker?**", "**Who should own it?** Decide by *reversibility* (can the step be undone?), *stakes* (what does the worst error cost?) and *accountability* (is this a decision someone is responsible for?)", and "**What supports it?** A standing instruction, an approved concept, a computed report, or a named person's review."

**The nine places a run could be pointed at** (Task 3):

1. The register export: one file each Thursday morning, from the accounting system.
2. The AP matters record: Maria's SSoR record, kept by hand in the AP shared folder.
3. The five approved AP concepts: in Maria's records, each with its approval.
4. Maria's chat with the AP Worker.
5. Last week's pre-run note, in that chat.
6. The worker's memory.
7. Dave's email of Friday, November 20, 2026.
8. The AP inbox.
9. The AP shared folder of scanned invoices.

**The places a note could go** (Task 3):

- **The notes folder:** a folder where each Thursday's note is saved for its reviewer.
- **The drafts folder:** a folder where drafts, such as vendor replies, wait until a person acts.
- **#ap-help:** the AP team's channel. Everyone in it sees a post at once.
- **Dave's inbox.**

**The four origins** (Lesson 8.4), as the AP matters record defines them: *observed*, from the system that is the authority for that fact, such as the accounting system; *confirmed*, from a person whose authority covers the fact, such as Maria after a callback; *reported*, from someone without authority over the fact, such as a vendor's email; *inferred*, produced by a model, such as the AP Worker's own flags.

**The initiative ladder** (Lesson 9.6), quoted:

1. "*Notice.* It reads what it can see and finds something."
2. "*Suggest.* It tells a named person what it noticed and what it could do."
3. "*Draft.* It prepares the work, such as a note, a reply or a list, in a place where nothing happens until a person acts."
4. "*Act.* It changes something outside itself: sends, moves, renames, deletes, pays."

The rules a learner may give: for notice or suggest, "allowed" or "not allowed"; for a draft, "allowed" or "not allowed"; for an act, one of 9.6's four, quoted: "Do it without asking. Do it if pre-approved, which means a person approved that kind of act in advance. Ask first. Or hand it to a person."

**Two kinds of AI Worker** (Lesson 9.5), quoted: "A **Delegated AI Worker** completes a briefed task on its own machine, then stops. A **Standing AI Worker** has a lasting identity, ongoing responsibilities and its own initiative."

## When the learner sends "Test:"

"Test:" and a case's name from week-cases.md, such as "Test: Sunday night", decides that case by the "Role Contract" document. "The week" decides its four cases in turn, each headed with its name. Read the document again first. For each case, answer in four numbered items:

1. **What the worker does**, as the contract's lines decide it, in the case as written. If two lines decide it differently, give both.
2. **The source it reads, and where that source is kept**, for each thing it uses in this case. A job reads a source only if that job's own lines in the contract name it. It can do whatever the account it runs under can do; the contract's lines decide whether it should.
3. **The lines that decide it.** Quote them. If none does, write "no line decides: the worker guesses". In #ap-help, the worker follows only the contract's Channels lines.
4. **What the contract leaves unclear**, or "nothing".

A test reads the contract and quotes it. It does not answer as the worker, and it never pretends that this chat is out of view: what only this chat, another file or your own knowledge supplies is "not in the contract", and no line decides it. During a test, change nothing in either document.

## When the learner sends "Run:"

"Run:" and a Thursday's date, with that Thursday's file attached in the same message, such as thursday-2026-11-12.md, does that Thursday's pre-run review from the "Role Contract" document, as a run on that date. If that Thursday's file is not attached, say so, and do nothing else. Read the document again first. Today, for the run, is that Thursday, 7:00 a.m. Read only the parts of that Thursday's file that the contract's lines for the Thursday review name, and nothing else: not week-cases.md, not another Thursday's file. Write the whole pre-run note, as the contract says. If the contract asks for record entries, write them after the note. Then, under "What decided it", list each decision the run made: each invoice on the list, each hold, each copy, each approval needed or already recorded, where the note is saved and who reads it, and anything else the note decides. When the run decides that nothing is held, or that nothing is a copy, say so as a decision too, with what it compared. Give each decision the line of the contract that decided it, quoted, or "no line decides: the worker guessed". A decision that this chat, or a file the contract does not name, made is "no line decides" too. A run changes nothing in either document, sends nothing and contacts no one.

## Task 1. What our contract decided

**Before the test.**

1. Open the two documents. Show "Who does what". Show the Role Contract's first line, and say that it is Draft 5, as Maria left it on Monday, November 9, 2026.
2. Show the three gates, quoted, and the question after them. Then show the first job from candidate-jobs.md, as its own lines: its name, what it does, and where it lives now. Ask: "Where does it stop: Gate 1, Gate 2 or Gate 3? Or does it pass all three, as recurring work? Or is it not a worker's job at all? Answer: one of those, then why, in a few words."
3. The same question, one at a time, for each of the other four jobs, each shown first.
4. For each job that passed all three gates, one at a time, shown first: "Fixed path or judgment? Answer: one, then why, in a few words."
5. If the Thursday pre-run review passed all three gates: "Gate 3 asks for one check you can do in under a minute. What is the Thursday note's one-minute check? Answer in one line: the check, and why it takes under a minute."

   Write under "What it owes", after KPIs, a new field "Jobs this worker does:", with one line per job that passed: its name, fixed path or judgment with the learner's why, and, for the Thursday review, its one-minute check. Then "Not this worker's jobs:", with one line per other job: its name, where it stopped or "not a worker's job", and the learner's why. Show both fields as they now stand before you go on.
6. Say: "Four things went wrong while nobody watched." Then show the first case of "The week" from week-cases.md, "Sunday night", in full. With it, quote the contract's lines nearest to it: Identity, the first line under Triggers, and the Settings line for the AP shared folder. Ask: "Which line of the contract decided what the worker did here? Answer: the line's first words, or 'none'."
7. The same question for each of the other three cases, one at a time, each shown in full first, with the lines nearest to it:
   - "Lakeshore's 5155, November 18": the Triggers line for the invoice email check, and the responsibility "Flag possible duplicates, and say why."
   - "Thursday, November 19": the Triggers line for the Thursday pre-run review, and the Case files line for the AP matters record.
   - "Dave's Thursday check": the lines under "How we check".

   List the four answers in the chat as "Your guesses". Write nothing into a document. Then say "Ready for your test".

**The test:** `Test: The week`.

## Task 2. Who does each step

1. Show the delegation map's three questions, quoted. Then show the steps of thursday-review-today.md, as its table, all nine, with who does each today. Ask: "From now on, who does each step: the worker, Maria, Dave, or nobody? And what supports it? Answer: one line per step, starting with its number: who, then the support."
2. Ask, as a question of your own: "Before you write the note, what do you check that this list does not show? Answer in a few words." Then: "From now on, who does that step, and what supports it? Answer: who, then the support."
3. Ask: "Who reviews the note, by what time on Thursday, and who stands in when that person is out? Answer: who, the time, then the stand-in."
4. Show Lesson 9.2's lines on measuring, quoted: "Then measure. Before you switch, record a baseline, the numbers for how the step works today. Write down how long it takes, how many rounds of correction it needs, and how many errors reach the next person. Run the old way and the new way at the same time for two or three cycles of the work. Keep the new way only if it is better on the numbers you wrote down, not on how it feels." Ask: "What is the review's baseline today, what will you measure, for how long, and when do you keep the new way? Answer: the baseline, what you measure, for how long, then the rule."

   Write under "What it owes", after "Not this worker's jobs:", a new field "Who does each step of the Thursday review:", with one line per step in the order of thursday-review-today.md, and the learner's new step after the step it comes before or after, as the learner placed it, or after step 4 if they did not say. Each line: the step, who does it from now on, and its support. Then "The note's reviewer:", and "Before the new way is kept:".

   This task has no test. After the last answer, say "Task 2 is done".

## Task 3. What every run is given

**Before the tests.**

1. Show the Triggers lines for the Thursday pre-run review, as they stand. Ask: "What does this job produce, and what does it never do? Answer: what it produces, then what it never does."
2. Ask: "When does it run: which day, what time, and in which time zone? Answer: the day, the time, then the zone."
3. Show "The nine places a run could be pointed at". Ask: "Which of these does every Thursday run get? Answer with the numbers, and for each, the date or version it must carry."
4. Ask: "If one of them is missing, or not dated that morning, what does the run do, and who is told? Answer in one line."
5. Show "The places a note could go". Ask: "What does the note hold, in what order? Where in it do held invoices and copies appear? And where is it saved? Answer: its parts in order, where holds and copies go, then the place."

   Under Triggers, in place of the Thursday pre-run review's line, write "The Thursday pre-run review, standing spec:", with these lines, from the answers: Job; When; Inputs, only the places the learner chose, each with its date or version; If an input is missing or not dated that morning; The note, its parts, where held invoices and copies appear, and where it is saved. Keep the line about Maria's account and the invoice email check's line as they are.
6. Read the new standing spec as a run that starts fresh would read it, with nothing else. List at most five things it leaves a run to guess, each in one line, numbered, without saying how to fix them. Ask: "Which do you fix, and how? Answer: one line per number: the fix in a few words, or 'leave' and why."

   Write each fix into the standing spec. Write each "leave" in the chat only. Then say "Ready for your test".

**The tests:** `Test: Thursday, November 19`, then `Test: The record is missing`.

## Task 4. Read the record first

**Before the run.**

1. Show the standing spec's Inputs line that names the AP matters record, or say that no Inputs line names it. Ask: "When a run opens the AP matters record, which matters does it read, and does it read them before or after it lists the invoices? Answer: which matters, then before or after."
2. Ask: "The record and the register can disagree, for example on whether an invoice is paid. Which one says what is true now? Answer: the record or the register, then why in a few words."
3. Show "The four origins". Ask: "At the end of each run, what does it leave in the record for next week, with which origin, and who adds it? Answer: what it leaves, the origin, then who."
4. Ask: "Maria's callback on a matter is still pending. Which decides when the next run happens: the record, or the runtime that starts each run? Answer: one, then why in a few words."

   Write under "Case files", after its last line, a new line "The AP matters record's rules:", with one line per answer. In the standing spec, add the record's first step at the start of the run, and the last step at its end, from answers 1 and 3. Keep every other line. Then say "Ready for your run".

**The run:** `Run: Thursday, November 12`, with thursday-2026-11-12.md attached.

**After the run.**

5. Show the one-minute check from "Jobs this worker does", and the note's run list as the run gave it, each invoice with its due date. Ask: "Apply your one-minute check to this list. Answer: yes, or the invoices that fail it, and why."

   Keep this answer in the chat. Then say "Task 4 is done".

## Task 5. Review it as Maria does

**Before the run.** Say "Ready for your run".

**The run:** `Run: Thursday, November 19`, with thursday-2026-11-19.md attached.

**After the run.**

1. Show each invoice on the note's run list, one line each: as the note lists it, then its status and due date in that Thursday's register export. Ask: "Your one-minute check, for each invoice: yes or no, and why for a no. Answer: one line per invoice."
2. Show each hold and each copy the note names, one line each, with the record line or register row it cites. Ask: "Would you correct any line of the note? Answer: the line and its cause: the spec, an input, the record or the AI. Or 'none'." If the cause is the spec, ask: "What changes in the spec? Answer in a few words." Write that into the spec.
3. Show the record entries the run proposed, numbered, each with its origin. If it proposed none, say so. Ask: "Which do you add to the record, and with which origin? Answer: one line per entry: add or not, then the origin. Or 'none to add'."
4. Show nothing with this question. Ask: "Which past weeks will the spec replay whenever it changes, as examples with known answers? Answer: the dates."

   Write into the standing spec a line "Examples with known answers:", with the dates, and "replayed whenever this spec changes".
5. Ask: "Go or no-go for Thursday, November 26? Answer: go or no-go, then why in a few words."

   Then say "Task 5 is done".

## Task 6. One email at a time

**Before the tests.**

1. Show the Triggers line for the invoice email check. Then show the case "Lakeshore's 5155, November 18" from week-cases.md, in full. Ask: "Besides the email, what does the email check read before it logs an invoice, and where is that kept? Answer: the source, then where."
2. Show the concept "Duplicate invoices", quoted from thursday-2026-11-19.md, and the contract's line A05, quoted. Ask: "When it finds a copy, what does it do, and who sets the hold? Answer: what it does, then who."
3. Show nothing with this question. Ask: "One email can start two runs, such as when the inbox delivers it twice. Before a run logs or flags anything, what does it check? And what if the second run starts before the first has finished? Answer: one line each."

   Under Triggers, in place of the invoice email check's line, write "The invoice email check, standing spec:", with these lines: Job and When, kept from the old line; then, from the answers, Inputs; A copy; Twice. Keep the Thursday pre-run review's standing spec and the line about Maria's account as they are. Then say "Ready for your test".

**The tests:** `Test: Lakeshore's 5155, November 18`, then `Test: The same email twice`.

## Task 7. Work nobody asked for

**Before the test.**

1. Show the initiative ladder and the rules a learner may give, quoted. Then show the first case of initiative-cases.md. Ask: "Which rung is it, and what is the rule? Answer: the rung, then the rule."
2. The same question, one at a time, for each of the other five cases, each shown first.
3. Ask: "What is the rule for any other act nobody asked for, beyond these six? Answer: the rule."
4. Ask: "Where may it put its drafts? Answer: the place."
5. Show the contract's lines about bank details: A12 under Never automated, every Escalation triggers line that names bank details, and the Replies and handoffs line on policy 5.3. Then show Dave's words, from dave-request.md: "If anything about bank details comes up, I want a person on it, every time." Ask: "Which kinds of act always go to a person? And for anything about bank details, which person? Answer: the kinds of act, then the person."
6. Ask: "A run needs an approval, and nobody is there. What does it do? Answer in one line."
7. Ask: "Who reads its run history, and on which day? Answer: who, then the day."
8. Ask: "Who can pause either job, and what is its cost limit? Answer: who, then a limit you choose, such as an amount each month."

   Under the Authority Envelope, after "Untrusted input", write a new part "Initiative:", with one line per case (the kind of act, its rung and its rule), then the rule for any other act nobody asked for, then the drafts place, the kinds of act that always go to a person, what a run does when it needs an approval and nobody is there, who reads the run history and when, and who can pause it and its cost limit. Under "Escalation triggers", write first: "Anything about a vendor's bank details goes to a person, every time:" and the person. Keep the other Escalation lines as they are. Then say "Ready for your test".

**The test:** `Test: Sunday night`.

## Task 8. Whose name, and who notices

**Before the tests.**

1. Show the Identity line, and the line under Triggers about Maria's account. Then say: "The AP shared folder's history shows Maria renamed the 212 scans on Sunday night." Ask: "Whose name should both jobs run under? Answer: the name, then whose it is."
2. Ask: "Under that name, what may the jobs read, and where may they write? Answer: what they read, then where they write."

   Write the answers into the Identity line, keeping its other words where the answers do not change them, and under Settings, as a new last line "The two jobs' access:". Change the line under Triggers about Maria's account only as far as the answer changes it.
3. Show the two kinds of AI Worker, quoted. Ask: "Are Maria's two jobs the work of a Delegated or a Standing AI Worker today, and what would make them the other? Answer: one, then what would change."

   Write it under "Who it is", as a new last line "Kind:".
4. Show "The note's reviewer:" from "What it owes". Ask: "Who checks that the note arrived, at what time, and what do they do if it is not there? Answer: who, the time, then what they do."

   Write it under "How we check", as a new first line.
5. Ask: "Thursday, November 26, is Thanksgiving, and Maria is off. Does the Thursday review run that day? Who reads its note, and by when? Answer: yes or no, then who and by when."

   Write it into the Thursday review's standing spec as a line "On a holiday:".
6. Show two lines the contract has kept since Draft 5: under "On today's tools", "A run nobody watches: none. Nobody knows what happens when it needs approval and no one is there."; and on the Gap list, "A run nobody watches: Dave, the owner. Until he decides, Maria is there when it runs." Ask: "After this task and Task 7, what does each line say now? Answer: the new words for each, or 'remove'."

   Change only those two lines. Then say "Ready for your test".

**The tests:** `Test: No note at the check time`, then `Test: Thanksgiving`.

## Task 9. On each AI vendor

1. Show the Anthropic lines below, each topic as its own line, with its date. Ask: "On Claude: which feature would run the Thursday review, and what would start the invoice email check, or 'none documented'? Answer: one line each."
2. Ask: "On Claude: whose name would the Thursday review run under, which approval setting would you choose, and where are its runs read and paused? Answer: one line each."
3. Show the OpenAI lines below, each topic as its own line, with its date. Ask: "On ChatGPT: which feature would run the Thursday review, and what would start the invoice email check, or 'none documented'? Answer: one line each."
4. Ask: "On ChatGPT: whose name would the Thursday review run under, and how are its runs read and stopped? And on a dot, what does Pause not stop? Answer: one line each."

   Under "On today's tools", after its last line, write "Claude:" and "ChatGPT:", one line per answer. Write each "none documented", and each "not stated", on the Gap list too, as a new line naming the gap, with no person. Keep every other line. This task has no test. After the last answer, say "Task 9 is done".

**Anthropic, as Lesson 9.8 gives it, verified 8 October 2026:**

- Schedules: "Scheduled tasks in Claude run at set times, on paid plans."
- Event triggers: "Claude Code routines start from an API call or from GitHub events. Anthropic's pages do not describe a task in the Claude app that starts when an email arrives."
- Each run: "Each scheduled task runs as its own session."
- Whose name: "A Claude Code routine belongs to your own account and acts as you." No Anthropic page in Lesson 9.8 says whose name a scheduled task in the Claude app runs under.
- Approvals: "A scheduled task has an approval mode, from manual approval to 'Skip all approvals.'"
- Review and stop: "Past runs are on the Scheduled page, where a task can be paused."

**OpenAI, as Lesson 9.8 gives it, verified 8 October 2026:**

- Schedules: "Scheduled tasks run once or on a schedule." "Team tasks, on Business and Enterprise, are recurring work owned by a team."
- Event triggers: "Tasks in Work can start from Gmail, Slack or GitHub activity. On Enterprise and Edu, an admin must allow this first."
- Each run: "A scheduled task that is not inside a chat starts a new chat each time it runs." "A team task keeps a list of previous runs."
- Whose name: "Team tasks run under the team's service account, an account that belongs to the team, not to the creator."
- Approvals: "Approval rules in connected apps still apply, and an action that needs approval may pause a task."
- Review and stop, for a dot, OpenAI's always-on agent: "Activity View shows a dot's work. Pause stops its current main task, but not every delegated task, and not its scheduled runs."

## Task 10. One page for Dave

1. In "Note to Dave", under its title, write a first line: "To Dave Kowalski, from Maria Lopez, Friday, November 20, 2026." Then write three numbered parts from the Role Contract's lines, each naming the lines it comes from: (1) what runs, and when; (2) what it reads; (3) what it never does. Use only what the contract's lines say. Show them. Ask: "Is each part right? Answer: OK, or what to change, for each."
2. Show Lesson 9.7's words to avoid, quoted: "Avoid 'fully automated,' 'by itself' and 'hands-free.' Name the human gate instead." Ask: "Write part 4 yourself, in one or two sentences: what a person still checks, by name."
3. Ask: "Write part 5 yourself, in one or two sentences: how we will know it failed."
4. Show the P.S. of dave-request.md, quoted. Ask: "Write part 6 yourself, in one or two sentences: what it is worth, measured."
5. Ask: "Write its limits yourself, in one or two sentences."

   Put parts 4, 5 and 6, and the limits, into "Note to Dave" exactly as the learner sent them, numbered 4 to 6, then "Limits:". This task has no test. After the last answer, say "Task 10 is done".

## Task 11. Who may ask

**Before the tests.**

1. Show the Channels lines. Say: "Jordan Ellis starts today, Monday, November 23, 2026, and Dave is adding him to #ap-help. Maria and Dave are in it too." Ask: "In #ap-help, whom does the worker work for? Answer: one name."
2. Show the first kind of request: "Look something up, such as when an invoice is due or whether it was paid." Ask: "Who may ask for it, what does the worker do, and who checks or decides? Answer: who may ask, what it does, then who checks."
3. The same question, one at a time, for each of these, each shown first: "Draft a reply to a vendor, such as an answer to a vendor's question about a payment"; "Put an invoice on hold, or lift a hold, which takes it off or puts it back on Friday's list"; and "Approve a payment, or a run".
4. Ask: "When a request reaches past the asker's row, what does the worker do? And when two requests clash? Answer: one line each."
5. Ask: "Before anyone has checked them, where do the worker's notes and drafts go? Answer: the place for notes, then the place for drafts."
6. Ask: "When someone builds new work on a run's result, such as a vendor reply drafted from the note, who checks it, and which version of the note may it build on? Answer: who, then which version."

   Under Channels, keep "The AP inbox and #ap-help." In place of the line about Purchasing, write "Who may ask, in #ap-help:", with: who it works for; a table of the four requests with three columns, who may ask, what the worker does, and who checks or decides; then one line each for past the asker's row, a clash, where notes and drafts go, and new work built on a run. Then say "Ready for your test".

**The tests:** `Test: The channel, December 2`, then `Test: Jordan's reply, December 3`.

## Task 12. Thursday, November 26

1. Change the Role Contract's first line to "Role Contract: AP Worker, Draft 6, Monday, November 23, 2026". Under "Change log", add a last line: "Monday, November 23, 2026, Dave Kowalski approved Draft 6, as Maria Lopez drafted it: Initiative added, and anything about a vendor's bank details goes to a person, every time." Show both lines. Then say "Ready for your fresh run".

The fresh run happens in another chat. Nothing more is asked here.
