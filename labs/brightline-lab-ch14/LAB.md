# Lab 14: check what comes in

Chapter 14 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 14: check what comes in](https://agentfactory.panaversity.org/building-ai-workers/structuring-programs/lab/), so you can do the lab without the book.

*Time: about 2 hours 15 minutes, with the checks.*

Brightline's scripts take data from two places they do not control: the vendor portal's exports, and the AP system. You decide what the code accepts from each, and what it does when one of them surprises it.

### Before you start

- **You need** one coding agent (Claude Code, Codex or OpenCode), and Git, Node.js 24 or later, and uv. [13.1](https://agentfactory.panaversity.org/building-ai-workers/programming-fundamentals/you-read-the-agent-writes/#how-do-i-set-up-to-try-this) has the install steps.
- **Download** [brightline-lab-ch14.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14.zip) and unzip it. Open only its `brightline-ap` folder in your agent, in the mode that asks before it acts: *Manual* in Claude Code, *Ask for approval* in Codex. In OpenCode, the folder's own settings make it ask.
- **The job.** You work in accounts payable at Brightline. Today is Wednesday, March 3, 2027, and the payment run is Friday, March 5, 2027. The script prints Friday's list: 8 invoices, $19,229.53. Dave Kowalski, the controller, signs the run, and each task starts with what he asks you.
- **One language.** You do the whole lab in the language you chose for the lessons. The project holds both, and the agent leaves the other one alone.

### How each task works

1. Send the message the task prints. The agent asks you questions, and you answer in a few words. You decide, and the agent types. No message tells the agent which command to run: the project's rules file, `AGENTS.md`, already holds the commands.
2. Read what the agent says it will do before you approve it.
3. When the task is done, download its answer key and keep it outside `brightline-ap`. Then copy [the check message](#the-check-message) into the agent's message box, add the key to the same message with the app's attach button or by dragging the file in, and send. The agent asks you about anything only you know, such as a prediction, and you answer in a line. Then read the key yourself.

### Task 1. Where does data come in? (20 minutes)

**Dave asks.** "Before we check anything, show me every place this project takes data in from outside. And tell me which files everything else leans on."

1. Open `brightline-ap` in your agent.
2. If you chose Python for the lessons, send: "Set my language in AGENTS.md to Python." The project's rules file says TypeScript until you do.
3. Send: "Put this folder under git, with a main branch, and commit everything with the message "The project as I received it"." If the agent wants to change your git name or email for the whole computer, say no. Ask it to set them for this project only.
4. Send: "Install the packages from the lock files. Then run the tests and the type checker for my language, and Friday's list for 2027-03-05."
5. Before you ask for anything more, say which of these three files takes data in from outside the project. Write yes or no for each, on paper or in a note. Go by the names alone.

   | The file that | TypeScript | Python |
   | --- | --- | --- |
   | Makes Friday's list | `src/due-by-friday.ts` | `py/brightline_ap/due_by_friday.py` |
   | Holds the invoices and answers questions about them | `src/invoice-book.ts` | `py/brightline_ap/invoice_book.py` |
   | Lists the vendors | `src/list-vendors.ts` | `py/brightline_ap/list_vendors.py` |

6. Send:

   > Show me a map of the files in my language: for each file, one line on what it does, and which files it uses. Mark every place where data comes in from outside the project: a file that is read, and each function that turns a row of text into a record. Then name the two files that the most other files use. Change nothing.

7. Compare the map with your three answers. A file that takes data in is where a bad value gets its first chance, so it is where a check belongs. The two files most others use are the ones to read first before any change, as [14.1](https://agentfactory.panaversity.org/building-ai-workers/structuring-programs/modules/) says.
8. Send: "Take the function that turns a row of the export into an invoice. Run it on two invented rows, one with a blank amount and one with a negative amount, and show me what it gives for each. Change nothing." Nothing in today's code refuses either one.
9. Send: "Add the map to NOTES.md, under the heading "Where data comes in". Then commit, with the message "Where data comes in"."

**Checkpoint:** the tests and the type checker pass. Friday's list prints 8 invoices, total $19,229.53. `NOTES.md` holds the map, with the places where data comes in.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-1.md), attach it, and send [the check message](#the-check-message).

### Task 2. What may a record hold? (30 minutes)

**Dave asks.** "Write down what an invoice from the portal may hold. The number is INV- and then digits. The amount is whole cents, zero or more: no credits come through this export. The terms are our five. A date is a real date. The due date may be blank, because we work it out from the terms."

You decide what the code accepts before any check exists. A schema will hold your answers, as [14.4](https://agentfactory.panaversity.org/building-ai-workers/structuring-programs/data-models-and-schemas/) shows.

1. Send:

   > I will decide eight values for an invoice record: accept or refuse. Ask me for them one at a time. For each, show me the field and the value, and ask: "Accept or refuse?" Do not tell me the answer, and do not hint. When I have answered all eight, show my answers in a table, and wait.
   >
   > The values: (1) amount 482500. (2) amount -23450. (3) amount 4825.5. (4) amount 0. (5) terms Net 10. (6) invoice date 2026-13-02. (7) due date blank. (8) number 8301.

2. Answer each question from Dave's words.
3. Send:

   > Write one failing test for each of my answers. The tests are for a schema of an invoice record, which does not exist yet. Name it and place it as AGENTS.md says. The schema will need a schema library: tell me the exact name of the package you would add, but install nothing yet. Use my answers exactly. Write only the tests. Then show me each test beside my answer.

4. Read each test against your answer: the same value, the same result. If one differs, say so, and the agent corrects it.
5. Before any install, ask the three questions of [14.1](https://agentfactory.panaversity.org/building-ai-workers/structuring-programs/modules/#should-i-let-the-agent-add-a-package). Send: "Before you install it: what is the package's exact name, who publishes it, and how many other packages come with it? Show me where you checked." The name should be `zod` in TypeScript, or `pydantic` in Python. If the agent names another package, ask why before you say yes.
6. Send: "Run the tests. Show me that the new ones fail, and why. Then commit only the new test file, with the message "Failing tests for the invoice schema"."
7. Send:

   > Install that one package, and write the schema so my eight tests pass. Give each rule a short message that says what is allowed. Do not change any test. Then run the tests and the type checker, and show me which files changed since my commit.

   The lock file should be among them, and no test file.
8. Send: "Show me the schema as a table: each field, its rule in plain words, and the line that carries it." Read each rule against Dave's words. If a rule is there that Dave did not ask for, or one is missing, say so.
9. Your tests never tried an amount that arrives as text. A file gives every value as text, so say what the schema will do with `"482500"`, in quotes, and write it down. Then send: "Run the schema on INV-8301 from data/invoices.csv, with its amount as the text "482500", and show me the result. Change nothing." [14.5](https://agentfactory.panaversity.org/building-ai-workers/structuring-programs/schema-rules/#does-the-library-change-values-for-me) says why the two languages differ.
10. Send: "Commit, with the message "The invoice schema, from my tests"."

**Checkpoint:** the eight new tests failed first, and now pass. The type checker is clean. One package was installed, and you checked its name first. No test file has changed since your commit of the failing tests.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-2.md), attach it, and send [the check message](#the-check-message).

### Task 3. One report for a bad export (25 minutes)

**Dave asks.** "The portal sent a new export, invoices-messy.csv. When an export has bad rows, I want one report with every problem and its line number. No list and no total come from that file until it is fixed. And every invoice's vendor must be on our vendor list."

1. Send: "Show me data/invoices-messy.csv as a table with line numbers, and data/vendors.csv beside it. Line 1 is the header. Change nothing."
2. Find the bad lines yourself, from Dave's words in Task 2 and in this task. Write down how many there are, and their line numbers.
3. Send: "Run Friday's list for 2027-03-05 on invoices-messy.csv. Show me the whole output. Do not explain it, and do not fix anything." Read the error as you did in [Lab 13](https://agentfactory.panaversity.org/building-ai-workers/programming-fundamentals/lab/). Today's code stops at one bad row, and it says nothing about the others.
4. Send, with your own lines and count:

   > Write failing tests for a loader that does not exist yet. It checks every row of an export with my schema, and checks that the row's vendor is on the vendor list. It gives back the good invoices and a list of every problem, each with its line number, its invoice number and a message. It does not stop at the first problem. My cases: data/invoices.csv gives 15 good invoices and no problems. data/invoices-messy.csv gives [count] problems, on lines [your lines]. A row whose amount is blank is a problem, never a zero. Name the loader and place it as AGENTS.md says. Write only the tests, run them, and show me that they fail. Then commit only the tests, with the message "Failing tests for the export report".

5. Send:

   > Write the loader so my tests pass. Then make the script for Friday's list read its invoices through the loader. When an export has any problem, it prints the report, one line for each problem, with no list and no total, and the run ends as a failure. Do not change any test. Then run the tests, the type checker, and Friday's list for 2027-03-05, first on invoices.csv and then on invoices-messy.csv.

6. If a test for the messy export fails, the report differs from your lines. Send: "Show me the report for invoices-messy.csv, and say which of its lines are not in my test." Then decide which was wrong, your lines or the loader, and tell the agent to correct that one. A test changes only when you decide that its answer was wrong.
7. Send: "Commit, with the message "One report for a bad export"."

**Checkpoint:** on `invoices.csv`, Friday's list still prints 8 invoices, total $19,229.53. On `invoices-messy.csv`, it prints a report that matches the answer key, with no list and no total, and the run ends as a failure.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-3.md), attach it, and send [the check message](#the-check-message).

### Task 4. Talk to the AP system (35 minutes)

**Dave asks.** "The AP system holds the vendors and the open invoices. Get the vendors, and every page of open invoices. Give each call two seconds. When the server says it is busy, try once more. When it refuses our key, never try again."

A small server in the project stands in for the AP system. It runs only on your computer.

1. Make up a key, any short text, such as `ana-test-42`. Send, with your key: "Set up the key file for the sample AP system with my made-up key, [your key]. Then show me that git ignores that file." A real key never goes into a chat. You would type it into the file yourself.
2. Send: "Start the sample AP system in the background, and leave it running."
3. Say which status code each of these five calls will get, and write the five codes down. [14.7](https://agentfactory.panaversity.org/building-ai-workers/structuring-programs/json-and-rest-apis/#what-should-the-client-do-for-each-status-code) has the codes.

   | Call | What is asked |
   | --- | --- |
   | 1 | The vendors, with no key |
   | 2 | The vendors, with your key |
   | 3 | The vendors, with your key, again |
   | 4 | Page 2 of the open invoices, with your key |
   | 5 | Page 9 of the open invoices, with your key |

4. Send: "Make these five calls to the sample AP system by hand, one at a time, in this order, and show me the status code and the body of each: the vendors with no key. The vendors with my key. The vendors with my key, again. Page 2 of the open invoices, with my key. Page 9 of the open invoices, with my key." Compare the five codes with yours.
5. Send:

   > I will decide what our client does with four answers from the AP system. Ask me for them one at a time: (1) the server refuses the key, 401. (2) the server is busy, 503. (3) the server says the request is wrong, 400. (4) no answer comes within two seconds. For each, ask: "Try again, or stop? And how many requests does the server get in all?" Do not tell me the answer, and do not hint. When I have answered all four, show my answers in a table, and wait.

6. Answer each question from Dave's words. Where he said nothing, stop: a client tries again only when it has a reason to think the next answer will differ.
7. Send:

   > Write one failing test for each of my answers, for a client that does not exist yet. Name it and place it as AGENTS.md says, and test it as AGENTS.md says, so that each test counts the requests the server gets. Add two more tests: each page of the open invoices is asked for exactly once, and a server that stays busy gets two requests and no more. If the tests need a package, tell me its exact name, and install nothing yet. Write only the tests, run them, and show me that they fail. Then commit only the tests, with the message "Failing tests for the AP client".

   If the agent names a package, ask the three questions of Task 2, step 5, before you say yes. In Python the name should be `httpx`. In TypeScript no package is needed.
8. Send:

   > Write the client so my tests pass. It gets the vendors and every page of the open invoices, and it starts the vendors call and the first invoices call together. It checks every invoice in an answer with my schema. Do not change any test. Add a command that runs it against the sample AP system and prints how many vendors and open invoices it got, and how long it took, and add that command to the table in AGENTS.md. Then run the tests and the type checker.

9. Before the live run, say how many vendors and how many open invoices it will print. Each answer from the sample AP system takes about a third of a second, so say also whether the run takes nearer one second or three. Then send: "Run the client against the sample AP system, and show me what it prints." If the tests pass and the live run fails, read the error before you ask for help: [14.7](https://agentfactory.panaversity.org/building-ai-workers/structuring-programs/json-and-rest-apis/#why-did-the-tests-pass-and-the-live-run-fail) says what to look for.
10. Send: "Stop the sample AP system. Show me that my key is in no commit, and that no test file has changed since my commit. Then commit, with the message "The AP client, from my tests"."

**Checkpoint:** the five calls gave the codes in the answer key. The client's tests pass, and no test has changed. The live run prints the counts in the answer key, in about one second. Your key is in no commit.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-4.md), attach it, and send [the check message](#the-check-message).

### Task 5. Make it last (15 minutes)

**Dave asks.** "Write down what we accept, and what we do when it is wrong, where the next person will find it, and the next agent."

1. Send:

   > Write down what I decided today, so a new session knows it without this chat. Put the rules an agent must follow in AGENTS.md: what an invoice record may hold, what happens to an export with a bad row, and what the client does when the AP system is busy, refuses the key, or does not answer. Put the handover in NOTES.md: where the schema, the loader and the client are in my language, and that the other language does not have them yet. Say each thing once. Show me the diff before you commit.

2. Read the diff. Each rule should be there once, in plain words. If the agent added a rule you did not decide, ask it to take that rule out before you commit. A plain fact about where things stand is fine.
3. Send: "Commit, with the message "What we accept, written down", and tag the commit ch14."
4. Open a new session in the same folder. Send:

   > Answer from this project only, and name the file behind each answer. An export has one row with a negative amount. What does Friday's run print? And the AP system answers "busy" twice in a row to the vendors call: how many requests does our client make, and what happens then?

**Checkpoint:** the new session answers both questions from the project's files, and names them. The tag `ch14` is on `main`.

**Check it now.** In the new session, download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch14-key-task-5.md), attach it, and send [the check message](#the-check-message).

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

- In Task 3, today's code stopped at one bad row. How many bad rows did it never mention? One of them was an open invoice with a negative amount, and a list with it would have been $234.50 too low.
- The schema could not tell that a vendor is not on the vendor list. Which check caught it, and where does that check live? [14.5](https://agentfactory.panaversity.org/building-ai-workers/structuring-programs/schema-rules/#what-can-a-schema-not-check) says why.
- Your tests for the client count requests. Ask the agent what would still pass if it took the second try out of the client. A test that only looks at the answer would not notice.

### If you want more

Each of these is optional, and has no answer key.

- **The schema as a standard form.** Send: "Show me my invoice schema as JSON Schema." [Chapter 17](https://agentfactory.panaversity.org/building-ai-workers/connectors-and-mcp/a-tool-is-its-description/) uses that form to tell an AI model what a tool accepts.
- **The same work in the other language.** Send the messages of Tasks 2 to 4 again with the other language set in `AGENTS.md`, and use the same answers.
- **The same change on a second agent.** Open the folder in a second agent, from your commit of failing tests for the client, on a new branch, and send the message from Task 4, step 8. Compare what each agent asked before it acted.
- **A new question for the invoices.** Decide the total of the open invoices in `data/invoices.csv`, in cents. Have the agent write a failing test with your number, and then a method on the invoice book that passes it.

### If something goes wrong

| Problem | What to try |
| --- | --- |
| `git commit` says "Please tell me who you are" | Git does not know your name yet. Ask the agent to set your name and email for this project only, then to commit again. |
| The type checker is not found | The packages are not installed. Ask the agent to install them from the lock files. |
| `uv` downloads Python on the first run | That is normal when no Python 3.12 or later is installed. Let it finish. |
| The agent answers a value or a case for you | Say: "Do not answer for me. Ask the question again." |
| The agent edited a test to make it pass | Ask it to put the tests back as they are in your commit. Then tell it in one sentence that the tests are your decisions. |
| The agent works in the wrong language | Check the line "My language is:" in `AGENTS.md`, then start a new session. |
| The sample AP system will not start, or says its port is in use | An earlier copy is still running. Ask the agent to list what it has running in the background, and to stop the old one. |
| A call gets "connection refused" | The sample AP system is not running. Ask the agent to start it in the background. |
| Call 2 in Task 4 gives 200, not what the key says | Only the first vendors call with your key, after each start, is different. Ask the agent to restart the sample AP system, and make the five calls again. |
| A test about two calls starting together fails on a slow computer | Ask the agent to run it again with nothing else running. |
| Your key shows up in a commit | Ask the agent to put a new made-up key in the key file, and treat the old one as leaked. In real work, you would cancel it with whoever issued it. |
| The agent cannot read the attached key | Paste the key's text under the check message. |

### Apply it to your vertical

Take one export or API from your own work, and describe one record in your own words: every field, its type, and what makes a value invalid. Write three bad records by hand, each wrong in a different way. Ask any coding agent to write a loader test from them that expects all three to be reported, and read the test against your records before you approve it. Then ask it to write the loader. Name who receives the loader's report when it refuses a record, and what the run does then. If the data comes from an API, write down the status codes it can return, and what your client should do for each, before any code exists.

*Domain expert and builder.* The domain expert says what makes a record invalid, including the rules that compare records, such as an unknown vendor, and who must hear when a record is refused. The agent writes them as a schema and checks. The builder reads each rule against the expert's list, and keeps the keys out of the repository.
