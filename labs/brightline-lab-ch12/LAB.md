# Lab 12: the first repository, on three agents

Chapter 12 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 12: the first repository, on three agents](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/), so you can do the lab without the book.

*Time: about 4 hours 5 minutes. Lab files: `brightline-lab-ch12.zip`, standalone. The same steps are in `LAB.md` inside the zip.*

### Before you start

*What you need.*

- The Claude desktop app with a Pro, Max, Team or Enterprise plan, for Tasks 1 to 9 and 12.
- For the step in Task 8 that runs with nobody watching, the Claude Code command-line version. It is a separate install. Follow Anthropic's [setup page](https://code.claude.com/docs/en/setup). If you cannot install it, skip that step and say so in `ports/ch12.md`.
- The ChatGPT desktop app with any ChatGPT plan, including Free, for Task 10.
- OpenCode Desktop and access to a model, for Task 11. That can be an API key from a model provider, a ChatGPT Plus or Pro plan, a local model, or OpenCode's Go plan. Since version 2.2.3, you can also use your Claude Code login, through OpenCode's Claude Agent provider. This lab covers OpenCode version 2.
- Git, and Node.js 24 or later. Check them in a terminal with `git --version` and `node --version`. If either is missing, install it before you begin. The agent should not install software on its own.

**The core path and the extensions.** The core path is Tasks 1 to 7, at least one port (Task 10 or 11), and Task 12. Tasks 8 and 9, the optional mod and the second port are extensions. Do them if you have the time and the apps.

**Without a paid Claude plan.** Tasks 1 to 9 are written for Claude Code. Do Tasks 1 to 3 and 5 to 7 in Codex or OpenCode instead. The practice sections in [12.7](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/both-ai-vendors/) show each step in Codex and OpenCode. Draft `AGENTS.md` only, with `/init` in Codex or by asking OpenCode's *build* agent, so skip `CLAUDE.md`. There is no environment to save in Task 2. In Task 6, check that nothing in `data/` changed, in the review pane or with `git status`. Before Task 1, set that agent's safety rules as Task 10 (step 2) or Task 11 (step 3) describes. Skip Tasks 4, 8 and 9, which need Claude Code's settings, skills and side chats. At the end of Task 3, commit and run `git tag rules` yourself, because Task 4 normally does it and the ports start from that tag. Your port is the agent you did not use: Task 11 if you used Codex, Task 10 if you used OpenCode. Do Task 12 in the agent you used for the core tasks. Say in `ports/ch12.md` which tasks you skipped and why.

**With only one app.** Skip the port tasks you cannot do, and write those ports as a plan in Task 12.

**Exact steps.** Click paths and shortcuts change often. If a button in this lab has moved, check the practice sections in [12.7](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/both-ai-vendors/), which hold each step for each tool and are checked every month.

**The lab files.** Download [brightline-lab-ch12.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12.zip) and unzip it into a new folder, such as `Documents/labs/`. It holds `brightline-ap/`, the starter repository, which is the only folder you give an agent, and a copy of these steps. Each task with an answer key links it as a separate download. Open a key in a text editor, never in the agent. An agent that can read the answers is not tested by them.

**The date in this lab.** Today in the lab is Wednesday, March 3, 2027. Brightline's payment run is Friday, March 5. Your computer's clock will show a different date, so the brief gives the date to the agent.

### The job

Ana Morales, the AP analyst at Brightline, has a folder of scripts that the team runs on invoice exports. Nobody has put it under version control, there are no rules for an agent to follow, and every Wednesday someone builds the list of invoices due by Friday by hand. Your job is to make the folder safe for a coding agent to work in, then have the agent build that list as a tested script that anyone can run with one command. Then you hand the same brief to two other agents and record what changed.

You will finish with a repository that any of the three agents can open and follow.

### How each task works

Each task has a goal, the steps, and a **Checkpoint**. Where a step sets a mode, opens a side chat or runs a command with nobody watching, the exact steps for your tool are in the practice sections of [12.7](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/both-ai-vendors/). Do not start the next task until the checkpoint is true. Times are a guide. Read every command the agent wants to run before you approve it, and say no to anything you do not understand. Asking "What does this command do?" is always allowed.

### Task 1. Look before you touch (10 minutes)

*Goal:* the agent explains the repository without changing anything.

1. Open the Claude desktop app and select the *Code* tab.
2. Choose *Local* as the environment. Use *Open folder…* to pick `brightline-ap`, not the folder above it.
3. Set the permission mode to *Plan*. A new session may start in Auto, so check the selector. Leave the model and effort at their defaults.
4. Send "Explain this repository to me: what it is for, what each folder holds, and how to run the tests. Do not change anything."
5. Read the answer. Check it against `README.md`.

**Checkpoint:** the agent described `data/`, `src/` and `tests/` correctly, and it made no edits and ran no commands that change files.

### Task 2. Put it under git (10 minutes)

*Goal:* every later change has a record you can undo.

1. Switch the permission mode to *Manual*, so the agent asks before each edit and command.
2. Send: "Put this folder under git, with a main branch, and make a first commit of everything here. Then run the tests."
3. Approve each command only after you have read it. Expect `git init`, `git add`, `git commit` and `npm test`. If the agent wants to change your global git settings, say no and ask it to set the name and email for this repository only.

4. Save this setup so later sessions start in the right place. Open the environment selector under the prompt box, choose *New environment*, pick *Local*, add the `brightline-ap` folder, leave *Worktree* off, and select *Create environment*. If your app does not offer saved environments yet, keep using *Open folder…*.

**Checkpoint:** `git log --oneline` shows one commit, `npm test` passes, and `brightline-ap` is in the environment selector, or you are using *Open folder…* on an earlier layout.

### Task 3. Write one rules file for every agent (20 minutes)

*Goal:* a short, true `AGENTS.md` that all three agents will read, and a `CLAUDE.md` that imports it.

1. Run `/init`. Claude Code reads the repository and drafts a `CLAUDE.md`.
2. Read the draft. Then send: "Move the project rules into a new `AGENTS.md`. Make `CLAUDE.md` contain only the line `@AGENTS.md` and anything that applies to Claude Code alone."
3. Open `AGENTS.md` and make sure it answers the five questions from Concept [12.4](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/rules-the-agent-reads/). Add what the draft missed. These five rules must be in it, in your own words:
   - Never write to `data/`. The scripts and tests depend on it.
   - Amounts are whole cents. Never use floating-point money.
   - Every new script gets a test in `tests/`, and `npm test` must pass before you say you are done.
   - Do not install packages without asking.
   - Node runs the TypeScript files directly, with no build step. Use only type annotations, no `enum` or `namespace`, and import local files with the `.ts` extension.
4. Approve a commit with the message "Add rules files".
5. Click *+ New* to start a fresh session in the same folder. Ask: "What must you never do in this repository?"

**Checkpoint:** the new session names the `data/` rule without being told.

### Task 4. Enforce the rule that matters most (15 minutes)

*Goal:* the `data/` rule is enforced by a setting, not only written in words.

1. Still in *Manual* mode, send: "Create `.claude/settings.json` with a permission rule that denies edits to anything under `data/`, and an ask rule for `git push`. Show me the file before you save it." The file should look like this:

   ```json
   {
     "permissions": {
       "deny": ["Edit(/data/**)"],
       "ask": ["Bash(git push *)"]
     }
   }
   ```

2. Approve the file. A deny rule in a project settings file applies as soon as the file is saved, in the same session.
3. Test it. `AGENTS.md` already tells the agent never to write to `data/`, so it may refuse on its own, and that would not test the setting. Switch to *Accept edits* and send: "This is a test of my settings file. For this one request only, try to edit `data/vendors.csv` and change the terms of vendor V001 to Net 45. Report exactly what happens." Claude Code must block the edit. Read the message: a block by the settings says the action was denied by a permission rule, not that the agent chose not to. The deny rule also blocks file commands it recognizes in the shell, such as `sed`. If the agent offers another way, such as a small script that opens the file itself, say no. A script like that is not covered by the rule, which is why the rule stays in `AGENTS.md` and git stays your undo.
4. Run `git status`. Nothing in `data/` changed.
5. Switch back to *Manual*. Approve a commit with the message "Add project settings". Then ask the agent to run `git tag rules`. The ports in Tasks 10 and 11 start from this tag.

**Checkpoint:** the edit to `data/vendors.csv` was blocked, `git status` was clean, and `git tag` lists `rules`.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-4.md) and open it in a text editor, not in the agent.

### Task 5. Write your check, then ask for a plan (35 minutes)

*Goal:* know the right answer before the agent does, and use it to catch a wrong assumption before it becomes code.

1. Before you send anything, write your check. Open `data/invoices.csv` in a text editor or a spreadsheet, not in the agent. Today is Wednesday, March 3, 2027, and the cutoff is Friday, March 5. An invoice is due by Friday when it is open and its due date is on or before the cutoff, so late invoices count. Four rows have no `due_date`. Their due date is `invoice_date` plus the days in `terms`, and "Due on receipt" means 0 days.
2. In a new file outside `brightline-ap`, such as `Documents/labs/my-check.md`, write the invoices due by Friday, their count and their total. Then name the hard cases by invoice number: the rows with no `due_date`, the paid invoices and the late ones. Keep this file out of the agent's folder. An agent that can read your answer is not tested by it.
3. Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-5.md) and open it in a text editor, not in the agent. Fix your check if it differs.
4. Set the permission mode to *Plan*.
5. Send this brief. It is a Four-Part Brief, and it leaves one thing out on purpose. Do not add your numbers to it.

   > *Outcome.* A script, `src/due-by-friday.ts`, that lists every open invoice due on or before a cutoff date, with a total. Run it with `npm run due -- 2027-03-05`. Today is Wednesday, March 3, 2027, and the cutoff for this week's payment run is Friday, March 5. Done when `npm test` passes, with a test for each rule that decides whether an invoice is listed.
   >
   > *Context.* `data/invoices.csv` and `data/vendors.csv`. Read them. Their lines may end in Unix or Windows style.
   >
   > *Format.* One line per invoice, sorted by due date: due date, invoice number, vendor name, amount in dollars. Then a last line with the count and the total.
   >
   > *Constraints.* Do not change the data files. Plan only. Show me the plan, including how you will decide each invoice's due date, and wait.

6. Compare the plan with your check, line by line. For each kind of hard case, ask what the plan does with it:
   - The rows with no `due_date`: does it work out their due date from the terms?
   - The paid invoices: does it leave them out?
   - The late invoices: does it keep them? "Due by Friday" includes them.
7. Reply with every correction the plan needs, in the words of your check. For the empty dates, use the rule from step 1. Ask for a revised plan. If the plan asks about invoices due on Saturday or Sunday, answer from your check: the cutoff is Friday, so they wait for next week's run.

**Checkpoint:** your check names 8 invoices, $19,229.53, and its hard cases by number, in a file outside `brightline-ap`. The revised plan names all three rules: empty dates from terms, paid invoices out, late invoices in. Write down whether the first plan caught the empty dates by itself. You will need it in Task 12.

### Task 6. Let it work, then check it (20 minutes)

*Goal:* the script and its tests, and a result that matches your check.

1. Switch the permission mode to *Accept edits*. The agent can now edit files without asking. It still asks before most commands. Common file commands inside the folder, such as `mkdir`, `mv`, `cp` and even `rm`, run without asking. That is one more reason git is your undo.
2. Send: "Go ahead with the revised plan."
3. When it says it is done, open the *Changes* card and check that nothing in `data/` changed. Ask the agent to list its tests in plain words, one line each, and check that there is one for each kind of hard case in your check.
4. Run `npm test` and `npm run due -- 2027-03-05` yourself, or approve the agent running them.
5. Compare the output with your check from Task 5: the count, the total and each hard case. Then download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-6.md) and open it in a text editor, not in the agent. Compare the output with its table.
6. If the result is wrong, find the matching row in "Common wrong answers", tell the agent what is wrong in one sentence, and run it again.
7. When it matches, approve a commit.

**Checkpoint:** 8 invoices, total $19,229.53, as your check says. `npm test` passes, and `git diff rules --stat` shows no change under `data/`.

### Task 7. Hand over, then undo (15 minutes)

*Goal:* a new session can pick up the work, and you can undo a bad change with git.

1. Send "Write a short `NOTES.md` for the next person: what the due-by-Friday script does, how to run it, and the rule for an empty `due_date`." Read it, then approve a commit.
2. Click *+ New*. In the new session, send: "Read `NOTES.md` and explain the due-by-Friday script to me, without opening the code."
3. Now practice the undo. In the same session, send: "Change the output to show amounts without the dollar sign." Let it make the change. Do not commit.
4. Decide you do not want it. Run `git status` and `git diff` to see which files changed. Then restore only those files, for example `git restore src/due-by-friday.ts`. `git restore` throws away changes you have not staged or committed, in the files you name. It does not delete new files the agent created, so run `git status` again and remove any file you did not want.

**Checkpoint:** the new session explained the empty-date rule from `NOTES.md` alone, and `git status` shows no changed files.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-7.md) and open it in a text editor, not in the agent.

### Task 8. Make it one command, then run it headless (25 minutes)

*Goal:* anyone on the team can run the Wednesday list by name, and a script can check the tests with nobody watching.

1. In *Manual* mode, send: "Create a project skill at `.claude/skills/due-by-friday/SKILL.md`. It should run `npm run due -- $ARGUMENTS`, then `npm test`, and report the count, the total, the listed invoices whose due date came from their terms, and whether the tests passed. It must not change any files. Set `disable-model-invocation: true`, so it runs only when someone calls it." Read the file. It should look like this:

   ```markdown
   ---
   name: due-by-friday
   description: List the open invoices due by a cutoff date and check the tests.
   disable-model-invocation: true
   ---

   Run `npm run due -- $ARGUMENTS`. Then run `npm test`.
   Report the number of invoices, the total, the listed invoices whose due date
   came from their terms, and whether every test passed.
   Do not change any files.
   ```

2. Approve it and commit. Then click *+ New*, type `/due-by-friday 2027-03-05`, and approve the two commands.
3. **Headless.** Open a terminal in `brightline-ap`. This step uses the command-line version. On Windows, run it in Git Bash or WSL, because the quotes differ in PowerShell. Run:

   ```bash
   claude -p "Run npm test and report whether every test passed, and how many tests ran." \
     --allowedTools "Bash(npm test),Bash(npm test *)" \
     --output-format json \
     --json-schema '{"type":"object","properties":{"passed":{"type":"boolean"},"tests":{"type":"integer"}},"required":["passed","tests"]}'
   ```

4. Find the `structured_output` field in the JSON it prints. That is the part a pipeline would read.
5. Run the same command again without the `--allowedTools` line. A headless run starts in Manual mode with nobody to ask, so the test command should be denied, unless a setting or hook you already have allows it, such as Auto set as your default mode. Compare the two results, and write down what decided the second one.

**Checkpoint:** `/due-by-friday 2027-03-05` reports 8 invoices and $19,229.53, with INV-8305 and INV-8314 dated from their terms, as your check says, and the first headless run's `structured_output` shows `"passed": true`. If you skipped the headless step, write why in your notes.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-8.md) and open it in a text editor, not in the agent.

### Task 9. Split the work across sessions (25 minutes, plus 15 for the optional mod)

*Goal:* one job split across a second session, a subagent and a side chat, with each part reviewed before it is committed. Then an audit of what the agent loads.

1. Click *+ New*, set the mode to *Accept edits*, and send: "Two jobs. First, add a total per vendor to the due-by-Friday output, below the invoice lines, with a test. Second, an unrelated job: update `README.md` to explain the `/due-by-friday` command. Start the README job as a separate session that reports back to this one, and do not let either job touch the other's files."
2. If Claude offers to run the README job in another session, accept that offer. The new session appears under this one in the sidebar. If your app does not offer this yet, start a second session yourself with *+ New* and give it the README job. Either way, the two jobs edit different files. If Claude later shows a card suggesting another task, read what it would do and where it would run before you choose *Start*, *Do it here* or neither. Write down what it suggested.
3. While Claude works, open a side chat with Cmd+semicolon on macOS, Ctrl+semicolon on Windows, or `/btw`. Ask: "Has anything in this session touched `data/`?" Close the side chat. Its question and answer do not appear in the main session.
4. When the vendor totals are done, send: "Use a subagent to check the new code against `AGENTS.md` and report only rule breaks." Read the summary it returns.
5. Check the vendor totals: they must add up to $19,229.53, the total in your check from Task 5. Then run `npm test`, and commit the vendor totals and the README as two separate commits.
6. Run `/doctor prompt-audit`. It reports on your `CLAUDE.md` and `AGENTS.md` files and on the rules, skills, commands, subagents and output styles under `.claude/`, and changes nothing until you ask. Pick one finding, decide whether you agree, and write it in your notes. Accept a change only if you understand it.
7. **Optional, 15 minutes: a small mod.** A mod is code that runs inside Claude Code with your rights, so you read it before it runs.
   - Set the mode to *Manual* and send "Make a mod that shows 'Payment run cutoff: Friday, March 5, 2027' in the band above the prompt. It should only draw that line. It must not read files, run commands, make network requests or approve tool calls."
   - Claude writes the mod in its own folder under `~/.claude/dev-mods/`, outside the repository, and asks before it saves each file. Read each file before you approve it. In `hooks/register.js`, each `on(...)` line names an event the mod reacts to. Each call that starts with `$.` is something the mod asks Claude Code to do. For this mod, expect `ui.render` with `AbovePrompt`, and no calls that start with `$.fs`, `$.process` or `$.http`.
   - When Claude Code asks whether to enable hot reloading, choose *Enable for this session*. The band appears when the turn ends.
   - If you installed the command-line version in Task 8, ask Claude to run `claude plugin validate` on the mod's folder and show you the `hooks:` and `calls:` lines.
   - The mod loads only in this session. In your notes, write which events it used, and what a mod like it could reach if you had not read it.

   If your app does not offer mods yet, skip this step and say so in your notes.

**Checkpoint:** two new commits, `npm test` passes, the per-vendor totals add up to $19,229.53, and your notes hold the side chat's answer, the subagent's summary and one audit finding. If you did step 7, the band shows the cutoff date, and your notes list the mod's events and calls.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-9.md) and open it in a text editor, not in the agent.

### Task 10. Port to Codex (30 minutes)

*Goal:* the same brief on a second agent, from the same rules file, with a review before you commit.

1. In a terminal, in `brightline-ap`, run `git switch -c port-codex rules`. This starts a branch from the rules and settings, before the script existed.
2. Open the ChatGPT desktop app and choose *Codex* instead of ChatGPT. Open the `brightline-ap` folder, set *Work in* to *This computer*, and set the permission mode to *Ask for approval*.
3. Ask: "What rules does this repository give you, and which file did you read them from?" It should name `AGENTS.md`. Note that `.claude/settings.json` does not bind Codex. Only the words in `AGENTS.md` and Codex's own sandbox do.
4. Turn on plan mode with `/plan`, then send the same brief from Task 5, unchanged. Read the plan for the same three things. Correct it the same way if you need to.
5. Approve the work. If a suggested next prompt appears in the message box, read it before you accept it with Tab. Before you commit, type `/review` and choose *Review uncommitted changes*. Read the findings. Fix anything real, then check that nothing in `data/` changed. Then ask: "Use a subagent to check the new script against `AGENTS.md` and report only rule breaks," and compare its summary with Claude's in Task 9.
6. Run the tests and the script, compare the result with your check from Task 5 and then with the key, and commit on the `port-codex` branch.
7. **Optional, cloud.** Only if `brightline-ap` is already in a GitHub repository you may use: set *Work in* to *Cloud*, create an environment from that repository, and send "Run npm test and report how many tests pass. Do not change any files." It runs on OpenAI's machines from a copy, so it cannot see anything on your computer. Do not put a real company repository in the cloud for this lab.

**Checkpoint:** 8 invoices, $19,229.53, on the `port-codex` branch. You have notes on what Codex asked, what it did without asking, and what `/review` found.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-10.md) and open it in a text editor, not in the agent.

**Without the ChatGPT app.** Skip this task and run `git switch main`. In Task 12 you write the Codex part of `ports/ch12.md` as a plan instead. Say which file Codex would read, how it would enforce the `data/` rule, which permission mode you would choose for Task 5 and Task 6, and why. Use Concept [12.7](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/both-ai-vendors/).

### Task 11. Port to OpenCode, safely (25 minutes)

*Goal:* the same brief on an open-source agent, with the safety rules set before the first task.

1. Run `git switch main`, then `git switch -c port-opencode rules`.
2. Install OpenCode Desktop from [opencode.ai/download](https://opencode.ai/download). Open the `brightline-ap` folder and connect a model with `/connect`.
3. **Before you send any task**, set the safety rules. OpenCode allows almost everything by default and does not sandbox the agent.
   - Make sure auto-accept is off for this project, under Settings, then Projects.
   - Create a file called `opencode.jsonc` in the `brightline-ap` folder with these lines. They make every edit, every shell command, and any reach outside the folder ask first, and they deny any edit in `data/`. OpenCode allows files outside the project by default, so the third line matters. When rules overlap, the last matching rule wins, so the `data/` line comes after the edit line.

     ```jsonc
     {
       "$schema": "https://opencode.ai/config.json",
       "permissions": [
         { "action": "edit", "resource": "*", "effect": "ask" },
         { "action": "shell", "resource": "*", "effect": "ask" },
         { "action": "external_directory", "resource": "*", "effect": "ask" },
         { "action": "edit", "resource": "data/*", "effect": "deny" }
       ]
     }
     ```

     This is the version 2 form from OpenCode's [Permissions page](https://opencode.ai/v2/docs/permissions/). Examples you find elsewhere may use `permission` and `bash`. Those belong to an older version, so do not copy them.
   - Test it. Ask OpenCode to create an empty file called `test.txt`. It must ask first. Say no.
   - Test the `data/` line. Ask OpenCode to change the terms of vendor V001 in `data/vendors.csv` to Net 45. It must refuse without asking you, because the rule denies it. Like Claude Code's deny rule, it covers the edit tool, not a shell command or script, so the shell line still makes those ask.
4. Choose the *plan* agent. Ask which rules it read and from which file, then send the same brief from Task 5.
5. Read and correct the plan as before. Then switch to the *build* agent and let it work, approving each edit and command. When it is done, ask: "Use the explore subagent to list every place the script reads from `data/`." Explore is read-only.
6. Run the tests and the script, compare the result with your check from Task 5 and then with the key, and commit on the `port-opencode` branch, including `opencode.jsonc`.

**Checkpoint:** 8 invoices, $19,229.53, on the `port-opencode` branch. OpenCode asked before every edit and command, and it refused the edit in `data/`.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch12-key-task-11.md) and open it in a text editor, not in the agent.

### Task 12. Compare and tag (15 minutes)

*Goal:* a written record of what changed between the three agents, and a tagged result.

1. Run `git switch main`. Back in the Claude desktop app, or in the agent you used for the core tasks, open a new session and set it to ask before every edit (*Manual* in Claude Code).
2. Ask the agent to create `ports/ch12.md` from your notes. Type or paste the notes yourself, because the agent did not see the other two sessions. For each agent, record:
   - whether it read `AGENTS.md`, and how you know
   - how it enforced the `data/` rule: a setting, a sandbox, or only the words
   - how it split work: a subagent, a second session, a side chat, and what each cost you in time or clarity
   - what it asked before acting, and what it did without asking
   - whether its first plan caught the empty `due_date` rule
   - whether its result matched your check from Task 5
   - what you had to change in your brief or your settings, and why

   For an app you did not have, write the same points as a plan instead, using Concept [12.7](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/both-ai-vendors/).
3. End the file with one paragraph: which agent you would give this job to next week, and why. There is no right answer. The reason is what counts.
4. Commit, then run `git tag ch12`.

**Checkpoint:** `ports/ch12.md` is on main, and `git tag` lists `rules` and `ch12`.

### If something goes wrong

| Problem | What to try |
| --- | --- |
| The Code tab asks you to upgrade | Claude Code needs a paid plan. Follow the note "Without a paid Claude plan" under "Before you start": do Tasks 1 to 3 and 5 to 7 in Codex or OpenCode, and skip Tasks 4, 8 and 9. |
| `npm test` says the file or module was not found | Check `node --version`. The lab needs Node.js 24 or later. Check that local imports end in `.ts`. |
| Node reports a syntax error in a `.ts` file | The agent used TypeScript that Node cannot run directly, such as an `enum`. Point it to the rule in `AGENTS.md`. |
| The agent wants to install a package | Say no. The lab needs no packages. Ask it to use Node's built-in modules. |
| The agent changed a file in `data/` | Run `git restore data/`. Check `.claude/settings.json` and `AGENTS.md`, and look for a script that wrote the file itself. |
| The result uses today's real date | The brief gives the date. Tell the agent to use the cutoff from the command line, never the system clock. |
| `claude` is not found in the terminal | The command-line version is a separate install. See the setup page, or skip the headless step. |
| The headless run prints an error about `--json-schema` | The quotes were changed by your shell. Use Git Bash, WSL, macOS or Linux, and copy the command exactly. |
| Claude does not offer to start a separate session | The feature is not yet on every account. Start a second session yourself with *+ New*, give it the README job, and keep going. |
| The mod's band does not appear | Type `/status` and check the Claude Code version. Mods need 2.1.286 or later in the desktop app. Check that you chose *Enable for this session* and that the folder is trusted. Mods do not load in WSL sessions. |
| `/doctor prompt-audit` is not recognized | Your app may be on an older Claude Code version. Skip that step and say so in your notes. |
| Codex or OpenCode does not mention `AGENTS.md` | Check that you opened `brightline-ap` and that you are on a branch made from `rules`. |
| OpenCode did not ask before an edit | Stop. Check auto-accept and `opencode.jsonc`, then start a new session before you continue. |
| The count is short on Windows | Git may have changed the line endings to Windows style. Make sure the script splits lines on `\r?\n`, not only `\n`, and that it has a test for both. |
| The agent says it is done but the total is wrong | Do not argue. Find the row in "Common wrong answers" and give one correction. |

### Apply it to your vertical

Pick one folder from your own work that a script could help with, such as weekly exports or a set of templates. Copy it, never the original. Put the copy under git, and write an `AGENTS.md` that answers the five questions. Then add the one rule that would hurt most if broken, both as a line in `AGENTS.md` and as a deny rule in `.claude/settings.json`. Then, outside the copy, write down the cases you know and the result you expect from one small script. Ask any agent for a plan for that script, read the plan against your cases, and stop at the plan. If your project has a web page, ask the agent to open it in its browser pane after a change and tell you what it sees, then check the page yourself.

*Domain expert and builder.* The domain expert gives the rule that must never be broken and the hidden case, such as Brightline's empty due dates. The builder sets up the repository, the settings, the command and the checks.

### Artifact checklist

The core items are needed by everyone. For an extension or a task you had to skip, a line in `ports/ch12.md` saying why takes the place of the item.

- [ ] `brightline-ap` is a git repository with a main branch
- [ ] `AGENTS.md` answers the five questions and includes the five rules from Task 3
- [ ] `CLAUDE.md` imports `AGENTS.md` (Claude Code only)
- [ ] `.claude/settings.json` denies edits under `data/`, and the blocked edit in Task 4 is in your notes (Claude Code only)
- [ ] `src/due-by-friday.ts` and its tests, with `npm test` passing
- [ ] The script gives 8 invoices and $19,229.53 for the cutoff 2027-03-05
- [ ] `NOTES.md`, the handover a new session can work from
- [ ] Extension: `.claude/skills/due-by-friday/SKILL.md`, and the headless result, or why you skipped it
- [ ] Extension: two commits from Task 9, per-vendor totals with a test and the README, plus notes on the side chat, the subagent and one audit finding, and the mod's events and calls if you did the optional step
- [ ] At least one of the branches `port-codex` and `port-opencode`, with its own working script, for an agent you did not use for the core tasks. The other is an extension, or a written port plan in `ports/ch12.md`
- [ ] `ports/ch12.md` on main, with the seven points for each agent and your choice for next week
- [ ] Tags `rules` and `ch12`
- [ ] Extension: an `AGENTS.md` and a deny rule for a copy of one folder from your own work
