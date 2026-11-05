# Lab 16: the Brightline AP plugin v0.1

Chapter 16 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 16: the Brightline AP plugin v0.1](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/lab/), so you can do the lab without the book.

*Time: about 8 hours 15 minutes, in three sittings, plus an optional hour at work for Task 21. The main route is about 6 hours 40 minutes. Lab files: `brightline-lab-ch16.zip`, standalone. The same steps are in `LAB.md` inside the zip.*

### Before you start

*What you need.*

- The Claude desktop app with a Pro, Max, Ultra, Team or Enterprise plan, for Sittings 1 and 2.
- Git, Node.js 24 or later, and uv, the Python project tool. The connector in Task 9 asks for Node.js 24.
- `python3` on your path, because the skill's script and one test call it. On Windows, if `python3` opens the Microsoft Store or is missing, install Python from [python.org](https://www.python.org/downloads/), or ask the agent to use `uv run python` in its place.
- The `claude` command, which the desktop app does not include. Install it from [Anthropic's quickstart](https://code.claude.com/docs/en/quickstart). The agent runs `claude plugin` commands with it, and a session started with it can load a plugin folder for that session alone, which is how you test the plugin while you build it.
- A GitHub account, and the GitHub command-line tool `gh`, from [cli.github.com](https://cli.github.com). Task 10 signs you in.
- For Tasks 18 and 19, the ChatGPT desktop app with Codex, and the [Codex command-line tool](https://learn.chatgpt.com/docs/codex/cli.md) for the `codex plugin marketplace` commands.
- For Task 20, OpenCode version 2, with a model connected. Install it with `npm install -g @opencode/cli`. The older `opencode-ai` package is version 1.
- For Task 17, a Claude plan that can install plugins on claude.ai: Pro, Max, Ultra, Team or Enterprise. For Task 19, a ChatGPT plan that can install plugins: OpenAI's plan table shows Plus, Pro, Business and Enterprise/Education. Both tasks are optional. If you skip one, write "skipped" and why in `ports/ch16.md`.

**Set up the tools.** If one is missing, follow Concept [13.2](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/the-workbench/#how-do-i-set-up-the-workbench) before Task 1. It gives the official page for each, and a prompt that has the agent check the versions and install nothing.

**You need no earlier chapter or lab.** The zip holds a complete, working repository. Where a task uses an idea from an earlier chapter, it explains it in place.

**The main route and the extras.** The main route is Tasks 1 to 11, then Tasks 14 to 16, then one port, Task 18 or Task 20, and the last four steps of Task 20: the port notes, the handover notes, the tag and the clean-up. It builds, releases and ports the plugin. Tasks 12, 13, 17 and 19, the second port, and Task 21 deepen what you built, so come back to them when you can.

For a reader [without a paid Claude plan](#without-a-paid-claude-plan), see the section near the end of this page.

**The lab files.** Download [brightline-lab-ch16.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16.zip) and unzip it into a new folder. It contains:

- `brightline-ap/`, a small, working accounts payable toolkit for a made-up company, with no git history. In Task 1, the agent puts it under git. Its `README.md` says what each folder holds. It also holds the lab's starting files:
  - `docs/ap-triage-rules.md`, the six triage rules, and the cases the AP analyst checks by hand
  - `data/invoices-intake.csv`, a new batch of 13 invoices
  - `schemas/agent-plugins/1.0.0/`, the Agent Plugins JSON Schemas, copied from the standard's repository
  - `exercises/ap-helper-plugin/`, a plugin a colleague forwarded. Never install or run it. Task 14 asks you to read it.
- `LAB.md`, these steps, with its figure in `img/`.

Each task links its answer key as a separate download. Open a key in a text editor, never in the agent. An agent that can read the answers is not tested by them.

Use the zip's copy for this lab, even if you finished an earlier lab in your own repository. The answer keys match the zip's files exactly.

The commands, menus and settings for each product are in [16.10](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/both-ai-vendors/), and each task links the part it uses.

**The date in this lab.** Today is Monday, March 8, 2027. Triage uses that run date, and "this Friday" is March 12, 2027.

### The job

Ana Morales, Brightline's AP analyst, wants the Monday triage done the same way by everyone, in whatever AI tool they use, with the numbers from tested code and one reviewed set of rules. She wrote the rules. You direct coding agents to turn them into tests, an engine, three skills and a plugin, ship it through review, and put the same skills in six places: Claude Code, a Claude chat and a Claude task, Codex and ChatGPT, and OpenCode. Where a Claude account has chat and tasks in one conversation, that is five places. You also read a plugin a colleague forwarded, before anyone installs it. Then, in Task 21, you use the same steps on a job from your own work.

### How each task works

Each task has a goal, steps and a **Checkpoint**. Do not start the next task until the checkpoint is true. In the Claude desktop app's *Code* tab, work in *Manual* mode, where the agent asks before each edit and each command.

The agent runs every command in this lab, and you read what it prints. Three things are yours, and the tasks say when: you sign in to GitHub yourself, you click through GitHub's settings page, and you start a test session from a terminal with the `claude` command. For that, the *Code* tab has its own terminal: click *Terminal* in the session's title bar. Before you approve a command, read what the agent says it will do, and say no to anything you do not understand. Asking "What does this command do?" is always fine.

For each task:

1. *Predict.* Write in `NOTES.md` what should happen, under the task's number.
2. *Direct.* Send the prompt. When the agent proposes a plan, read it before you let it write.
3. *Review.* Read every change and every command before you approve it. Ask the agent to explain anything you cannot follow.
4. *Check.* Ask the agent to run the checks, read what they print, and compare it with your prediction.

The four checks are `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py`. Every number in your notes comes from a command's output. Keep `NOTES.md` and `ports/ch16.md` out of task commits until Task 20.

The prompts in quote boxes are starting points. Send each one as written the first time, then correct the agent in your own words when it goes wrong. Those corrections are what this lab teaches, so note the important ones in `NOTES.md`.

![How each task works, and the shape of the lab. On the left, a loop of four steps. Predict, where you write what should happen. Direct, where you send the prompt and the agent writes. Review, where you read every change and every command. Check, where you read what the checks print, and compare. A note says every number in your notes comes from a command. On the right, the lab's four parts in order. Sitting 1, build, is a first skill, rules into tests, the engine, three skills, the plugin and a connector. Sitting 2, ship, is GitHub, version, catalog, checks, telemetry, a stranger's plugin and the pull request. Sitting 3, port, is the same skills in six places, built by three coding agents. At work is your own job, your own expert and the same steps.](img/lab-loop.png)

*Figure 16.16. The agent writes. You predict, direct, review and check, in every task.*

### Sitting 1: build it on Claude (about 3 hours 30 minutes)

Read Concepts [16.1](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/from-a-prompt-to-a-skill/) to [16.5](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/what-a-plugin-bundles/) first.

### Task 1. Set up, and your first skill (25 minutes)

*Goal:* the repository working on your computer, an agent that knows it, and your first skill answering a real question.

1. Open `brightline-ap` in the *Code* tab, in a *Local* session, in *Manual* mode.
2. Send:

   > Please put this folder under git, with a main branch, and make a first commit of everything here, with the message "Start from the lab's files". Then show me `git log --oneline`.

   Expect `git init -b main`, `git add .`, `git commit` and `git log --oneline`, which shows one commit. If the agent wants to change your git settings for the whole computer, say no. Ask it to set the name and email for this project only.
3. Predict first: all four checks pass, with 42 TypeScript tests and 27 Python tests. Then send: "Please install the packages from the lock files, with `npm ci` and, in `py/`, `uv sync`. Then run `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py`, and show me what each one prints."
4. Send:

   > Please read `README.md`, `AGENTS.md` and `REVIEW.md`, and list the files in `src/`, `tests/`, `data/` and `.claude/skills/`. Explain in about ten lines what this repository does, what its four checks are, which rules every agent here must follow, and what the `due-by-friday` skill does. Change nothing.

   Check its answer against `README.md`. `AGENTS.md` is the repository's standing instructions to every coding agent, and Claude Code reads it through `CLAUDE.md`.
5. *Your first skill.* Predict first: the agent will ask to run `npm run due -- 2027-03-12`, then `npm test`, and report 13 invoices, $43,833.63, with every test passing. These are open invoices in the AP export, a different 13 from the new batch you meet in Task 3. Then, in the same session, type `/due-by-friday 2027-03-12` and send it. Approve the commands, then compare its reply with what the commands printed. That is a skill at work: a short instruction file you started by name, and a number that came from tested code, not from the model. By Task 8 you will have three skills packaged as a plugin.

**Checkpoint:** four checks pass, the agent's summary matches `README.md`, and the skill's answer, 13 invoices, $43,833.63, matches the command's output.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-1.md).

### Task 2. Which piece? (15 minutes)

*Goal:* place six AP jobs before any tool is open ([16.2](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/choosing-the-right-piece/)).

In `NOTES.md`, under "Task 2", write the piece for each job, and one reason:

1. Read the new batch file.
2. Work out which invoices are due within three days of the run date.
3. Write the Monday report in the shape the AP team reads.
4. Check a vendor's tax form in the purchasing system.
5. Never change a vendor's terms in `data/vendors.csv`.
6. Read two years of old statements to find one vendor's past disputes, without crowding this session.

**Checkpoint:** your pieces match the answer key's table, or you can say why yours would also be reliable.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-2.md).

### Task 3. Rules into tests (40 minutes)

*Goal:* Ana's rules as failing tests, written before any code ([16.3](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/writing-a-skill-with-the-expert/)). Tests written first, from the expert's sheet, are the independent answer the code must match.

1. Read `docs/ap-triage-rules.md` yourself, whole. Note the order of the rules and the two boundaries.
2. Send: "Please make a new branch called `triage` and switch to it." Then send:

   > Please read `docs/ap-triage-rules.md`. Write `tests/triage.test.ts` for a function `triage(invoice, vendors, runDate, seen)` in `src/triage.ts`, using the `Invoice` and `Vendor` types from `src/schemas.ts`, where `seen` holds the AP export (`ledger`) and the invoices `earlier` in the same batch. It returns `{ pile, reason?, due }`, with pile one of "exception", "needs approval", "urgent", "ready". Write one test per rule and one per case in the sheet's table, with run date 2027-03-08. Add a test for a function `triageBatch(batch, vendors, ledger, runDate)` that returns `counts` and `totals` in cents per pile, but do not fill in the expected numbers for the intake batch. Take every expected value from the rules sheet only. Do not write `src/triage.ts`. Show me the tests before you write them.

3. Work out the batch test's expected numbers yourself. This is the expert's check: you sort and add yourself, so the engine has an independent answer to match. Allow twenty minutes. First send:

   > Please print a table of the 13 rows of `data/invoices-intake.csv`, in file order: the invoice number, the vendor id, the invoice's terms, that vendor's terms in `data/vendors.csv`, whether the number is already in `data/invoices.csv`, the amount in cents, and the due date. Where the due date is blank, get it from `dueDate` in `src/due-date.ts`. Do not decide any pile.

   Then apply the six rules to each row, in order, in a table in `NOTES.md`, and add up each pile's cents with a calculator. Send the agent your counts and totals, and ask it to put them in the batch test.
4. Predict first: every new test fails, and only because `src/triage.ts` does not exist. Ask the agent to run `npm test`.
5. Ask the agent to commit the tests on `triage`.

**Checkpoint:** the tests are committed while failing for the right reason, and your batch numbers match the answer key's.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-3.md).

### Task 4. The engine (20 minutes)

*Goal:* a tested engine that prints every number.

1. Send:

   > Please write `src/triage.ts` so the tests in `tests/triage.test.ts` pass. Use `dueDate` from `src/due-date.ts` for a blank due date. Put the $5,000.00 limit and the three days in named constants, `CONTROLLER_LIMIT_CENTS` and `URGENT_DAYS`. Add `npm run triage -- <batch.csv> <run date>` that prints each pile with its count and total and each invoice with its reason, and ends with a line in the form `N invoices: N exception, N needs approval, N urgent, N ready`. Give it a `--json` option. Do not change any test.

2. Ask the agent to run `git diff HEAD -- tests`. It must print nothing, because no test changed.
3. Ask the agent to run the four checks, then `npm run triage -- data/invoices-intake.csv 2027-03-08`. Then ask it to commit.

**Checkpoint:** every check passes, and the last line is `13 invoices: 4 exception, 2 needs approval, 2 urgent, 5 ready`. If your Task 3 numbers differed, find which rule you applied differently.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-4.md).

### Task 5. The skill (30 minutes)

*Goal:* `invoice-triage`, to the Agent Skills specification ([16.1](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/from-a-prompt-to-a-skill/), [16.3](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/writing-a-skill-with-the-expert/)).

1. Send: "Please create `plugin/skills/invoice-triage/`, and copy `docs/ap-triage-rules.md` into its `references/` folder, unchanged."
2. Send:

   > Please write `plugin/skills/invoice-triage/scripts/triage.py`, a standard-library-only Python copy of `src/triage.ts`, with `--intake`, `--vendors`, `--ledger`, `--run-date` and `--json`, for products that load a skill but have no repository. Then add `tests/triage-parity.test.ts`, which runs it with `--json` on the intake batch and checks that its counts, totals and piles equal `triageBatch`'s. Run `npm test`.

3. Have the agent draft `SKILL.md` with you, playing Ana:

   > Please draft `plugin/skills/invoice-triage/SKILL.md` to the Agent Skills specification, using only its six fields, with `metadata` holding `author`, `version: "0.1.0"` and `policy: "AP policy v3"`. Before you write, ask me up to five questions, one at a time, as if I were Ana, the AP analyst: when people need this, when they must not use it, and who acts on each pile. Then write `name: invoice-triage`, a `description` of at most 1,024 characters that says what it does, when to use it and when not to, and a body that finds the three files, asks for the run date if it is missing, runs the tested tool (`npm run triage` inside the repository, or `scripts/triage.py` anywhere else), copies its numbers exactly, ends with who acts on each pile, and has a "Never" list. Point to `references/ap-triage-rules.md` rather than copying the rules into the body.

   Answer its questions from `docs/ap-triage-rules.md`. Then read the draft line by line and change anything Ana would not sign. You decide every line. The agent only types it.
4. Ask the agent to check the skill against the specification and show each rule with pass or fail: the six fields, the name and its folder, the description's length, and fewer than 500 lines. Check one or two of its answers yourself. Task 15 makes this a required check.
5. Send: "Please add `py/brightline_ap/triage.py`, a Python version of the engine using `due_date`, and `py/tests/test_triage.py` with the same rules and the batch's counts and totals. Run `npm run test:py` and `npm run check:py`."
6. A report is useful later only if it says which copy made it. Send:

   > Please make both tools read `metadata.version` and `metadata.policy` from the skill's `SKILL.md`, and print them on the first line, such as `Triage for run date 2027-03-08, brightline-ap 0.1.0, AP policy v3`. `src/triage.ts` reads `plugin/skills/invoice-triage/SKILL.md`, and `scripts/triage.py` reads the `SKILL.md` in its own skill folder, so it still works when the skill is copied. Add them as `labels` in the `--json` output, and make the parity test compare them. Run `npm test`.

7. Nothing yet notices if the sheet or one copy of its rule moves alone. Send:

   > Please add `tests/triage-rules-sheet.test.ts`, which fails unless every dollar amount in rule 4 of `docs/ap-triage-rules.md` equals `CONTROLLER_LIMIT_CENTS` in each of `src/triage.ts`, the skill's `scripts/triage.py` and `py/brightline_ap/triage.py`, and unless the policy on the sheet's source line equals the skill's `metadata.policy`. Run `npm test`.

   Then ask the agent to commit.

**Checkpoint:** the parity test, which checks that the two copies agree, and the sheet test both pass, the skill uses only the six fields, every number it mentions comes from a script it names, and the tool's first line names `brightline-ap 0.1.0` and `AP policy v3`.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-5.md).

### Task 6. Does it load? (15 minutes)

*Goal:* the description loads the skill for the right requests and not others.

1. In the session's terminal, in the `brightline-ap` folder, start a new session with the skill folder loaded for this session only: `claude --permission-mode manual --plugin-dir ./plugin`. Without the first flag, a terminal session starts in *Auto* mode. A folder of skills already loads, under the folder's name, `plugin`. Task 8 adds the manifest.
2. Send five requests, one at a time, and record whether `invoice-triage` loaded. Type `/clear` between requests, so one answer cannot lean on the last:
   - "Triage the new batch in data/invoices-intake.csv for today, March 8, 2027."
   - "Which of this week's new invoices need someone to look at them?"
   - "Sort data/invoices-intake.csv into the AP piles."
   - "What is the controller's approval limit?"
   - "Should we pay INV-6004 today?"
3. The first three should load it. The last two should not. If one misbehaves, change the description, not the steps, type `/exit`, start the session again, and try again. Run each request twice, because models vary.

**Checkpoint:** a table in `NOTES.md` with five rows and two runs each, all as expected, and the description you ended with.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-6.md).

### Task 7. The command (15 minutes)

*Goal:* the Monday report started by name, and the due list moved into the plugin ([16.4](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/commands-and-who-may-start-them/)).

1. Back in the *Code* tab, read `.claude/skills/due-by-friday/SKILL.md`, the skill you ran in Task 1. Notice `disable-model-invocation: true`. Claude Code reads that field, but it is outside the standard's six, so a strict product would refuse this file. Send:

   > Please move `.claude/skills/due-by-friday/` to `plugin/skills/due-by-friday/` with `git mv`. Keep only the Agent Skills specification's six fields, so `disable-model-invocation` goes. Write a `description` that says what it does and when to use it. The cutoff date comes after the skill's name, such as `/due-by-friday 2027-03-12`. If none is given, it asks for one, and it never works out a date itself, not even "this Friday". It runs `npm run due`, and reports the script's numbers exactly.

2. Send:

   > Please write `plugin/skills/ap-triage/SKILL.md`, the Monday report, with only the six specification fields. It takes a batch file and a run date after its name, asks for either if missing, follows `invoice-triage`, and writes the report in a fixed shape with every number copied from the tool, then stops. The report's first line is one line, such as `AP triage, run date 2027-03-08, batch invoices-intake.csv, brightline-ap 0.1.0, AP policy v3`, with the plugin version and the policy as the tool printed them. It only reads, so it may load by itself too.

   Read both skills line by line before you accept them. Then ask the agent to commit.
3. You run them in Task 8, once the manifest gives the plugin its name. Without a manifest, the plugin would take its folder's name, `plugin`, which is easy to confuse with the built-in `/plugin` command.

**Checkpoint:** both skills meet the specification, with six fields at most, and each name matches its folder. Neither skill works out a date or a number itself.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-7.md).

### Task 8. The plugin (25 minutes)

*Goal:* two manifests around one `skills/` folder ([16.5](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/what-a-plugin-bundles/)). One host reads the standard core, and another reads only its own manifest, so both sit beside the same skills. You will see why in Sitting 3, with [16.7](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/one-skill-three-bundles/).

1. Ask the agent for `plugin/plugin.json`, the Agent Plugins core: `$schema` for 1.0.0, `name: brightline-ap`, `version: 0.1.0`, a description, an author, a license and keywords. Nothing else.
2. Ask for `plugin/.claude-plugin/plugin.json`, Claude's own manifest: the same name, version and description. Claude Code does not read the core yet, so this file sits beside it. Both point at the same `skills/` folder by convention. Nothing is copied.
3. Ask the agent to run `claude plugin validate ./plugin`, then to validate `plugin/plugin.json` against `schemas/agent-plugins/1.0.0/plugin.schema.json`. Then ask it to commit.
4. In the terminal, start a new session with `claude --permission-mode manual --plugin-dir ./plugin`. Run `/brightline-ap:due-by-friday` with no date, and see it ask for one. Then run `/brightline-ap:due-by-friday 2027-03-12`, then `/brightline-ap:ap-triage data/invoices-intake.csv 2027-03-08`.

**Checkpoint:** both checks pass, both skills appear under `brightline-ap`, the due list for March 12 is 13 invoices, $43,833.63, as `npm run due -- 2027-03-12` prints, and the report's counts match Task 4's output.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-8.md).

### Task 9. A ready-made connector (25 minutes)

*Goal:* a pinned, read-only connector to the data folder, with no code ([16.5](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/what-a-plugin-bundles/)).

1. Ask the agent for the connector in both formats, then ask it to commit:
   - `plugin/mcp.json` (the core): a `stdio` server named `apdata` that runs `npx -y @modelcontextprotocol/server-filesystem@2.1.0 ./data`, with the same `$schema` version as `plugin.json`.
   - `plugin/.mcp.json` (Claude's file): the same server, with the folder taken from a `userConfig` option in `.claude-plugin/plugin.json` named `data_folder`, of type `directory`, with a title, a description and the default `./data`.
2. Read the server's tool list in [16.10](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/both-ai-vendors/#make-a-connector-read-only). Four tools write: `write_file`, `edit_file`, `create_directory` and `move_file`. The plugin cannot remove them. Ask the agent to add four deny rules to `.claude/settings.json`, using the names in 16.10, such as `mcp__plugin_brightline-ap_apdata__write_file`. Then ask it to commit.
3. In the terminal, at the root of `brightline-ap`, start a new session with `claude --permission-mode manual --plugin-dir ./plugin`. Nothing asks for the data folder here, because this kind of session shows no dialog, so the default `./data` applies, counted from the folder you started in. Ask: "Using the apdata connector only, list the folders it may read, then list the files in that folder."
4. Predict first, then ask: "Using the apdata connector, write a file named test.txt in the data folder." A deny rule that names a tool removes it from what the agent can see, so the agent should say it has no such tool. Its refusal alone proves nothing, because `AGENTS.md` also forbids the write. So ask: "Please list the apdata connector's tools." Then look in `data/` yourself.
5. **Keep the connector read-only everywhere.** The connector can write files, and the plugin cannot stop that. Each product's settings can. Before you use the plugin in any new place, deny or block its four write tools there first. The tasks remind you each time.

**Checkpoint:** the connector lists exactly one allowed folder, your repository's `data/`, and its files. The agent lists ten tools, with none of the four write tools, and `data/` holds no `test.txt`. The `/mcp` screen still shows all fourteen, because it lists what the server offers. If the allowed folder is wrong, you started the session somewhere else. Exit, and start it again from the repository's root.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-9.md).

### Sitting 2: ship it (about 3 hours 5 minutes)

Read Concepts [16.6](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/shipping-a-version/), [16.8](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/watching-it-run/) and [16.9](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/installing-is-a-trust-decision/) first.

From here on, changes reach `main` only through a pull request that passes the checks. Task 15 opens `triage` as one pull request, which keeps the first build in one review. From Task 17 on, each task that changes files is its own pull request, with the template filled in, the checks green, and the merge. Ask the agent to stage only the files each task needs.

### Task 10. Put it on GitHub (25 minutes)

*Goal:* the repository on GitHub, with its three checks running and `main` protected, before you ship anything.

1. Ask the agent to run `git status`. On `triage`, only `NOTES.md` may show as changed. Everything else is committed.
2. *Sign in yourself.* In the terminal, never through the agent's chat, type `gh auth login`, and answer its questions. Check with `gh auth status`.
3. Send: "Please switch to `main`, create a public GitHub repository from this folder with `gh repo create brightline-ap --public --source . --remote origin`, and push `main` with `git push -u origin main`. This first push creates `main` on GitHub, so the rule against pushing to `main` starts after it. Do not push `triage` yet." `--public` is for this lab only: on a free account, rulesets, branch protection and code owners work only on public repositories,[^github-rulesets] and everything in Brightline is made up.
4. Make your first pull request. Send: "Please make a branch called `setup` from `main`, and replace `@your-github-name` in `.github/CODEOWNERS` with `@<your GitHub name>`. Commit it, push the branch, and open a pull request with `gh pr create --fill`." GitHub reads that file from the pull request's base branch, and the last matching line wins.[^github-codeowners] The three checks, `checks`, `tests-unchanged` and `no-secrets`, run on it. Wait until they are green.
5. Protect `main`, yourself, on GitHub. Open the repository's *Settings*, then *Rulesets* under *Code, planning, and automation* (some pages still say *Rules*), then *New ruleset*, *New branch ruleset*. Name it `main`, set *Enforcement status* to *Active*, and target the default branch. Turn on:
   - *Restrict deletions* and *Block force pushes*
   - *Require a pull request before merging*, with 1 approval, dismiss stale approvals, require review from Code Owners, and require conversation resolution
   - *Require status checks to pass before merging*. Type each check's name to add it: `checks`, `tests-unchanged` and `no-secrets`. A required check must have succeeded in the repository in the past seven days, so add them after they have run on your pull request.

   GitHub does not let you approve your own pull request. If you work alone, add *Repository admin* to the bypass list, with its mode set to *For pull requests only*, and write why in the pull request each time you bypass.
6. Merge the pull request on GitHub.
7. Send: "Please run `git switch main`, `git pull`, `git switch triage` and `git merge main`. Then run the four checks."

**Checkpoint:** the three checks are green on GitHub, `main` accepts changes only through a pull request, and `triage` has your code owner line and still passes every check.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-10.md).

### Task 11. Version and catalog (15 minutes)

*Goal:* version 0.1.0, a changelog, and a catalog to install from ([16.6](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/shipping-a-version/)).

1. Ask the agent for `plugin/CHANGELOG.md` with an entry for 0.1.0, dated March 8, 2027: what was added, including the connector's pinned version and where its write tools are denied.
2. Ask for `.claude-plugin/marketplace.json` at the repository root: a catalog named `brightline` with one plugin, `brightline-ap`, from `./plugin`, with no `version` in the entry. `plugin.json` holds the version, and Anthropic says not to set it in both.
3. Send: "Please commit, push the branch, and clone it into a new folder next to this one, called `ch16-install`. From that clone's root, run `npm ci`, then `claude plugin marketplace add ./ --scope local`, then `claude plugin install brightline-ap@brightline --scope local`." The agent may ask before it runs commands in that folder. It is your own clone, so allow them. Local scope installs it for you, in that clone only. The second command says one option is not yet set. The default applies, so go on.
4. Open a new *Code* tab session in the clone's root, so its `.claude/settings.json` denies the connector's write tools and the data folder is the clone's. Run `/brightline-ap:ap-triage data/invoices-intake.csv 2027-03-08`. Never use the plugin in a folder whose settings do not deny the write tools.

5. Back in your first session, send: "From `ch16-install`, please run `claude plugin uninstall brightline-ap@brightline --scope local`, then `claude plugin marketplace remove brightline`." Later tasks use the folder.

**Checkpoint:** the installed plugin worked in a new session, with the same counts, and `claude plugin list` no longer shows it.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-11.md).

### Task 12. Repeatable checks (15 minutes)

*Goal:* four test cases you can run before every release ([16.6](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/shipping-a-version/)).

1. Ask the agent for `evals/README.md`, at the repository root and not inside `plugin/`, with four cases: the intake batch for March 8, 2027, the same batch for March 11, a batch with a missing run date, and the Monday report's first line. Predict the first two with the rules, then check them with `npm run triage`. The third should end in a question, not a guess. The fourth should name `brightline-ap 0.1.0` and `AP policy v3`.
2. Run the cases by hand in a new session, twice each. If you would rather have a machine run them, `claude plugin eval init <name>`, run from `plugin/`, writes a suite under `plugin/evals/`, so those cases ship inside the plugin. It needs Claude Code 2.1.269 or later, and its runs count toward your plan or API bill.
3. Record the results in `NOTES.md`, and ask the agent to commit `evals/README.md`.

**Checkpoint:** four cases and their results, and a sentence on which result surprised you, if any.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-12.md).

### Task 13. Watch it run (25 minutes)

*Goal:* see a plugin in telemetry, and what telemetry cannot show ([16.8](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/watching-it-run/)).

1. Predict first: your plugin came from your own folder, not Anthropic's catalog, so `plugin.name` and `skill.name` are hidden.
2. Send:

   > Please run `claude -p "/brightline-ap:ap-triage data/invoices-intake.csv 2027-03-08" --plugin-dir ./plugin --allowedTools "Bash(npm run triage *)"`, and save everything it prints to `out/telemetry-1.txt`. Set `CLAUDE_CODE_ENABLE_TELEMETRY=1`, `OTEL_METRICS_EXPORTER=console` and `OTEL_LOGS_EXPORTER=console` for this one command only, and put them in no settings file. Then search the file for `plugin_loaded`, `skill_activated`, `cost.usage` and `token.usage`, and show me each record's `plugin.name` and `skill.name`, the run's cost, and how long each model request took.

   `claude -p` runs one request with no conversation. Its console output lands in the file, which a chat session would hide. The file holds your email address and account ids. `out/` is ignored by git, so it stays out of the repository. Do not share it.
3. Send the same request again with `OTEL_LOG_TOOL_DETAILS=1` added, saving to `out/telemetry-2.txt`, and find the real names. This setting also logs commands and tool input, so use it only on made-up data like this.
4. Turn on nothing else. Never log prompts or replies in this lab, even though the data is made up.
5. In `NOTES.md`, write what telemetry showed (which events, how long, what it cost) and what only the tests from Task 3 showed.

**Checkpoint:** the names hidden, then real, and a note that names the test, not the telemetry, as the evidence that the counts are right.

**Check it now.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-13.md).

### Task 14. Read before you install (15 minutes)

*Goal:* decide about a stranger's plugin by reading it ([16.9](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/installing-is-a-trust-decision/)).

1. Do not install, load or run anything in `exercises/ap-helper-plugin/`. Read each file yourself, or ask the agent to read them and change nothing.
2. Fill in the table from [16.9](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/installing-is-a-trust-decision/#how-do-i-read-a-plugin-before-i-install-it) for this plugin: the manifest, the hooks, the scripts, any connectors, the skill.
3. Write your decision in `NOTES.md`, with the file and line that decided it, and the address data would go to.

**Checkpoint:** a written decision, with the file, the line and the address behind it.

**Check it now.** Download [Task 14's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-14.md).

### Task 15. Open the pull request (60 minutes)

*Goal:* the plugin on `main` through the review setup from Task 10, with the plugin checks required.

1. Ask the agent to add `jsonschema` and `pyyaml`, pinned, to the `dev` group in `py/pyproject.toml`, then to run `uv lock` and `uv sync` in `py/`. The checks on GitHub install with `--locked`, so a missing lock entry would fail the job.
2. Send:

   > Please write `scripts/check_plugin.py`, run with `npm run check:plugin` through `py/`'s environment. It must exit 2, not pass, if it cannot find the folders. It must fail when:
   >
   > - `plugin/plugin.json` or `plugin/mcp.json` breaks the Agent Plugins 1.0.0 schemas in `schemas/agent-plugins/1.0.0/`, or `mcp.json` names a different specification version from `plugin.json`
   > - a skill in `plugin/skills/` uses a field outside the six specification fields, breaks the name rules, has a name that differs from its folder, has a description outside 1 to 1,024 characters, or has a `SKILL.md` of 500 lines or more
   > - a skill's `metadata.version` differs from the manifest's, the Claude manifest's name or version differs from the core's, or `CHANGELOG.md` has no entry for the version
   > - a rules sheet in a skill's `references/` differs from its copy in `docs/`
   >
   > Add tests in `py/tests/` that copy the plugin and break each rule once.

   You do not need to follow every line of the script. Review what it promises: ask the agent to show each rule beside the test that breaks it. The limit and the policy are not on this list, because Task 5's sheet test already compares them, and the `checks` job runs it.
3. Send:

   > Please write `scripts/check-version-moved.sh <base branch>`, which fails when `plugin/` changed since that branch and `plugin.json`'s version did not, passes when the plugin is new on the branch, and exits 2 if it cannot find the branch.

4. Send:

   > Please add a `plugin-valid` job to `ci.yml`, with `fetch-depth: 0`, that runs both checks. In the same job, add a step that runs the standard's own `skills-ref validate` on each skill, installed from the agentskills repository at a pinned commit, with `continue-on-error: true`, so it reports but does not block until someone has seen it pass on GitHub. My own check blocks.

5. Test the check. Ask the agent to add `disable-model-invocation: true` to `ap-triage`'s frontmatter, run `npm run check:plugin`, show you the failure, and remove the line.
6. Ask the agent to add the plugin's code-running and configuration paths, `docs/ap-triage-rules.md` and each skill's `references/` to `.github/CODEOWNERS`, and the plugin's risk tiers to `REVIEW.md`: skills and the changelog medium, and scripts, manifests, connector files, catalogs, settings and the rules sheets high.
7. Ask the agent to open the pull request, with the template filled in.
8. Start a new session in the *Code* tab, so the reviewer has not seen the build, and send: "Please review the open pull request against `REVIEW.md` from `main`. Change nothing. List findings by risk tier, each with a file, a line and the input that would make it go wrong."
9. Fix each real finding by directing the agent in your build session, push, resolve each conversation, and merge on GitHub.
10. Add `plugin-valid` to the ruleset's required checks. Read the `skills-ref` step's output in the job's log. If it passed, note it in `NOTES.md`, and a later pull request can make it blocking.

**Checkpoint:** merged, with `checks`, `tests-unchanged`, `no-secrets` and `plugin-valid` green, and `plugin-valid` required. Ask the agent to run `git switch main` and `git pull`.

**Check it now.** Download [Task 15's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-15.md).

### Task 16. The day the limit changes (30 minutes)

*Goal:* see what it takes to change a rule in every copy, and how anyone would know which copy ran ([16.6](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/shipping-a-version/)). You rehearse on a branch you never merge.

Dave Kowalski, the controller, has been thinking of raising his limit to more than $10,000.00. It is only an idea. Before he decides, Ana wants to see what that day would take.

1. In `NOTES.md`, predict the triage's last line under the new limit, and which check goes red first. Work out the new counts and totals from your Task 3 table. You need them in step 5.
2. Keep a clerk who has not updated. Send: "In `ch16-install`, please run `git switch main`, `git pull` and `npm ci`. Then leave that folder alone."
3. Send: "Please make a new branch called `limit-change` from `main`. We will never merge it."
4. You will move the rule one file at a time. After each change, ask the agent to commit, then send this, and write in `NOTES.md` what went red:

   > Please run `npm test`, `npm run test:py`, `npm run check:plugin`, `bash scripts/check-tests-unchanged.sh main` and `bash scripts/check-version-moved.sh main`, and tell me only which failed, with each one's message.

5. Send these changes, in order:
   - "In `docs/ap-triage-rules.md`, please change rule 4 to more than $10,000.00, with exactly $10,000.00 not counting, its two boundary cases to $10,000.01 and $10,000.00, and the source line to `Rule 4's limit comes from AP policy v4, section 4.1. This is a rehearsal: Dave has not decided.`"
   - "Please copy that sheet over the one in the skill's `references/`."
   - "Please change the rule 4 tests and the batch test to the new limit, in both languages, with my counts and totals." Paste yours under it.
   - "Please change the limit in `src/triage.ts`."
   - "Please change the limit in the skill's `scripts/triage.py`."
   - "Please change the limit in `py/brightline_ap/triage.py`."
6. `tests-unchanged` refused your edited tests, which is its job. Send: "Please run `ALLOW_TEST_CHANGES=true bash scripts/check-tests-unchanged.sh main`." On GitHub, the `tests-changed` label gives that setting. In `NOTES.md`, write the reason a pull request would give, naming AP policy v4.
7. The sheet test is still red, because the sheet says AP policy v4 and the skill says v3. The version check has been red since the second change, and it asks only that the version moves. Choosing the number is a person's job, and this rehearsal uses 1.0.0, because the same invoice now lands in a different pile. Finish the release one step at a time, with the same checks after each:
   - "In the skill's `metadata`, please set `version` to 1.0.0 and `policy` to AP policy v4."
   - "Please set `version` to 1.0.0 in both manifests."
   - "Please add a 1.0.0 entry dated 2027-03-08 to `plugin/CHANGELOG.md`, naming AP policy v4."

   In `NOTES.md`, say why you chose 1.0.0 and not 0.1.1, using the third row of the table in [16.6](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/shipping-a-version/#what-does-a-version-number-promise).
8. Send: "Please run `npm run triage -- data/invoices-intake.csv 2027-03-08` here and in `ch16-install`, and show me the first and last line of each." Copy the four lines into `NOTES.md`.
9. Send: "Please run `git switch main` and `git branch -D limit-change`, then run the triage again." `main` still says `brightline-ap 0.1.0`, `AP policy v3`, and the counts from Task 4. Nothing was pushed.

**Checkpoint:** both pairs of lines are in `NOTES.md`, with a list of every check that went red and what turned it green.

**Check it now.** Download [Task 16's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-16.md).

### Sitting 3: port and use in six places (about 1 hour 40 minutes)

Read Concepts [16.7](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/one-skill-three-bundles/) and [16.10](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/both-ai-vendors/) first.

For each place, record three outcomes in `ports/ch16.md`, and keep them separate. *Loaded:* the product lists the three skills. *Ran:* the skill ran its tool or script, through the connector or with attached files. *Verified:* the triage counts for the intake batch on 2027-03-08 are 4, 2, 2 and 5, and the first line names the version it ran. Also note how a new version would reach that place, from [16.10](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/both-ai-vendors/). A place where the skills loaded but did not run is a partial port, and you write it down as one. Some places may not run a script, and some plans may not offer plugins. That is a result too, not a failure of the lab.

### Task 17. The Claude plugin in a chat and a task (25 minutes)

*Goal:* the same plugin on two more Claude surfaces ([16.7](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/one-skill-three-bundles/)).

1. Install the plugin on your claude.ai account from your GitHub repository's catalog, or upload a zip of the `plugin/` folder. [The steps are in 16.10](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/both-ai-vendors/#practice-one-skill-three-bundles).
2. Before any request, look under *Customize > Connectors*. If `apdata` is listed, set `write_file`, `edit_file`, `create_directory` and `move_file` to *Blocked*. A local connector may not list its tools there before it runs. If it does not, work in *Manual*, and decline every write. The plugin will also appear in Claude Code, where only a folder with the deny rules keeps them off.
3. In Claude chat, with code execution on, attach `invoices-intake.csv`, `vendors.csv` and `invoices.csv`, and ask: "Triage the attached batch for run date 2027-03-08."
4. In a task in the desktop app, with the `brightline-ap` folder connected, ask which folders the apdata connector may read, then ask the same triage request. If your account has chat and tasks in one conversation, with no mode to choose, run this once, and record one place. On an account not moved over yet, the mode is called Cowork.
5. In `ports/ch16.md`, record for each place which skills loaded, whether the connector loaded, which route the skill used, the repository or its own script, and the counts.

**Checkpoint:** the skill loads in both. The local connector is skipped in chat. In a task it loads in a session on your computer, which Team and Enterprise plans can choose. On Pro, Max and Ultra, new tasks run in the cloud, so record whether it loaded. The counts are 4, 2, 2 and 5 wherever the script ran.

**Check it now.** Download [Task 17's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-17.md).

### Task 18. Codex builds the OpenAI plugin (35 minutes)

*Goal:* the same skills packaged for OpenAI, by OpenAI's coding agent ([16.7](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/one-skill-three-bundles/), [16.10](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/both-ai-vendors/)).

1. Open the ChatGPT desktop app and choose *Codex*. Open the `brightline-ap` folder, set *Work in* to *This computer*, and set the permission mode to *Ask for approval*. Send: "Please run `git switch main` and `git pull`, then make a new branch called `openai-plugin`."
2. Send:

   > The plugin in `plugin/` already has an Agent Plugins 1.0.0 core: `plugin/plugin.json`, `plugin/mcp.json` and `plugin/skills/`. Check that Codex can load that core as it is. Add only what OpenAI needs beyond it: a catalog at `.agents/plugins/marketplace.json` named `brightline-openai`, with an entry for `brightline-ap` from `./plugin`, and `.codex/config.toml`. In that file, enable `brightline-ap@brightline-openai`, list the connector `apdata`'s four write tools in `disabled_tools` for that plugin, and declare a project server, `[mcp_servers.apdata]`, that runs `npx -y @modelcontextprotocol/server-filesystem@2.1.0 ./data`, with the same `disabled_tools`. Do not create `.codex-plugin/`, do not copy or change any skill, and change `plugin.json` only under `extensions`, if at all.

   Why a project server: Codex copies an installed plugin into its own cache and starts the plugin's connector there, where `./data` names no folder. A project server with the same name starts at the repository's root, and Codex uses it instead.
3. Read the diff. Ask Codex to run `git diff --stat main`, and check that nothing under `plugin/skills/` changed.
4. Send: "Please run `codex plugin marketplace add ./`, then `codex plugin add brightline-ap@brightline-openai`." Adding a catalog does not install what it lists, so the second command matters. Trust the project when Codex asks, so it reads `.codex/config.toml`. Restart the ChatGPT desktop app, and start a new chat.
5. Ask: "Using the apdata connector only, list the folders it may read." It should be your repository's `data/`. If it is not, record what you saw in `ports/ch16.md`.
6. Type `$brightline-ap:invoice-triage`, or pick it from the `$` list, and ask it to triage the intake batch for run date 2027-03-08. A plugin's skills carry the plugin's name, and a bare `$invoice-triage` does not start the skill.
7. Optional: turn on Codex's OpenTelemetry log export in your user config for one run, and record in `ports/ch16.md` which of Task 13's observations it gives.
8. Ask Codex to open the pull request, and merge it through the same checks.

**Checkpoint:** no change under `plugin/skills/` or to the core manifest beyond `extensions`. Codex's counts are 4, 2, 2 and 5.

**Check it now.** Download [Task 18's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-18.md).

### Task 19. The same plugin in ChatGPT (15 minutes)

*Goal:* the OpenAI plugin on a second OpenAI surface.

1. On the same computer as Task 18, open the ChatGPT desktop app, then *Customize > Plugins*, in Work if you still see that switch. A catalog you added with `codex plugin marketplace add` appears there as a source, after you restart the app. Install `brightline-ap` from it, if Task 18 has not already. If your workspace allows plugins only through an admin, an admin imports your GitHub catalog instead, as [16.10](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/both-ai-vendors/#practice-one-skill-three-bundles) shows. If neither is open to you, skip this task and record why.
2. Start a new chat that runs locally, in the `brightline-ap` project, because a local connector needs your computer, and that project's `.codex/config.toml` keeps the write tools off. Attach the three files, and ask for triage with `@invoice-triage` for run date 2027-03-08.
3. Record the three outcomes in `ports/ch16.md`: what loaded, how the skill ran the tool, and the counts. OpenAI's pages say a longer task can run code and shell commands, so expect the script to run. If it did not, say so.

**Checkpoint:** the skill loads in ChatGPT. If it ran the script, the counts are 4, 2, 2 and 5. If it could not, `ports/ch16.md` says so, and the skill asked rather than guessed.

**Check it now.** Download [Task 19's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-19.md).

### Task 20. OpenCode builds its setup, and the tag (25 minutes)

*Goal:* the same skills in an open-source agent, then the handover. If Task 18 was your one port on the main route, skip steps 1 to 3 here.

1. Open the repository in OpenCode. Before you send anything, turn auto-accept off for this project, under Settings, then Projects. Then send: "Please run `git switch main` and `git pull`, then make a new branch called `opencode-setup`."
2. Send:

   > Please add `opencode.jsonc` at the repository root. Read skills from `./plugin/skills` with a `skills` list, without copying them. Add the connector under `mcp.servers` as `apdata`, type `local`, running `npx -y @modelcontextprotocol/server-filesystem@2.1.0 ./data` from the repository root. Add permission rules: deny edits to `data/**`, ask for shell commands, ask before loading any skill, allow `apdata_*`, then deny `apdata_write_file`, `apdata_edit_file`, `apdata_create_directory` and `apdata_move_file`. The last matching rule wins, so keep that order.

3. Restart OpenCode in the folder, and approve the skill when asked. Ask which folders the apdata connector may read, then ask for triage of the intake batch for run date 2027-03-08. Expect a surprise on the folders: OpenCode sends the server its own folder list, which replaces `./data`, so the connector can read the whole repository here. Write what it reports in `ports/ch16.md`.
4. Ask the agent to complete `ports/ch16.md` from your notes: one row per place, with the builder, the bundle it read, loaded, ran, verified, how a new version reaches it, and what had to change. Its headings are in this task's answer key, if you want them.
5. Ask the agent to make a branch for this if you skipped step 1. Then ask it to update `NOTES.md` with the plugin, the required checks and where each product's connector is made read-only, commit both notes files, open the pull request, and merge it.
6. Send: "Please run `git switch main` and `git pull`, then `git tag ch16` and `git push origin ch16`. Then clone the tag into a new folder next to this one, called `ch16-check`. In `ch16-check`, run `npm ci`, and `uv sync` in `py/`, then the four checks, `npm run check:plugin` and `npm run triage -- data/invoices-intake.csv 2027-03-08`, and show me what each one prints."
7. Clean up what you used, unless you will keep using it. If you did Task 17, uninstall the plugin from your claude.ai account. If you did Task 18, ask the agent to run `codex plugin remove brightline-ap@brightline-openai`, then `codex plugin marketplace remove brightline-openai`, in that order. Removing only the catalog leaves the skills loading from Codex's cache. If you keep them, keep the write tools blocked or denied in every place you use them.

**Checkpoint:** if you did this port, the same counts in OpenCode, its write tools gone, and the folder it really read written in your notes. On any route, the table complete for every place you used, and every check passing on `ch16` from a clean clone.

**Check it now.** Download [Task 20's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-20.md).

### Sitting 4, at work: your own (optional, about an hour)

### Task 21. Your own skill and plugin, with an agent (60 minutes)

*Goal:* the same steps on a job from your own work, so you can build the next skill without this lab ([16.1](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/from-a-prompt-to-a-skill/) to [16.6](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/shipping-a-version/)).

1. **Choose the job and its owner.** Pick one procedure you or your team repeat, with numbers in it, and the person who owns its rules. Ask them for a short rules sheet and three cases they check by hand, with the answers. Make a new folder, have the agent put it under git, and save the sheet as `docs/rules.md`. Use made-up or cleared data only.
2. **Place the pieces.** Open the folder in the *Code* tab and send:

   > Please read `docs/rules.md`. Ask me questions, one at a time, until you can list the job's steps, every number it produces, the things it must never do, and who acts on each result. Then show a table that places each part as a skill, tested code, a connector or a permission setting, with one reason each. Write no files yet.

   Answer as the owner would, or bring the owner in. Correct any placement you disagree with, then have the agent save the table in `NOTES.md`.
3. **Tests, then code.** Send:

   > Please write failing tests for the three cases in `docs/rules.md`, taking every expected value from the sheet only. Show me the tests before you write them. Do not write the code yet.

   Ask the agent to run the tests, and see them fail for the right reason. Then ask for the smallest code that makes them pass, with every limit in a named constant, and a command that prints each number. Check that no test changed.
4. **The skill.** Send:

   > Please draft `plugin/skills/<job-name>/SKILL.md` to the Agent Skills specification, with only its six fields. Ask me first when people need it, when they must not use it, and who acts on each result. The description says what it does, when to use it and when not to. The body runs the tested command, copies its numbers exactly, and ends with who acts and a "Never" list. Put the rules sheet in `references/`.

5. **The plugin.** Ask for `plugin/plugin.json` for Agent Plugins 1.0.0, with `$schema`, a name, version `0.1.0` and a description, and for `plugin/.claude-plugin/plugin.json` beside it with the same name and version. Ask the agent to copy `scripts/check_plugin.py` and `schemas/` from your `brightline-ap` repository, adapt the check to this folder, and run it until it reports no problems.
6. **Does it load?** In the terminal, start a new session with `claude --permission-mode manual --plugin-dir ./plugin`. Write five requests: three that should load the skill and two that should not. Run each twice, and fix the description, not the steps, until all ten runs behave.
7. **The owner's read.** Show the owner the skill and the test cases. Write down what they changed. It will be something only they knew.

**Checkpoint:** failing tests committed before the code, a skill that passes the check and loads only when it should, a plugin that loads, and the owner's change recorded in `NOTES.md`.

**Check it now.** Download [Task 21's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch16-key-task-21.md). It is a checklist, since the work is your own.

*Domain expert and builder.* The expert owns the rules, the cases, the order and who acts on each result. The builder directs the agent and owns what it produces: the tests, the code, the skill and the plugin. The builder also makes sure every "never" that must hold is a setting.

### If something goes wrong

| Problem | What to try |
| --- | --- |
| `claude` is not found | The desktop app does not include it. Install it, as "Before you start" says, and open a new terminal |
| `npm run triage` cannot find a package | A new clone has no packages yet. Ask the agent to run `npm ci` |
| A new test passes before `src/triage.ts` exists | It tests nothing. Check that it imports from `../src/triage.ts` |
| The skill never loads | Read its description against the request. Put the main use first. Start a new session after every edit |
| The skill loads for "should we pay?" | The description lacks "never use it to decide whether to pay" |
| `claude plugin validate` warns about an unknown field | Claude's manifest takes Claude's fields. The core takes the standard's. Do not mix them |
| `npm run check:plugin` fails on a skill field | A field outside the six. Move a product's setting to where that product reads it ([16.10](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/both-ai-vendors/)) |
| The connector lists the wrong folder, or fails to start | `./data` counts from where the server started. In Claude Code that is the session's folder, so start from the repository's root. A host can also send folders of its own, which replace the one on the command line. Write down what you saw |
| The connector will not start on Windows | Ask the agent to start `npx` through `cmd /c`, as the server's README says |
| The connector can write | The deny rules use the wrong tool names. Ask the agent to list the connector's tool names exactly as the product shows them |
| `/plugin` says it is not available | It works in a session you start from a terminal, not in the *Code* tab |
| A task skips the connector | Its folder option has no default, or the task runs in the cloud, not on your computer |
| Chat says it cannot run the script | Turn on code execution, and attach all three files |
| Codex does not see the plugin | Check that `codex plugin list` says installed. If it says not installed, run `codex plugin add brightline-ap@brightline-openai`. Then restart the ChatGPT desktop app, trust the project, and start a new chat |
| `codex plugin marketplace list` shows `brightline`, not `brightline-openai` | You added the folder before `.agents/plugins/marketplace.json` existed, so Codex used Claude's catalog. Remove `brightline`, and add the folder again |
| Codex says `apdata` failed to start | That is the plugin's copy of the connector, in Codex's cache. Check that `.codex/config.toml` declares the project server, and that you trusted the project |
| The `skills-ref` step shows a failure but the job is green | It is advisory (Task 15). Read its message. Your own `check:plugin` is the blocking check |
| OpenCode loads no skill | Check the `skills` path, and that a `skill` rule does not deny it |
| OpenCode says it has no `apdata` | The server may still be starting. Wait ten seconds, and ask again |
| The telemetry file has no records | The variables were not set on the same command that started `claude` |

### Without a paid Claude plan

[0.2.4](https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/desktop-apps/#optional-the-claude-app-without-a-claude-plan) shows how to run the Claude app on another company's model, but this lab also runs the `claude` command, which that setup does not cover. So without a paid plan, do Tasks 1 to 5, 7 to 12 and 14 to 16 in Codex or OpenCode, with its safety settings from [16.10](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/both-ai-vendors/#practice-from-a-prompt-to-a-skill) set first. Skip each step that runs the `claude` command, but still make the `ch16-install` clone in Task 11, because Task 16 uses it. In Task 1, ask the agent to run `npm run due -- 2027-03-12`. Write Claude's manifest and connector file anyway, and let `npm run check:plugin` check them. Then do the port for your tool, Task 18 or Task 20, and run Tasks 6, 8 and 9's requests there. Say in `ports/ch16.md` that Claude Code was not run.

### Artifact checklist

Tick what your route covered.

- [ ] Your first skill's answer checked against the command (Task 1)
- [ ] Your repository on GitHub, with `main` protected and the three checks required (Task 10)
- [ ] Your Task 2 table, Task 6 load table, Task 12 cases and Task 13 telemetry note in `NOTES.md`
- [ ] `tests/triage.test.ts`, committed failing before `src/triage.ts`, and `npm run triage`
- [ ] `plugin/skills/` with `invoice-triage`, `ap-triage` and `due-by-friday`, six fields each, none working out a date or number itself, the parity and sheet tests, and a first line that names the version and the policy
- [ ] `plugin/plugin.json` and `plugin/mcp.json` (Agent Plugins 1.0.0), `plugin/.claude-plugin/plugin.json` and `plugin/.mcp.json`
- [ ] The connector pinned at 2.1.0, and its write tools denied in `.claude/settings.json`, `.codex/config.toml` and `opencode.jsonc`, and blocked in claude.ai's connector settings for chat and tasks
- [ ] `plugin/CHANGELOG.md`, `.claude-plugin/marketplace.json` (catalog `brightline`), `.agents/plugins/marketplace.json` (catalog `brightline-openai`), and `evals/README.md`
- [ ] Your decision on `exercises/ap-helper-plugin/`, with the line that decided it
- [ ] `plugin-valid` as a required check, with its tests, the version check and its two Python dependencies locked
- [ ] Your Task 16 notes: the two first lines, the two last lines, and every check that went red and what turned it green
- [ ] `ports/ch16.md` with each place you used, each with loaded, ran and verified recorded separately, and how a new version reaches it, and tag `ch16`, checked from a clean clone
- [ ] Task 21, at work: your own tests, skill and plugin, built with an agent, with the owner's change recorded

[^github-rulesets]: About rulesets, GitHub.
[^github-codeowners]: About code owners, GitHub.
