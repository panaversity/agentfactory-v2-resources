# Lab 15: a reviewed pull request

Chapter 15 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 15: a reviewed pull request](https://agentfactory2.panaversity.org/building-ai-workers/code-review/lab/), so you can do the lab without the book.

*Time: about 4 hours. Lab files: `brightline-lab-ch15.zip`, which needs no earlier lab. The same steps are in `LAB.md` inside the zip.*

### Before you start

*What you need.*

- The Claude desktop app with a Pro, Max, Ultra, Team or Enterprise plan.
- The ChatGPT desktop app with any plan, or OpenCode Desktop with a model connected, for Task 12, as in [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/).
- Git, Node.js 24 or later, and uv, as in [Lab 13](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/lab/). If a tool is missing, follow Concept [13.2](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/the-workbench/) before Task 1.
- A free GitHub account, and the `gh` command-line tool. `field-guide-code-review-setup.md`, in the download, has the steps to install `gh`. Sign in yourself with `gh auth login` before Task 3. Never type a password or token into an agent's chat.

**Public repository, on purpose.** On a free GitHub account, branch protection, rulesets and code owners work only on public repositories. Every name, invoice and amount in Brightline is made up, so this lab uses a public repository. In real work, private code needs a private repository on a plan that can protect it. Never push real company data to a public repository.

**Working alone.** GitHub does not let you approve your own pull request. Task 6 shows two ways to deal with this.

**The core path and the extensions.** The core path is Tasks 1 to 11, one route in Task 12, and Task 13. The second route in Task 12 is an extension.

For [the Python side](#the-python-side), or [without a paid Claude plan](#without-a-paid-claude-plan), see the two sections near the end of this page.

**Which AI review you can use.** Task 8 has three routes. Route C needs nothing beyond your Claude plan, and every task works on it.

| You have | Route | Cost to you |
| --- | --- | --- |
| A Team or Enterprise organization where an Owner has turned on Code Review | A. Code Review on the pull request, and your own security step in CI | Billed on usage credits, within a limit your Owner sets. The security step needs an API key |
| An Anthropic API key | B. The security review Action in your workflow, with a step that fails on findings | API usage. Set a spend limit on the key first |
| Neither | C. `/code-review --comment` and `/security-review` in a local session | Your plan's usage |

**The lab files.** Download [brightline-lab-ch15.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15.zip) and unzip it into a new folder. It contains:

- `brightline-ap/`, the repository with its git history. It holds the tag `ch14`, one commit of lab starting files (a stub workflow, which is only a placeholder, and `changes/README.md`), tagged `lab15-start`, and two branches. `weekend-rule` is the Chapter 13 weekend change behind a flag. `agent-speedup` is a change an agent says "speeds up" the due list. The tag `weekend-rule-start` marks the last commit of `weekend-rule` as you receive it. This is the only folder you give an agent.
- `LAB.md`, a copy of these steps.
- `field-guide-code-review-setup.md`, with the exact clicks and commands for GitHub and each review tool, and `field-guide-code-toolchain.md`, with the install steps for Git, Node.js, uv and Python.

Each task links its answer key as a separate download. Open a key in a text editor, never in the agent. An agent that can read the answers is not tested by them.

Use the zip's copy, even if you finished [Lab 14](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/lab/) in your own repository. The answer keys match its commits and line numbers.

**The date in this lab.** Today is Thursday, March 4, 2027, and the payment run is Friday, March 5.

### The job

Finance wants the weekend rule, and an agent has a "faster" due list. Ana Morales, the AP analyst, will not let either reach `main` the old way. She wants every change to arrive as a pull request with its evidence. An AI should review it against rules the team wrote. Checks a machine runs every time should be able to stop it. And a person should approve it when it touches money. She wants the weekend rule merged so it is reviewed and kept up to date, but off until Dave Kowalski, the controller, decides. And she wants to know, for each kind of mistake, which check catches it. As in every lab, every number comes from tested code, never from an AI's reply.

![The main line runs from lab15-start to the tag ch15. Above it, three branches leave and merge back: review-setup in Tasks 4 to 6, secret-check in Task 10, and handover in Task 13. Below it, weekend-rule leaves at the start and merges in Task 11 with the flag off, after secret-check. agent-speedup also leaves at the start, and its pull request is closed without merging. A note says to switch to main and pull before creating the next branch.](img/lab-map.png)

*Figure 15.17. The lab's branches and pull requests. Pull `main` after every merge, before the next branch.*

### How each task works

Each task has a goal, steps and a **Checkpoint**. Do not start the next task until the checkpoint is true. In the Claude desktop app, work in *Manual* mode unless a task says otherwise.

The agent runs every command in this lab, such as git, `gh`, npm and uv. You run only `gh auth login` and, on Route B, `gh secret set`, because each one takes something only you should type. On the OpenCode route, you also start `opencode` yourself. Before you approve a command, read what the agent says it will do, and say no to anything you do not understand. Read every git and `gh` command twice, because they act on a shared repository. Asking "What does this command do?" is always fine.

Predict before the agent runs anything. Write your predictions and notes in `NOTES.md`. Keep `NOTES.md` out of the task commits until Task 13: ask the agent to stage only the files each commit needs, as Concept [15.2](https://agentfactory2.panaversity.org/building-ai-workers/code-review/git-through-the-agent/) says.

### Task 1. Which check should catch this? (15 minutes)

*Goal:* choose a tier and a check before any tool is open.

1. Read the tier table in Concept [15.9](https://agentfactory2.panaversity.org/building-ai-workers/code-review/approval-scaled-by-risk/). For each change below, write in `brightline-ap/NOTES.md`, in a text editor, under "Task 1", the risk tier and the one check that should catch its problem:
   - a. A README sentence says the due list runs on Thursdays. It runs on Fridays.
   - b. A new helper reads amounts as decimals, so $4,825.00 becomes 4825.
   - c. An agent changes an expected total in `tests/due-by-friday.test.ts` "to match the new output".
   - d. A workflow file gains `permissions: write-all`.
   - e. A debug line prints the API key to the console.
   - f. The weekend flag is turned on in the default settings.

**Checkpoint:** you have a tier and a check for all six.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-1.md). Your tiers should match the key. If a check differs, say why yours would or would not catch it.

### Task 2. Read the history through the agent (20 minutes)

*Goal:* the git words from Concept [15.2](https://agentfactory2.panaversity.org/building-ai-workers/code-review/git-through-the-agent/), seen in this repository.

1. Open `brightline-ap` in the Claude desktop app's *Code* tab, in a *Local* session, in *Manual* mode. Send:

   > Please set my git name and email for this project only, and ask me what they are. Then install the packages from the lock files, with `npm ci` and, in `py/`, `uv sync`. Then run `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py`, and show me what each one prints.

   If the agent wants to change your git settings for the whole computer, say no. All four checks pass.
2. Send these one at a time, and read each command before you approve it:
   - "Show me the branches and tags, and the history as a graph."
   - "For each branch other than main, list the files it changes compared with main. Change nothing."
   - "Show me the diff of `agent-speedup` against main for `src/due-by-friday.ts` only."
3. In `NOTES.md`, under "Task 2", write: the commit `lab15-start` points to, how many commits each branch adds, and the one character in the diff that changes the meaning.

**Checkpoint:** the agent changed nothing. Ask it to run `git status`, which lists only your `NOTES.md`.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-2.md). Your notes should match it.

### Task 3. Put it on GitHub (20 minutes)

*Goal:* the repository, its tags and both branches, on GitHub.

1. Send: "Please run `gh auth status` and show me what it prints." It must say you are logged in. If it does not, run `gh auth login` yourself, in a terminal, and ask again.
2. Send:

   > Create a public GitHub repository named `brightline-ap` from this folder with `gh`. Push `main` with `git push -u origin main`, so my local `main` tracks GitHub's. Then push all tags and the branches `weekend-rule` and `agent-speedup`. Do not push any other branch. Show me each command before running it.

3. Before you approve `gh repo create`, check that it says `--public` and `--source .`. Before you approve a push, check its branch name.
4. Open the repository on GitHub. Ask the agent to run `git remote -v` and `git status`. Note the remote's name. `git status` on `main` should say your branch is up to date with `origin/main`. That link, the **upstream**, is what lets a plain `git pull` work in later tasks.

**Checkpoint:** GitHub shows `main`, `weekend-rule` and `agent-speedup`, and the tags `ch14`, `lab15-start` and `weekend-rule-start`. `git status` on `main` mentions `origin/main`.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-3.md).

### Task 4. Required checks (25 minutes)

*Goal:* a workflow that runs every machine check on every pull request.

1. Send:

   > Make a new branch called `review-setup` and switch to it. Then replace the stub `.github/workflows/ci.yml` with a workflow that runs on pull requests to main, for the event types opened, synchronize, reopened, labeled and unlabeled. Give the workflow token only `contents: read`. Make two separate jobs on Ubuntu, so a failure in one does not hide the other.
   >
   > 1. `checks`, with a 15-minute timeout: check out the code, set up Node 24 and uv, then run `npm ci`, `npm run typecheck`, `npm test`, `uv sync --locked` in `py/`, `npm run test:py` and `npm run check:py`.
   > 2. `tests-unchanged`, with a 5-minute timeout: check out the code with full history, then run `scripts/check-tests-unchanged.sh` with the base branch, `origin/<base branch name>`.
   >
   > Write that script too. It fails when the pull request removes or edits a line in an existing file under `tests/` or `py/tests/` compared with the base branch, unless the variable `ALLOW_TEST_CHANGES` is `true`, which the job sets when the pull request has the label `tests-changed`. It also fails when the pull request adds a line that switches a test off: `.skip(`, `.only(`, `.todo(`, `pytest.mark.skip`, `xfail`, or a bare `return` in a test file. If the script cannot find the base branch, it must fail, never pass. Comment at the top what it cannot catch. Do not use `pull_request_target`. Show me the workflow before you write it.

2. Compare the workflow, line by line, with Concept [15.8](https://agentfactory2.panaversity.org/building-ai-workers/code-review/checks-that-block/). Check five things: the `permissions` line, that no step uses a secret, the trigger, that there are two jobs, and `fetch-depth: 0` on the `tests-unchanged` checkout.
3. Ask the agent to test the script here, with `bash scripts/check-tests-unchanged.sh main`, and then with a branch that does not exist, `bash scripts/check-tests-unchanged.sh no-such-branch`. The second must fail. A check that passes when it cannot see is worse than no check.
4. Predict what the script would say for `agent-speedup` and `weekend-rule`. Then ask the agent to check with `git diff -U0 main...agent-speedup -- tests py/tests`, and the same for `weekend-rule`. The three dots compare a branch with the point where it left `main`, as Concept [15.2](https://agentfactory2.panaversity.org/building-ai-workers/code-review/git-through-the-agent/) says.

**Checkpoint:** the script fails on a missing branch, and you have your two predictions. Ask the agent to commit on `review-setup`.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-4.md). Your workflow should match its meaning, and your predictions should be right.

### Task 5. The rules files and code owners (25 minutes)

*Goal:* the rules a reviewer reads, the template, the tiers and the owners, all written before any review.

1. Send:

   > Please help me write `REVIEW.md`. Ask me, one area at a time, what failure means for Brightline: money, dates, rules, secrets and tests. Then draft the file from my answers. It must also limit nits to three, name the paths to skip, ask for a file and line for every finding, and ask for a count first and "No issues found." when there are none. It must ban formatting comments, ask for the input that breaks each finding, and say that an agent's approval never counts, and how GitHub enforces the tiers here: one approval for all of `main`, and code owners for the high-tier paths. It must hold these risk tiers. Low: `README.md`, `NOTES.md`, `ports/`, `changes/` and `exercises/`, with no person once every required check is green. Medium: `src/`, `py/brightline_ap/`, `scripts/` and new tests, with one person. High: due dates, the due list, money formatting, `data/`, `.github/`, `CODEOWNERS`, `REVIEW.md`, the check scripts, the test and type-check settings, `.env.example`, any change to an existing test and any policy flag turned on, with two people, one of them a code owner. Show me the draft before you save it.

   You decide every line. Say what you want changed before you approve it.
2. Read `AGENTS.md` and `CLAUDE.md`. They should stay short. `AGENTS.md` already says "Never push to `main`. Every change goes through a pull request." In Task 6, GitHub starts enforcing that rule too.
3. Send: "Please write `.github/pull_request_template.md`. Its five headings are what and why, how it was tested, risk, how to undo it, and who directed the agent."
4. Send:

   > Please write `.github/CODEOWNERS` with my GitHub user name as owner of the high-tier paths only: `.github/`, `REVIEW.md`, `AGENTS.md`, `data/`, `.env.example`, `src/due-date.ts`, `src/due-by-friday.ts`, `src/money.ts`, `py/brightline_ap/due_date.py`, `tests/` and `py/tests/`. Add the files that decide whether a check means anything: `scripts/check-*.sh`, `package.json`, `tsconfig.json` and `py/pyproject.toml`. Do not add a line for every file.

   A change that edits the test command or a check script can weaken every test without touching one, so those files have an owner. A line for every file (`*`) would make every change wait for the owner.
5. Ask the agent to commit the three new files on `review-setup`.

**Checkpoint:** `REVIEW.md`, the template and `CODEOWNERS` are committed on `review-setup`.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-5.md). `REVIEW.md` should pass its checklist of six points.

### Task 6. Merge the setup, then protect main (20 minutes)

*Goal:* the rules on `main`, and `main` protected by them.

1. Send: "Please push `review-setup` and open a pull request to `main` with `gh pr create`, filling in the template. Then watch the checks with `gh pr checks --watch`." The `checks` and `tests-unchanged` jobs must both pass.
2. Merge it yourself on GitHub. Nothing protects `main` yet, which is why the rules go in first.
3. Send: "Please switch to `main` and pull." Expect `git switch main` and `git pull`. GitHub's `main` moved when you merged, and your local `main` does not move until you pull, as Concept [15.3](https://agentfactory2.panaversity.org/building-ai-workers/code-review/github-and-the-pull-request/) says.
4. If a classmate will review with you, invite them as a collaborator. Ask the agent to add their user name to `.github/CODEOWNERS` in a small pull request, and merge it before the next step.
5. Now protect `main`, yourself, in the repository's *Settings*, using a ruleset. `field-guide-code-review-setup.md` has the clicks. Turn on: restrict deletions, block force pushes, require a pull request before merging, with 1 approval, dismiss stale approvals when new commits are pushed, and require review from code owners. Also require conversation resolution before merging, and require the status checks `checks` and `tests-unchanged` to pass. A ruleset sets one approval count for the whole branch, so even a low-tier change needs one approval here. Code owners add the owner for the high-tier paths, as Concept [15.9](https://agentfactory2.panaversity.org/building-ai-workers/code-review/approval-scaled-by-risk/) says.
6. *Working alone.* Add *Repository admin* to the ruleset's bypass list, with its mode set to *For pull requests only*. With *Always allow*, the bypass would let even step 7's direct push through. If you bypass, every time you merge you will write one line in the pull request saying why, then ask the agent to merge with `gh pr merge --merge --admin`. Without `--admin`, GitHub refuses. In a team this is never the answer.
7. Send: "Please add one line to `NOTES.md`, commit it on `main`, and push it straight to `main`." If the agent objects, because `AGENTS.md` forbids it, say: "This tests the ruleset. Please try it." Read the push command before you approve it. Predict, then approve. After GitHub refuses it, send: "Please undo the local commit and keep the edit, with `git reset HEAD~1`." That is safe here, because the commit never left your computer, and it keeps every change.

**Checkpoint:** your local `main` has `REVIEW.md`, the push in step 7 is refused by GitHub, and the ruleset lists the rules from step 5. Do not let the agent find a way around the refusal.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-6.md).

### Task 7. Review before the pull request (25 minutes)

*Goal:* evidence that the tests came first, evidence for the change, a fresh-context review, and a change brief, before anyone else sees it.

1. Send: "Please switch to `main` and pull. Then switch to `weekend-rule`, merge `main` into it, and list the `scripts` folder." Read the merge message. It should report no conflicts, and the list should show `check-tests-unchanged.sh`. If the merge says "Already up to date", your `main` was not pulled.
2. Check the tests came first. Ask the agent to run `git log --oneline --reverse lab15-start..weekend-rule-start`. The first commit should be "Failing tests for the weekend rule", before the commit that adds the rule. Predict: at that first commit, `npm test` and `npm run typecheck` should both fail because the weekend code does not exist yet, and for no other reason. The missing code is `payBy`, and the `weekendRule` option the tests pass. Then send: "Please look at that first commit on its own with `git switch --detach weekend-rule-start~1`, run `npm test` and `npm run typecheck`, then `git switch weekend-rule` to go back." A **detached HEAD** means you are looking at one commit, not working on a branch, so nothing you do there changes a branch.
3. Ask for the evidence, not a summary: "Run the four checks, `npm run due -- 2027-03-05`, the same with `PAY_WEEKEND_RULE=on`, and `bash scripts/check-tests-unchanged.sh main`. Show me each output." Write each number in `NOTES.md`.
4. Open the app's change pane, the *Changes* card in Claude Code. Compare it with `git diff --stat main...weekend-rule`, which the agent runs. In `NOTES.md`, write what each one shows, and which one a reviewer of the whole branch needs.
5. Open a new session as the reviewer (*+ New*, same folder). Send:

   > You are reviewing a pull request you did not write. The request: pay a Saturday or Sunday due date on the Friday before, behind the flag `PAY_WEEKEND_RULE`, off by default. Read the review rules as they are on `main`, with `git show main:REVIEW.md`, not the copy on this branch. Review `git diff main...weekend-rule`, including anything else in the repository the change affects. Report a count first, then each finding with a file, line, severity and the input that breaks it. Change nothing.

6. In the first session, run `/code-review`. Compare the two reviews in `NOTES.md`: what each found, and what only one found.
7. Send: "Please write `changes/weekend-rule.md` from the template in `changes/README.md`, using only numbers from the output above and the tests-first result." Read every claim, and check that each one points to a command.

**Checkpoint:** your notes record three things. The tests came first and failed only because the weekend code was missing. The four numbers are there: 8 invoices and $19,229.53, 10 invoices and $33,109.53. And they say whether each review found the issue in `src/reconcile.ts`. If neither found it, say so. Task 8 gives it another chance. Ask the agent to commit the brief on `weekend-rule`.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-7.md).

### Task 8. Open the pull request and resolve every finding (30 minutes)

*Goal:* the weekend rule as a pull request, reviewed by AI on your route, with every finding resolved.

1. Send: "Please push `weekend-rule` and open a draft pull request to `main`, with the template filled in and the brief linked. I will give you the title." Give it a title yourself. You can use the app's *Create PR* button instead. It runs the same `gh` command, and the pull request's checks then show in the *Changes* card. Leave *Merge when ready* and *Auto-fix* off in this lab: you merge by hand in Task 11, after reading the checks.
2. Run the AI review on your route:
   - *Route A.* Mark the pull request ready, or comment `@claude review`. Wait for the *Claude Code Review* check run and the inline comments. For the security step, follow Route B, which needs an API key.
   - *Route B.* Store the key yourself, in a terminal, with `gh secret set CLAUDE_API_KEY`, typing the key only into `gh`. Then ask the agent to make a new branch from an up-to-date `main`. Paste the security review job from `field-guide-code-review-setup.md`, section 7, into the chat, and ask it to add the job to `ci.yml`, with its step that fails when it reports findings. Open it as its own pull request. It touches `.github/`, so it is high tier. Merge it. Then ask the agent to switch to `main` and pull, switch to `weekend-rule`, merge `main` and push. Read the job's comments. Keeping the job out of the weekend pull request means Task 9 gets it too, and Task 10's change to `ci.yml` does not collide with it.
   - *Route C.* Run `/code-review --comment` on the branch, so the findings appear on the pull request as inline comments, then `/security-review`. `/code-review` reads `CLAUDE.md`, not `REVIEW.md`. Paste the security summary into a comment.
3. For each finding, decide: fix, or resolve with a reason. For the reconciliation finding, if it appears, predict first, then ask the agent to run `PAY_WEEKEND_RULE=on npm run reconcile -- data/invoices.csv`, so you see it for yourself.
4. Send: "Add a test to `tests/reconcile.test.ts` that sets `PAY_WEEKEND_RULE=on` and expects 0 mismatches in `data/invoices.csv`. Run it and show it failing. Then make reconciliation compare stated dates with `dueDate`, not the pay date, and remove any function nothing uses. Do not change existing tests. Then commit and push."
5. Reply in each finding's thread with the fix's commit id or your reason, and resolve it. Ask the agent to update the brief's Review section, commit it and push.

**Checkpoint:** every review thread is resolved, the `checks` and `tests-unchanged` jobs are green on the latest commit, `PAY_WEEKEND_RULE=on npm run reconcile -- data/invoices.csv` reports 0 mismatches, and `check-tests-unchanged.sh` still passes, because you added lines and removed none.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-8.md).

### Task 9. The agent's change (20 minutes)

*Goal:* see which check catches which problem.

1. Send: "Please switch to `main` and pull. Then switch to `agent-speedup`, merge `main` into it, push it, and open a pull request with this description: Speed up the due list with a single pass. All tests pass."
2. Before you look at the checks, predict which of the three problems each check will catch: the cutoff `<`, the edited test, and the printed key.
3. Run the AI review on your route, as in Task 8.
4. Ask the agent to run `gh pr checks`, then read the review. Fill in a table in `NOTES.md` with one row per problem and one column per check, and mark which check caught it. Note which column is blocking.

**Checkpoint:** the merge button is blocked, and `checks` and `tests-unchanged` failed. Do not merge, and do not close it yet.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-9.md). Your table should match it: the `checks` job catches the cutoff, the `tests-unchanged` job catches the edited test, and on Route C no blocking check catches the printed key.

### Task 10. Fix it at the source (15 minutes)

*Goal:* the problem that only a review caught is now caught by a check every time.

1. Pick the problem in your Task 9 table that no blocking check caught. On Routes A and B with the security step, it may be none. Then use the printed key anyway, because a model can miss it.
2. Send:

   > Please switch to `main`, pull, and make a new branch called `secret-check`. Write `scripts/check-no-secret-output.sh`, which fails when a logging or print call in `src/`, `scripts/` or `py/brightline_ap/` names a key, token, secret or password on the same line. It must fail, not pass, if a folder is missing or the search itself fails. Add it to `ci.yml` as a third job, `no-secrets`. Run the script here and show me the output. Then tell me what the script cannot catch.

   It should pass, because `main` prints no key. Write the agent's answer about what it cannot catch in `NOTES.md`.
3. Ask the agent to open it as a pull request. It touches `.github/`, so it is high tier and needs the code owner. Merge it. Then add `no-secrets` to the ruleset's required checks. It appears in the list now that it has run once.
4. Send: "Please switch to `main`, pull, switch to `agent-speedup`, merge `main`, and push." Then ask it to run `gh pr checks` again, and to show the failed `no-secrets` job's log.

**Checkpoint:** the script passes on `main`, and the `no-secrets` job passes on the `secret-check` pull request and fails on `agent-speedup`, naming `src/ap-client.ts`, line 14. Close the `agent-speedup` pull request with one sentence saying why.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-10.md).

### Task 11. Merge, flag, revert (15 minutes)

*Goal:* the weekend rule on `main`, off, with the way back rehearsed.

1. Send: "Please switch to `main`, pull, switch to `weekend-rule`, merge `main`, and push. Then watch the checks with `gh pr checks --watch`." The `no-secrets` job became required in Task 10 and has never run on this pull request, so GitHub would wait for it forever. Every job must pass.
2. If the weekend pull request is still a draft, mark it ready. Your classmate approves it as code owner, or you bypass, with your reason. Then merge it.
3. Send: "Please switch to `main` and pull. Then run `npm run due -- 2027-03-05`, and the same with `PAY_WEEKEND_RULE=on`."
4. Rehearse the revert. Send: "Please make a new branch called `revert-rehearsal`, and revert the merge commit of the weekend pull request with `git revert -m 1`. Then run the four checks and the due list, with the flag off and on." If you merged with *Squash and merge*, there is no merge commit, so ask it to revert the single squashed commit without `-m 1`. Then ask the agent to switch to `main` and delete the rehearsal branch. Do not push it.
5. Read Concept [15.10](https://agentfactory2.panaversity.org/building-ai-workers/code-review/after-the-merge/) on merge queues. On a free personal account GitHub offers none, so write in `NOTES.md` which two pull requests in this lab could have passed alone and broken `main` together. If you have none, say why.

**Checkpoint:** on `main`, 8 invoices, $19,229.53 with the flag off, and 10 invoices, $33,109.53 with it on. On the rehearsal branch, 8 invoices with the flag on or off, and every check passing.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-11.md).

### Task 12. Port the review (20 minutes per route)

*Goal:* the same weekend change, reviewed by a second agent, compared with the first.

*Set up the same starting point.* The weekend change is merged now, with its fix. To give a second reviewer the change as it first was, with the same rules, build two practice branches that never merge. Send:

> Please switch to `main` and pull. Make a new branch `review-base` from the tag `lab15-start`, and copy the rules from `main` with `git checkout main -- REVIEW.md AGENTS.md`. Add a section to the end of `AGENTS.md`: `## Code Review Rules`, with one line, "Read `REVIEW.md` from the base branch first and follow it." Commit on `review-base`. Then make a new branch `port-review` from the tag `weekend-rule-start`, merge `review-base` into it, and push both branches.

Codex reads that heading. Now `git diff review-base...port-review` shows only the weekend change, and both branches carry the rules.

Copy your Task 7 notes into `ports/ch15.md`, as the first reviewer. For each route you do, add what it found, what it missed, where it posted, and whether anything it did could block a merge. Do not commit `ports/ch15.md` on these practice branches. It stays in your working tree as you switch branches, and Task 13 commits it.

#### The Codex route

In the ChatGPT desktop app, connect the repository in Codex settings. Ask the agent to open a draft pull request from `port-review` into `review-base`, and comment `@codex review`, which needs the Plus plan or above. Or open the folder in Codex on `port-review`, in *Ask for approval* mode, and run `/review` against the base branch `review-base`. Set reviews to *Detached* first, so the review runs in its own chat. Then, on a branch from `main`, ask it to add the same `## Code Review Rules` section to `AGENTS.md`, and merge it through a pull request.

#### The OpenCode route

On `port-review`, ask the agent to create `.opencode/commands/review.md`, with a prompt that reads the rules with `git show review-base:REVIEW.md`, so it uses the base branch's copy, and reviews `git diff review-base...HEAD` without editing anything. Add `subagent: true` to its frontmatter, so it runs in a child session with fresh context. In `opencode.jsonc`, deny edits and let only `git diff`, `git log` and `git show` run without asking. `field-guide-code-review-setup.md`, section 10, has both files to paste into the chat. Run `/review` in OpenCode's terminal client, started with `opencode` in the folder. OpenCode's commands page describes running commands there, and does not mention Desktop. Read what it found, and its diff, in OpenCode Desktop if you prefer.

**Checkpoint:** `ports/ch15.md` compares at least two reviewers on the same change, including whether each found the reconciliation issue.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-12.md).

### Task 13. Hand over and tag (10 minutes)

*Goal:* the next chapter starts from a tag where every change arrives as a reviewed pull request.

1. Send: "Please switch to `main`, pull, and make a new branch called `handover`. Update `NOTES.md` with how changes reach `main`, the required checks, and the weekend flag. Commit `NOTES.md` and `ports/ch15.md`, push, and open a pull request." Let the checks pass, and merge it. It is low tier, so no code owner is asked, but it still needs the one approval every pull request needs here, or your bypass with a reason.
2. Send: "Please switch to `main`, pull, tag it `ch15`, and push the tag." Expect `git tag ch15` and `git push origin ch15`.
3. Check the tag from a clean copy. Send: "Please clone my repository at the tag `ch15` into a new folder `ch15-check`, with `git clone --branch ch15`. In that folder, run `npm ci`, and `uv sync` in `py/`. Then run the four checks and the due list with the flag off and on."

**Checkpoint:** every command passes in `ch15-check`, with 8 invoices off and 10 on, and GitHub lists the tag `ch15`. From Chapter 16 on, every change is opened as a pull request.

**Check it now.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch15-key-task-13.md).

### If something goes wrong

| Problem | What to try |
| --- | --- |
| `gh` says you are not logged in | Run `gh auth login` yourself in a terminal. Never paste a token into the agent's chat |
| The workflow does not run on the pull request | Check that the trigger says `pull_request` with `branches: [main]`, and that the pull request targets `main`. A pull request that adds or changes the workflow runs its own version |
| `check-tests-unchanged.sh` says "Cannot find the base branch" | The checkout has no history. Use `fetch-depth: 0` in that job's checkout step |
| `git pull` says "There is no tracking information for the current branch" | `main` was pushed without `-u`. Ask the agent to run `git branch --set-upstream-to=origin/main main` once, then `git pull` |
| `git status` says "HEAD detached" | You are still on the commit from Task 7, step 2. Ask the agent to run `git switch weekend-rule` |
| `git merge main` says "Already up to date", but files from a merged pull request are missing | Your local `main` is behind GitHub's. Ask the agent to switch to `main` and pull, then merge again |
| Adding the `tests-changed` label does not rerun the checks | The workflow's `types` list needs `labeled` and `unlabeled` |
| The status check `checks` is not offered in the ruleset | It appears only after the job has run once. Open any pull request, let it run, then add it |
| The ruleset has no effect | The repository is private on a free account. Make it public for this lab, or use a paid plan |
| You cannot approve your own pull request | That is GitHub's rule. See Task 6, steps 4 and 6 |
| `@claude review` also starts the GitHub Action | Both use `@claude`. Set the Action's `trigger_phrase` to something else |
| Code Review never runs | It needs Team or Enterprise, an Owner to turn it on, and the Claude GitHub App on the repository. It skips drafts and forks. Use Route C |
| The security review job fails with "API key" | The secret is missing or misnamed. Fork pull requests never get secrets |
| `git merge main` reports a conflict | Ask the agent to show both sides, explain each, and propose a resolution. Read it before you approve |
| The agent offers `git push --force` or `git reset --hard` | Say no and ask what it wants to undo. Use `git revert` for anything already pushed |

### The Python side

The review is about the TypeScript change, as in Chapter 13. The required checks run both languages, so keep `py/` working. In Task 7, also review the Python `pay_by` on `weekend-rule`, which has no flag and touches no reconciliation.

### Without a paid Claude plan

Do Tasks 1 to 11 in Codex in the ChatGPT desktop app, or in OpenCode Desktop, with these swaps. Then port to the agent you did not use in Task 12. Every other step is the same, because git, `gh` and the checks do not depend on the agent.

| Lab step | Codex in the ChatGPT desktop app | OpenCode Desktop |
| --- | --- | --- |
| Safety, before Task 2 | Permission mode *Ask for approval*, *Work in* set to *This computer* | The `opencode.jsonc` rules from [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/), with shell commands set to ask, and auto-accept off |
| Task 2, step 1: open the folder | Open `brightline-ap` | Open `brightline-ap` |
| Task 5: rules files | Edit `AGENTS.md`. Skip `CLAUDE.md` | Edit `AGENTS.md`. Skip `CLAUDE.md` |
| Task 7, step 4: the change pane | The review pane, set to the branch diff | The review panel |
| Task 7, step 5: a fresh-context reviewer | A new chat in the same folder | A new session in the same folder |
| Task 7, step 6: the local review | `/review` against the base branch `main` | The `/review` command from Task 12, reading `main` in place of `review-base`, run in the terminal client |
| Tasks 8 and 9: the AI review | Route C with `/review`, then paste its findings into the pull request as comments. Or comment `@codex review` once the repository is connected | Route C with the `/review` command, then paste its findings as comments |

### Apply it to your vertical

Take one repository or shared folder at work. Write its risk tiers: which paths are low, medium and high, and why. Name the person who must approve the high tier, and the one check a machine should run on every change there. If nothing runs today, that check is your first pull request.

*Domain expert and builder.* The domain expert says what failure means and owns the high-tier decisions, such as when a policy flag is turned on. The builder turns those into a rules file, required checks and code owners, and makes sure no agent can merge around them.

### Artifact checklist

- [ ] Your Task 1 tiers and checks, and the Task 2 history notes, in `NOTES.md`
- [ ] The repository on GitHub, public, with `main`, the tags and both lab branches
- [ ] `.github/workflows/ci.yml` with read-only token, and `scripts/check-tests-unchanged.sh`
- [ ] `REVIEW.md` with the risk tiers, `.github/pull_request_template.md` and `.github/CODEOWNERS`, merged before any review
- [ ] A ruleset on `main` that refused a direct push
- [ ] `changes/weekend-rule.md`, with every claim pointing to a command
- [ ] The weekend pull request, every thread resolved, merged with the flag off
- [ ] The `agent-speedup` pull request closed, with your table of which check caught which problem
- [ ] `scripts/check-no-secret-output.sh`, run by the `no-secrets` job, as a required check
- [ ] A rehearsed revert, and your merge queue note
- [ ] `ports/ch15.md`, and tag `ch15`, checked from a clean clone
- [ ] Extension: a second reviewer in Task 12, and risk tiers for one repository at work
