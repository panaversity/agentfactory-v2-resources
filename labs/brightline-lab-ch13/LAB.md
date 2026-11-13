# Lab 13: choices that last

Chapter 13 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 13: choices that last](https://agentfactory.panaversity.org/building-ai-workers/programming-fundamentals/lab/), so you can do the lab without the book.

*Time: about 2 hours 15 minutes, with the checks.*

An agent wrote the script that makes Brightline's Friday payment list. You find the choices it made, decide them yourself, and write them down so they last.

### Before you start

- **You need** one coding agent (Claude Code, Codex or OpenCode), and Git, Node.js 24 or later, and uv. [13.1](https://agentfactory.panaversity.org/building-ai-workers/programming-fundamentals/you-read-the-agent-writes/#how-do-i-set-up-to-try-this) has the install steps.
- **Download** [brightline-lab-ch13.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13.zip) and unzip it. Open only its `brightline-ap` folder in your agent, in the mode that asks before it acts: *Manual* in Claude Code, *Ask for approval* in Codex. In OpenCode, the folder's own settings make it ask.
- **The job.** You work in accounts payable at Brightline. Today is Wednesday, March 3, 2027, and the payment run is Friday, March 5, 2027. The script prints Friday's list: 8 invoices, $19,229.53. Dave Kowalski, the controller, signs the run, and each task starts with what he asks you.

### How each task works

1. Send the message the task prints. The agent asks you questions, and you answer in a few words. You decide, and the agent types.
2. Read what the agent says it will do before you approve it.
3. When the task is done, download its answer key and keep it outside `brightline-ap`. Attach it in the agent with [the check message](#the-check-message). Then read the key yourself.

### Task 1. What rules is it using? (20 minutes)

**Dave asks.** "Before I sign Friday's run, show me every rule this script uses to decide what we pay. I want to know which ones we chose."

1. Open `brightline-ap` in your agent.
2. If you chose Python for the lessons, send: "Please set my language in AGENTS.md to Python." The project's rules file says TypeScript until you do. The agent reads that file at the start of every session, so the messages below work for both languages.
3. Send: "Please put this folder under git, with a main branch, and commit everything with the message "The project as I received it"." Every later change can then be compared with this start. If the agent wants to change your git name or email for the whole computer, say no. Ask it to set them for this project only.
4. Send: "Please tell me which packages the lock files would install, for both languages. Install nothing yet." Know what goes on your computer before you say yes. Find the five names the project asks for: `typescript`, `@types/node`, `pytest`, `pyright` and `ruff`. The others are packages those five need.
5. Send: "Please install them from the lock files. Then run the tests and the type checker for my language."
6. Before you run the script, say which of these three invoices will be on Friday's list. Write yes or no for each, on paper or in a note.

   | Invoice | Status | Invoice date | Due date | Terms |
   | --- | --- | --- | --- | --- |
   | INV-8305 | open | February 3, 2027 | none given | Net 30 |
   | INV-8303 | open | February 4, 2027 | Saturday, March 6, 2027 | Net 30 |
   | INV-8309 | paid | January 29, 2027 | February 28, 2027 | Net 30 |

7. Send: "Please run Friday's list for 2027-03-05." Compare the list with your three answers.
8. Send:

   > Please show me every rule the script uses to decide which invoices are on Friday's list. For each rule, give me one plain sentence, the line of code that carries it, and one invoice in data/invoices.csv that it decides.
   >
   > Then list every place where the script decides something that no rule in AGENTS.md or NOTES.md states. Change nothing.

9. Read the first list. These are the rules somebody chose. For each of your three invoices in step 6, find the rule that put it on Friday's list, or kept it off.
10. Read the second list. These are things the script does that nobody chose, such as what happens to an invoice whose status is neither open nor paid. Pick one, and send: "Take item [its number] on your second list. Show me one row that would go wrong because of it, and what the script would do with that row. Change nothing." You do not have to fix anything on this list today.
11. Send: "Please add both lists to NOTES.md, under the heading "Rules behind Friday's list". Put the second list under "Nobody chose these yet". Then commit, with the message "The rules behind Friday's list"."

**Checkpoint:** the tests and the type checker pass. Friday's list prints 8 invoices, total $19,229.53. `NOTES.md` holds both lists.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-1.md), attach it, and send [the check message](#the-check-message).

### Task 2. Decide the cases (25 minutes)

**Dave asks.** "We give our vendors five terms and no others: Due on receipt, Net 15, Net 30, Net 45 and Net 60. If an export shows any other terms, the run must stop and say which terms it found. It must never guess. And an invoice with no due date is due on its invoice date plus the days in its terms."

You decide what correct means before any code exists. That is the first 10 percent of [10-80-10](https://agentfactory.panaversity.org/building-ai-workers/programming-fundamentals/you-read-the-agent-writes/#what-is-my-job-when-an-agent-writes-the-code).

1. Send:

   > I will decide the answer for six cases of the due-date rule. Ask me for them one at a time. For each case, show me the invoice date and the terms. Then ask: "What is the due date, or should the run stop?" Do not tell me the answer, and do not hint. When I have answered all six, show my answers in a table, and wait.
   >
   > The cases: (1) 2027-02-03, Net 30. (2) 2027-02-19, Net 15. (3) 2027-01-02, Net 60. (4) 2027-03-01, Due on receipt. (5) 2026-12-20, Net 45. (6) 2027-03-02, Net 10.

2. Answer each question from Dave's words, with a calendar beside you. Give a date as year, month and day, such as 2027-03-05, or say "stop".
3. If you think a case is missing, tell the agent the case and your answer, as a seventh. The six cover each of Dave's five terms, a month end, a year end, and terms he never named.
4. Send:

   > Please write one failing test for each of my answers. The tests are for a new function that takes an invoice date and terms, and gives the due date. Name it and place it as AGENTS.md says. Where I said stop, the test expects an error with the message "Unknown terms: " and then the terms. Use my answers exactly. Write only the tests. Then show me each test beside my answer for its case.

5. Read each test against your answer: the same date, the same terms, the same result. If one differs, say so, and the agent corrects it.
6. Send: "Please run the tests. Show me that the new ones fail, and why. Then commit only the new test file, with the message "Failing tests for the due-date rule"."

**Checkpoint:** the new tests fail because the function does not exist yet. One commit holds the new test file and nothing else.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-2.md), attach it, and send [the check message](#the-check-message).

### Task 3. Let the agent write it (15 minutes)

This task has no ask from Dave. The agent now does the middle 80 percent, from your tests.

1. Before the agent writes anything, say whether Friday's list for March 5 will change, and write it down. The new rule stops a run for terms outside Dave's five.
2. Send:

   > Please write the function so my six tests pass. The terms we give are Due on receipt, Net 15, Net 30, Net 45 and Net 60, and any other terms stop the run, as in my sixth test. Then make the script for Friday's list use the function for every due date it works out. Do not change any test. Then run the tests, the type checker and Friday's list for 2027-03-05, and show me that no test file has changed since my commit.

3. Read what the agent shows you: the tests, the type checker, the list, and the files changed since your commit.
4. Net 90 is in none of your tests. Say what the function will do with it, and write it down. Then send: "Please run the due-date function for 2027-03-02 with Net 90, and show me the line of code that decided the result. Change nothing."
5. Send: "Please commit, with the message "The due-date rule, from my tests"."

**Checkpoint:** every test passes, and the type checker is clean. Friday's list still prints 8 invoices, total $19,229.53. No test file has changed since your Task 2 commit.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-3.md), attach it, and send [the check message](#the-check-message).

### Task 4. Read the error (15 minutes)

**Dave asks.** "Next week's export came from the new vendor portal. Run next Friday's list on it. Next Friday is March 12, 2027."

1. Send: "Please run Friday's list for 2027-03-12 on invoices-next-week.csv. Show me the whole output. Do not explain it, and do not fix anything."
2. Read the error yourself, as [13.8](https://agentfactory.panaversity.org/building-ai-workers/programming-fundamentals/reading-an-error/) shows. In TypeScript, start at the top. In Python, start at the bottom. Find the message, and the first line that names a file in this project.
3. Send your reading, in your own words, in this shape:

   > My reading: the error was raised in [file], at line [number]. The cause is [what you think]. Am I right? Then show me the row of the export that caused it. Change nothing.

4. You ask Dave about that row. He answers: "Cardinal Forklift is on Net 15. The portal has it wrong." Decide what has to change: the code, a test, or the export. Send your decision in one line, starting with "My decision:".

**Checkpoint:** the run stopped with `Unknown terms: Net 10`. You named the file, the line and the cause before the agent explained them. Nothing in the project has changed.

The agent may not change `data/`, so next Friday's list waits for a corrected export. A run that stays stopped is the right result here.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-4.md), attach it, and send [the check message](#the-check-message).

### Task 5. The other language (15 minutes)

**Dave asks.** "Half the team runs the version in the other language. Friday's list has to follow the same rules in both."

Your six answers decide the rule, whichever language holds it. So the agent brings the other language up to date from them, and you check one thing: the same cases, the same answers.

1. Send:

   > Please bring the other language's version up to the same rule. Write the same six tests there, with my answers exactly as they are in my tests, and commit them alone first. Then write the function and make that language's script for Friday's list use it. Do not change anything in my language. Then run the tests and the type checker in both languages, and Friday's list for 2027-03-05 in both languages.

2. Compare the last line of Friday's list in the two languages.
3. Send: "Please show me my six cases in a table, with the result of each in both languages. Then commit, with the message "The same rule in the other language"."

**Checkpoint:** the same six cases pass in both languages. Friday's list prints 8 invoices, total $19,229.53, in both.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-5.md), attach it, and send [the check message](#the-check-message).

### Task 6. The weekend (25 minutes)

**Dave asks.** "Two invoices fall due on Saturday, March 6, 2027, the day after the run. One is Great Lakes Freight's, for $12,900.00. Finance wants a new rule: an invoice due on a Saturday or a Sunday is paid on the Friday before. Do not change Friday's run until the rule has been reviewed. Keep it on a branch."

1. Send: "Please show me every open invoice in data/invoices.csv, with its due date and that date's weekday. Where the due date is empty, get it from the due-date function. Work out each weekday with code, not from memory, and show me the command. Change nothing."
2. Send: "Please make a branch called weekend-rule, and switch to it." Dave asked for the rule to stay off `main`, so everything up to step 9 happens on the branch.
3. From the table in step 1 and Dave's rule, say what Friday's list for March 5 will print under the new rule: how many invoices, and what total. Add the amounts yourself. Then send: "I predict that Friday's list under the weekend rule will print [count] invoices, total [amount]. Please write my prediction at the end of NOTES.md, and commit it with the message "My prediction for the weekend rule". Do not comment on it."
4. Send:

   > I will decide four cases of the weekend rule. Ask me for them one at a time. For each case, show me the due date with its weekday, worked out with code, and ask: "On which date is it paid?" Do not tell me the answer, and do not hint. When I have answered all four, show my answers in a table, and wait.
   >
   > The cases: (1) 2027-03-06. (2) 2027-03-07. (3) 2027-03-08. (4) 2026-08-01.

5. Answer each question from Dave's rule, with a calendar beside you.
6. Send:

   > Please write one failing test for each of my answers, in my language. The tests are for a new function that takes a due date and gives the date it is paid. Add one more test: Friday's list for 2027-03-05 gives the count and the total in my prediction in NOTES.md. Write only the tests, run them, and show me that the new ones fail. Then commit only the tests.

7. Send: "Please write the rule so my tests pass, and make the script for Friday's list use it. Keep each invoice's own due date on its line, so the list still shows when each invoice is really due. Do not change any test. Then run the tests, the type checker and Friday's list for 2027-03-05."
8. If the list matches your prediction, go to step 9. If it does not, send: "Which invoices are on Friday's list now that were not on it before the weekend rule?" Then decide which was wrong, your prediction or the rule, and tell the agent to correct that one. A test changes only when you decide that its answer was wrong.
9. Send: "Please commit, with the message "The weekend rule, from my tests". Then switch back to main, and run Friday's list for 2027-03-05 again."

**Checkpoint:** on the branch `weekend-rule`, the tests pass and Friday's list matches the answer key. On `main`, it still prints 8 invoices, total $19,229.53.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-6.md), attach it, and send [the check message](#the-check-message).

### Task 7. Make it last (20 minutes)

**Dave asks.** "Write today's rules down where the next person will find them, and the next agent. I do not want them living in a chat."

1. On `main`, send:

   > Please write down what I decided today, so a new session knows it without this chat. Put the rules an agent must follow in AGENTS.md: the five terms, and what happens to any other. Put the handover in NOTES.md: where the due-date rule lives in each language, and that the weekend rule is on the branch weekend-rule, not reviewed yet, and not on main. Take out of "Nobody chose these yet" what I decided today. Say each thing once. Show me the diff before you commit.

2. Read the diff. Each rule should be there once, in plain words. If the agent added a rule you did not decide, ask it to take that rule out before you commit. A plain fact about where things stand is fine.
3. Send: "Please commit, with the message "Today's rules, written down", and tag the commit ch13."
4. Open a new session in the same folder. Send:

   > Answer from this project only, and name the file behind each answer. A vendor's invoice has no due date, and its terms are Net 10. What will Friday's run do? And is an invoice due on a Saturday on this Friday's list?

**Checkpoint:** the new session answers both questions from the project's files, and names them. The tag `ch13` is on `main`.

**Check it now.** In the new session, download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch13-key-task-7.md), attach it, and send [the check message](#the-check-message).

### The check message

Send this with each task's key, only when that task is done. It is the same for every task. If a check is Missed, tell the agent what to correct, and send the check message again.

```text
Outcome:     The task I just finished in this project, graded against
             the attached answer key: Passed or Missed for each check.
Context:     This project's files and git history, what we did in this
             session, and the attached key.
Format:      A table: the check, Passed or Missed, the evidence, and
             one line on why. The evidence is a command you ran and
             what it printed, a line of a file, or my own words. Then
             how many passed.
Constraints: Grade only. Change no file and fix nothing. With no
             evidence, mark the check Missed. If a check is about what
             I did or said, ask me.
```

### Look back

- Ask the agent to show you the list "Nobody chose these yet" as it was in your Task 1 commit. Is the weekend on it? A rule that is missing has no line of code to point at. Only someone who knows the business can name it.
- In the [overview](https://agentfactory.panaversity.org/building-ai-workers/programming-fundamentals/overview/#why-it-matters), Renee made her choice once, and it stayed in a chat. Your choices from today are in three places that a new session can read. Name them.
- This Friday, the two Saturday invoices are still not on the list, because the weekend rule waits on its branch. Dave knows, because you showed him. [Chapter 15](https://agentfactory.panaversity.org/building-ai-workers/code-review/overview/) takes that branch through review.

### If you want more

Each of these is optional, and has no answer key.

- **The same change on a second agent.** Open the folder in a second agent, Codex or OpenCode, in the mode that asks before it acts. From your commit of failing weekend tests, on a new branch, send the message from Task 6, step 7. Compare what each agent asked before it acted, and whether either tried to change a test.
- **The weekend rule in the other language.** On `weekend-rule`, send the message from Task 5, step 1, for your four weekend cases.
- **Check the dates an export states.** Ask for a script that works out each invoice's due date with your rule, and reports every row whose stated due date differs. Decide three cases first. Run it on `data/invoices-check.csv`.

### If something goes wrong

| Problem | What to try |
| --- | --- |
| `git commit` says "Please tell me who you are" | Git does not know your name yet. Ask the agent to set your name and email for this project only, then to commit again. |
| The type checker is not found | The packages are not installed. Ask the agent to install them from the lock files. |
| `uv` downloads Python on the first run | That is normal when no Python 3.12 or later is installed. Let it finish. |
| The agent answers a case for you in Task 2 or Task 6 | Say: "Do not answer for me. Ask the question again." |
| The agent edited a test to make it pass | Ask it to put the tests back as they are in your commit. Then tell it in one sentence that the tests are your decisions. |
| The agent works in the wrong language | Check the line "My language is:" in `AGENTS.md`, then start a new session. |
| The agent cannot read the attached key | Paste the key's text under the check message. |

### Apply it to your vertical

Pick one calculation from your own work that you check by hand today, such as a deadline from a start date, a late fee, a commission or a tax line. Ask a coding agent to list the rules its current version pays on, and what it decides with no rule. Then decide five cases, each with its answer, including one input that must be refused. Have the agent write the tests from your answers and commit them, and only then the code that passes them.

*Domain expert and builder.* The domain expert decides the cases and their answers, especially the strange ones, such as the terms nobody uses anymore. The agent writes the tests and the function. The builder reads each test against the cases, and keeps the agent from changing the tests.
