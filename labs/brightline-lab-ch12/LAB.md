# Lab 12: the first repository, on three agents

Chapter 12 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 12: the first repository, on three agents](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/), so you can do the lab without the book.

*Time: about 2 hours 40 minutes, plus about 30 minutes if you do Task 8 in both Codex and OpenCode. Installing the apps is not included. Lab files: `brightline-lab-ch12.zip`. The same steps are in `LAB.md` inside the zip.*

### The job

Ana Morales, the accounts payable (AP) analyst at Brightline, keeps a folder of scripts that the team runs on invoice exports. Every Wednesday she makes the list of invoices due by Friday's payment run, by hand. Today is Wednesday, March 3, 2027, and the payment run is Friday, March 5, 2027. She has already made this week's list, and her note is in the lab files.

Your job is to make her folder safe for a coding agent, have the agent build that list as a tested script anyone can run with one command, and check its result against Ana's note. Then you give the same brief to a second agent, or to both other agents if you have the time, and compare what each one did.

### What you will learn

- Choose the folder and the permission mode before the first message, by how hard a mistake would be to undo ([12.2](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/the-workspace/), [12.3](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/permissions-and-plan/)).
- Write one `AGENTS.md` that every agent reads, see what a `CLAUDE.md` changes, and back the most important rule with a setting ([12.4](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/rules-the-agent-reads/)).
- Read the agent's plan against an answer you already know, before anything is built ([12.1](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/from-chat-to-coding-agent/), [12.3](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/permissions-and-plan/)).
- Judge "done" by that answer, not by the agent's passing tests ([12.1](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/from-chat-to-coding-agent/)).
- Hand work to a fresh session through a written note, and undo a change with git ([12.5](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/context-sessions-effort/)).
- Give the same brief and rules file to a second agent, and compare what each one asks and enforces ([12.7](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/both-ai-vendors/)).

### What you need

- The Claude desktop app with a Pro, Max, Ultra, Team or Enterprise plan. Without one, see "If you do not have a paid Claude plan" at the end of this page. On Pro, Max and Ultra, Claude Code shares its usage limit with chat. If the limit stops you, stop at the end of a task, and git keeps your place.
- A second agent for Task 8: Codex in the ChatGPT desktop app, on any ChatGPT plan, including Free, or OpenCode Desktop with a model connected, such as one of OpenCode's free models.
- Git, and Node.js 24 or later, installed on your computer. Download them from [git-scm.com](https://git-scm.com/downloads) and [nodejs.org](https://nodejs.org/en/download). If a step is unclear, ask Claude in a chat. The agent checks them in Task 2, and it should never install software on its own.

### The lab files

Download [brightline-lab-ch12.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12.zip) and unzip it into a new folder, such as `Documents/labs/`. Unzip a fresh copy, even if you practised in `brightline-ap` in 12.7. It holds five things:

- `brightline-ap/`, the starter project. It is the only folder you give an agent.
- `anas-note.md`, Ana's list for this week. Move it out of the lab folder, for example to your Desktop, and never give it to an agent. An agent's folder is not a wall ([12.2](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/the-workspace/)), and an agent that can read the answer is not tested by it.
- `opencode.jsonc`, OpenCode's safety settings, which Task 8 uses.
- `LAB.md`, a copy of these steps.
- `README.md`, which says what each file is.

Tasks 4 to 8 each link an answer key, a separate download. Open each key in a text editor, never in the agent.

### How each task works

Each task has a goal, steps and a **Checkpoint**. Do not start the next task until the checkpoint is true. Before you approve a command, read what the agent says it will do, and say no to anything you do not understand. Asking "What does this command do?" is always fine. If a button has moved, the practice sections in [12.7](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/both-ai-vendors/) show each step in each tool.

### Task 1. Look before you touch (10 minutes)

*Goal:* the agent explains the project without changing anything.

1. Open the Claude desktop app and select the *Code* tab.
2. Choose *Local* as the environment. Use *Open folder…* to pick `brightline-ap`, not the folder above it.
3. Set the permission mode to *Plan*. A new session may start in another mode, so check the selector. Leave the model and the effort at their defaults.
4. Send "Explain this project to me: what it is for, what each folder holds, and how to run its tests. Do not change anything."

**Checkpoint:** the agent described `data/`, `src/` and `tests/`, and it changed no files.

### Task 2. Put it under git (10 minutes)

*Goal:* every later change is saved in a version you can go back to.

1. Switch the permission mode to *Manual*, so the agent asks before each edit and command.
2. Send: "Check that git and Node.js 24 or later are installed. Then put this folder under git, with a main branch, make a first commit of everything here, and run the tests."
3. Approve each command when you agree with what it does. Expect a check of the versions, then `git init`, `git add`, `git commit` and `npm test`. If git or Node.js is missing, install it, then send the message again.
4. A command with `--global` changes git for the whole computer. Say no to it, and ask the agent to set the name and email for this project only.

**Checkpoint:** the agent reports one commit and passing tests.

### Task 3. Write one rules file for every agent (25 minutes)

*Goal:* a short, true `AGENTS.md` that every agent reads, and you have seen what a `CLAUDE.md` does to it.

1. Send this message as it is. The last rule is for the agent, so you do not need to follow it.

   > Read this project and write a short `AGENTS.md` at the top of it. Say what the project is, how to run its tests and where things go. Make sure it says these five things:
   >
   > - Never write to `data/`. The scripts and tests depend on it.
   > - Amounts are whole cents, never decimals such as 10.5.
   > - Every new script gets a test in `tests/`, and `npm test` must pass before you say you are done.
   > - Do not install packages without asking.
   > - Node runs the TypeScript files directly, with no build step. Use only type annotations, no `enum` or `namespace`, and import local files with the `.ts` extension.
   >
   > Then tell me, one line each, which of the five you could have worked out from the project on your own.

2. Approve the file. Then approve a commit with the message "Add AGENTS.md".
3. Click *+ New* to start a fresh session in the same folder, in *Manual* mode. Ask: "Without opening any file, what must you never do in this project? Name the file that told you." It should give the `data/` rule and name `AGENTS.md`. That one file is all Claude Code needs.
4. Now see what a `CLAUDE.md` changes. Claude Code's `/init` command writes this file, so a project can gain one by accident. Send: "Create a `CLAUDE.md` that holds one line, `Notes for Claude Code go here.`" Approve it.
5. Click *+ New* again, in *Manual* mode, and ask the same question. This time the session should not know the rule. The rule is still in `AGENTS.md`, but a `CLAUDE.md` replaces that file for Claude Code. Any other agent would still read it.
6. Bring the rule back. Send: "Replace everything in `CLAUDE.md` with the one line `@AGENTS.md`." Approve it. That line pulls `AGENTS.md` in, so there is still only one set of rules.
7. Click *+ New* once more, in *Manual* mode, and ask the same question. Then approve a commit with the message "Add CLAUDE.md that imports AGENTS.md".

**Checkpoint:** the fresh session in step 5 did not know the rule, and the one in step 7 gives the `data/` rule and names `AGENTS.md`.

### Task 4. Make the data rule a setting (15 minutes)

*Goal:* the rule that matters most is enforced by a setting, not only by words.

1. Still in *Manual* mode, send: "Create `.claude/settings.json` with a permission rule that denies edits to anything under `data/`, and an ask rule for `git push`. Before you save it, tell me in plain words what each rule does."
2. Approve the file when its description matches: edits under `data/` are denied, and `git push`, which sends your work online, asks first. A deny rule in this file applies as soon as it is saved.
3. Switch to *Accept edits*, so the agent edits files without asking. Now only the setting stands in the way.
4. Send: "This is a test of my settings file. For this one request only, try to edit `data/vendors.csv` and change the terms of vendor V001 to Net 45. Report exactly what happens."
5. Read the agent's report. A block by the setting says a permission rule denied the edit. If the agent refuses on its own, because `AGENTS.md` forbids it, ask it to try anyway, so the setting can show what it does. If the agent offers another way to change the file, such as a small program that writes it, say no.
6. Switch back to *Manual*. Ask the agent to show you `git status`, and check that nothing under `data/` changed.
7. Approve a commit with the message "Add project settings". Then ask the agent to tag the commit `rules`, a name for this saved version. The second agent in Task 8 starts from it.

**Checkpoint:** the setting blocked the edit to `data/vendors.csv`, nothing under `data/` changed, and the agent reports the tag `rules`.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-4.md).

### Task 5. Read the plan against Ana's note (20 minutes)

*Goal:* check the agent's plan against Ana's note, case by case, before anything is built.

1. Open `anas-note.md` in a text editor, and keep it beside the app. It lists the 8 invoices due by Friday, their total, and Ana's hard cases by invoice number.
2. In Claude Code, set the permission mode to *Plan*.
3. Send this brief as it is. It leaves out the rule for invoices with no due date, the case people forget, so you can see whether the plan catches it. In real work, put every rule you know in the brief. Do not add Ana's numbers to it.

   > *Outcome.* A script, `src/due-by-friday.ts`, that lists every open invoice due on or before a cutoff date, with a total. Run it with `npm run due -- 2027-03-05`. Today is Wednesday, March 3, 2027, and the cutoff for this week's payment run is Friday, March 5. Stop when `npm test` passes, with a test for each rule that decides whether an invoice is listed. I will check the result against my own list.
   >
   > *Context.* `data/invoices.csv` and `data/vendors.csv`. Read them. Their lines may end in Unix or Windows style.
   >
   > *Format.* One line per invoice, sorted by due date: due date, invoice number, vendor name, amount in dollars. Then a last line with the count and the total.
   >
   > *Constraints.* Do not change the data files. Plan only. Show me the plan, including how you will decide each invoice's due date, and wait.

4. Compare the plan with Ana's hard cases. For each kind, find what the plan does:
   - Invoices with no due date: does it work out their due date from the terms?
   - Paid invoices: does it leave them out?
   - Late invoices: does it keep them? "Due by Friday" includes them.
5. If the plan misses any of the three, reply with every correction it needs, in Ana's words. For an invoice with no due date, the due date is the invoice date plus the days in its terms, and "Due on receipt" means 0 days. Ask for a revised plan. If the plan already handles all three, tell it so.
6. If the plan asks about invoices due on Saturday or Sunday, answer from Ana's note: they wait for next week's run, because the cutoff is Friday.
7. Look back at the first plan, and note whether it caught the empty dates by itself. Task 9 asks.

**Checkpoint:** the plan works out an empty due date from the terms, leaves paid invoices out, and keeps late invoices in.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-5.md).

### Task 6. Let it work, then compare (20 minutes)

*Goal:* the script and its tests, and a result that matches Ana's note.

1. Switch the permission mode to *Accept edits*. The agent now edits files without asking, and it still asks before most commands. Some file actions inside the folder, such as making, moving, copying and even deleting files, also run without asking. That is one more reason git is your undo.
2. Send: "Go ahead with the revised plan."
3. When it says it is done, send: "List your tests in plain words, one line each, and tell me whether anything in `data/` changed." Check that there is a test for each kind of hard case in Ana's note.
4. Send: "Run `npm test`, then `npm run due -- 2027-03-05`." Approve both commands.
5. Compare the output with Ana's note: the count, the total and each hard case. Then download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-6.md), and compare the output with its table.
6. If it does not match, find the matching row in the key's "Common wrong answers". Tell the agent what is wrong in one sentence, and run it again. If no row matches, tell it which invoices differ from Ana's note.
7. When it matches, approve a commit.

**Checkpoint:** the script lists the same 8 invoices and total as Ana's note, the tests pass, and nothing under `data/` changed.

### Task 7. Hand over, then undo (15 minutes)

*Goal:* a new session can pick up the work, and you can undo a change you do not want.

1. Send "Write a short `NOTES.md` for the next person: what the due-by-Friday script does, how to run it, and the rule for an empty due date." Approve it, then approve a commit.
2. Click *+ New*. In the new session, send: "Read `NOTES.md` and explain the due-by-Friday script to me from the note alone."
3. Now practice the undo. In the same session, send: "Change the output to show amounts without the dollar sign." Let it make the change, but do not commit it.
4. Decide you do not want it. Send: "Show me which files changed since the last commit. Then undo those changes with git, and show me `git status` again." Approve each command.
5. If the agent made a new file in step 3, ask it to remove that file too.

**Checkpoint:** the new session explained the empty-date rule from `NOTES.md` alone, and the agent reports no changed files.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-7.md).

### Task 8. The same brief on a second agent (30 minutes)

*Goal:* the same brief and the same rules file on a second agent, and what that agent asks and enforces.

Choose Codex or OpenCode, whichever you have, and follow its steps. If you have the time and both apps, do the other one too.

#### Codex

1. Open the ChatGPT desktop app and choose *Codex*. Open the `brightline-ap` folder, set *Work in* to *This computer*, and set the permission mode to *Ask for approval*.
2. Send: "Start a new branch called `port-codex` from the tag `rules`, and switch to it." Approve the command. The branch starts from the rules and the settings, before the script existed. Your script stays safe on `main`.
3. Ask: "What rules does this project give you, and which file did you read them from?" It should name `AGENTS.md`. The settings file from Task 4 is for Claude Code, so it does not bind Codex.
4. Test the `data/` rule. Send: "For this one request only, change the terms of vendor V001 in `data/vendors.csv` to Net 45." If it asks to make the change, say no.
5. Ask Codex to show `git status`. If `data/vendors.csv` changed, nothing stopped it, and that is your answer for Task 9. Ask Codex to restore the file with git.
6. Turn on plan mode with `/plan`. Then send the brief from Task 5, unchanged.
7. Read the plan against Ana's note, and correct it as you did in Task 5, with one exception. If it misses the empty due dates, leave that for step 9.
8. Turn plan mode off with `/plan`, then send "Go ahead with the revised plan." Approve each step.
9. Ask Codex to run the tests and the script, and compare the result with Ana's note. If you left the empty due dates out, the tests may pass on a list that is wrong. Give that correction now, and run it again.
10. If it still does not match after two corrections, note what went wrong, and go on to Task 9, which asks.
11. When it matches, approve a commit on the `port-codex` branch.

**Checkpoint:** you know what stopped the edit in `data/`, and on `port-codex` the script lists the same 8 invoices and total as Ana's note, or you noted what went wrong.

**Check it now.** Download [the Codex key for Task 8](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-8-codex.md).

#### OpenCode

1. Install OpenCode Desktop from [opencode.ai/download](https://opencode.ai/download). Open the `brightline-ap` folder, and connect a model with `/connect`. One of OpenCode's free models is enough.
2. Before you send any task, turn auto-accept off for this project, under Settings, then Projects. OpenCode allows almost everything by default, and it does not sandbox the agent.
3. Copy `opencode.jsonc` from the lab folder into `brightline-ap`. It makes every edit, every shell command and any reach outside the folder ask first, and it denies any edit in `data/`. It uses the form of OpenCode version 2, from its [Permissions page](https://opencode.ai/v2/docs/permissions/).
4. Test it. Ask OpenCode to create an empty file called `test.txt`. It must ask first, and you say no.
5. Ask OpenCode to change the terms of vendor V001 in `data/vendors.csv` to Net 45. It must refuse without asking you, because the rule denies it.
6. Send: "Start a new branch called `port-opencode` from the tag `rules`, and switch to it." Approve the command. Your script stays safe on `main`.
7. Choose the *plan* agent. Ask which rules it read, and from which file. Then send the brief from Task 5, unchanged.
8. Read the plan against Ana's note, and correct it as you did in Task 5, with one exception. If it misses the empty due dates, leave that for step 10.
9. Switch to the *build* agent and let it work, approving each edit and command.
10. Ask it to run the tests and the script, and compare the result with Ana's note. If you left the empty due dates out, the tests may pass on a list that is wrong. Give that correction now, and run it again.
11. If it still does not match after two corrections, note what went wrong, and go on to Task 9, which asks.
12. When it matches, approve a commit on the `port-opencode` branch, including `opencode.jsonc`.

**Checkpoint:** OpenCode asked before every edit and command and refused the edit in `data/`, and on `port-opencode` the script lists the same 8 invoices and total as Ana's note, or you noted what went wrong.

**Check it now.** Download [the OpenCode key for Task 8](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-8-opencode.md).

### Task 9. Compare and tag (15 minutes)

*Goal:* a written record of what changed between the agents, and a tagged result.

1. Back in the Claude desktop app, click *+ New*, and set the permission mode to *Manual*.
2. Send: "Switch to the main branch." Approve the command.
3. Send this brief. Put the name of your second agent in place of the brackets, or both names if you did both.

   > Help me write `ports/ch12.md`, comparing the agents I used in this lab: Claude Code and [Codex or OpenCode]. For each agent, ask me these six questions in one message, numbered, and wait for my answers:
   >
   > 1. Did it read `AGENTS.md`? Yes or no, then how I know.
   > 2. What guarded `data/`: a setting, a sandbox, or only the words?
   > 3. What did it ask before acting, and what did it do without asking?
   > 4. Did its first plan catch the empty due dates? Yes or no.
   > 5. Did its result match Ana's note? Yes or no.
   > 6. What did I have to change in my brief or settings, and why?
   >
   > Then ask which agent I would give this job to next week, and why. Write the file from my answers only, show it to me, and wait.

4. Answer each question in a few words. There is no right answer to the last one. The reason is what counts.
5. Approve the file when it says what you said. Then approve a commit, and ask the agent to tag it `ch12`.

**Checkpoint:** `ports/ch12.md` is on the main branch, and the agent reports the tags `rules` and `ch12`.

### If you do not have a paid Claude plan

Claude Code needs a paid plan. You can do the lab with Codex or OpenCode as your first agent instead.

1. Do Tasks 1 to 7 in Codex or OpenCode.
2. Where a task says *Plan*, *Manual* or *Accept edits*, use your tool's control, as [12.7's permissions practice](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/both-ai-vendors/#practice-permissions-and-a-plan) shows. Where it says *+ New*, start a new chat in Codex or a new session in OpenCode, as [12.7's sessions practice](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/both-ai-vendors/#practice-context-and-sessions) shows.
3. If you use OpenCode, set its safety rules before Task 1, as in Task 8's OpenCode steps 2 to 5.
4. In Task 3, stop after step 3, because the steps after it are about Claude Code. Start the fresh session the way your tool does, and the checkpoint is that it gives the `data/` rule and names `AGENTS.md`.
5. Skip Task 4, because its settings file is for Claude Code. At the end of Task 3, ask the agent to tag the commit `rules`.
6. In Task 8, your second agent is the one you did not use.
7. Do Task 9 in the agent you used first, for the two agents you used.

### If something goes wrong

| Problem | What to try |
| --- | --- |
| The Code tab asks you to upgrade | Claude Code needs a paid plan. See "If you do not have a paid Claude plan". |
| The tests say a file or module was not found | Ask the agent to check the Node.js version. The lab needs Node.js 24 or later. |
| Node reports a syntax error in a `.ts` file | The agent used TypeScript that Node cannot run directly. Point it to the last rule in `AGENTS.md`. |
| The agent wants to install a package | Say no. The lab needs no packages. Ask it to use what Node already has. |
| The agent changed a file in `data/` | Ask the agent to restore `data/` with git, and approve it. Then check the setting from Task 4 and the rule in `AGENTS.md`. |
| The result uses today's real date | The brief gives the date. Tell the agent to use the cutoff from the command, never the computer's clock. |
| Claude Code does not know a rule in `AGENTS.md` | Look for a `CLAUDE.md` or `CLAUDE.local.md` in the project or a folder above it. Make `@AGENTS.md` the top line of `CLAUDE.md`. |
| Codex or OpenCode does not mention `AGENTS.md` | Check that you opened `brightline-ap`, and that you are on a branch made from `rules`. |
| OpenCode did not ask before an edit | Stop. Check auto-accept and `opencode.jsonc`, then start a new session. |
| The count is short on Windows | The data files may have Windows line endings. Tell the agent: "The lines may end in Windows style. Handle both, with a test for each." |
| The agent says it is done, but the total is wrong | Do not argue. Find the row in "Common wrong answers" in Task 6's answer key, and give one correction. |

### Apply it to your vertical

Pick one folder from your own work that a script could help with, such as weekly exports or a set of templates. Pick data that may leave the company, because everything the agent reads is sent to the model's provider ([12.2](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/the-workspace/)). Copy it, never the original. Ask an agent to put the copy under git and to draft an `AGENTS.md`, and answer its questions about your rules. Add the one rule that would hurt most if broken, both as a line in `AGENTS.md` and as a setting. Then, outside the copy, write down the cases you know and the result you expect from one small script. Ask the agent for a plan for that script, read the plan against your cases, and stop at the plan. If your project has a web page, ask the agent to open it in its browser pane after a change and tell you what it sees, then check the page yourself.

*Domain expert and builder.* The domain expert gives the rule that must never be broken and the hidden case, such as Brightline's empty due dates. The builder sets up the repository, the settings and the checks.

### Artifact checklist

- [ ] `brightline-ap` is a git repository with a main branch
- [ ] `AGENTS.md` holds the five rules from Task 3, and `CLAUDE.md` holds `@AGENTS.md` (Claude Code only)
- [ ] `.claude/settings.json` denies edits under `data/` (Claude Code only)
- [ ] `src/due-by-friday.ts` and its tests, with the tests passing
- [ ] The script lists 8 invoices and $19,229.53 for the cutoff 2027-03-05, as Ana's note says
- [ ] `NOTES.md`, the handover a new session can work from
- [ ] A branch for your second agent, `port-codex` or `port-opencode`, with its own script
- [ ] `ports/ch12.md` on main, with your answers for each agent and your choice for next week
- [ ] The tags `rules` and `ch12`
- [ ] Optional: an `AGENTS.md` and a setting for a copy of one folder from your own work
