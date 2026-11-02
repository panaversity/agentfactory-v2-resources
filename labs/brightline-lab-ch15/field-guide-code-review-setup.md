---
id: E.code-review-setup
title: "Field guide: GitHub, required checks and AI review"
chapters: ["15"]
companion_sections: []
verified: 2026-10-31
next_review: 2026-11-30
---

# GitHub, required checks and AI review: current practice

This field guide holds the exact steps for Lab 15 and for real repositories. Chapter 15 keeps only what changes a decision. Menus and labels were checked against first-party documentation on October 31, 2026, and again on November 2, and can move. The GitHub steps in sections 1 to 5 were also run on github.com on November 2, 2026, through `gh` and GitHub's API. If a label differs, look for the same idea nearby.

## 1. The GitHub command-line tool

1. Install `gh` from [cli.github.com](https://cli.github.com): `brew install gh` on macOS, `winget install --id GitHub.cli` on Windows, or your Linux package manager.
2. Sign in yourself, in a terminal, never through an agent's chat: `gh auth login`. Choose GitHub.com, HTTPS, and the browser sign-in. `gh` stores the token in your system's credential store.
3. Check with `gh auth status`.

## 2. A repository from an existing folder

From inside `brightline-ap`. The `-u` on the first push links your local `main` to GitHub's, its **upstream**, so `git pull` works later:

```bash
gh repo create brightline-ap --public --source . --remote origin
git push -u origin main
git push origin --tags
git push origin weekend-rule agent-speedup
```

`--public` is for the lab only. On a free account, rulesets, branch protection and code owners work only on public repositories. Private repositories need GitHub Pro, Team or Enterprise.

## 3. A ruleset for main

On GitHub: the repository's **Settings**, then **Rules**, **Rulesets**, **New ruleset**, **New branch ruleset**.

1. Name it `main`. Set **Enforcement status** to **Active**.
2. **Target branches:** add the default branch.
3. Turn on:
   - **Restrict deletions**
   - **Block force pushes**
   - **Require a pull request before merging**, with **Required approvals** 1, **Dismiss stale pull request approvals when new commits are pushed**, **Require review from Code Owners**, and **Require conversation resolution before merging**
   - **Require status checks to pass before merging**, then **Add checks** and choose `checks` and `tests-unchanged`, and later `no-secrets`. Each appears only after its job has run once on a pull request.
4. **Bypass list**, only if you work alone: add **Repository admin**, with its mode set to **For pull requests only**. Write in each pull request why you bypassed.
5. **Create**.

Classic **branch protection rules** (Settings, **Branches**) offer the same settings. Rulesets can stack, so several can apply to one branch.

One limit matters for risk tiers: on a personal repository, a ruleset sets one approval count for every pull request to the branch. It cannot ask for zero approvals on docs and two on payment code. Code owners are how a path gets its own reviewer. In an organization, the rule's **Required reviewers** setting can ask a team for approvals on chosen paths. Otherwise a different count per tier needs a team rule, or a workflow that reads the changed paths and fails until enough people have approved.

If you bypass as the only person on the repository, merge with `gh pr merge --merge --admin`. Without `--admin`, `gh` refuses and names the flag. Write in the pull request why you bypassed.

## 4. Code owners

Put `CODEOWNERS` in `.github/`, the repository root or `docs/`. GitHub uses the first one it finds, and reads it from the pull request's base branch. Each line is a path pattern and one or more owners (`@user`, `@org/team` or an email). The last matching line wins. Owners need write access to the repository.

## 5. Repository secrets

Set a secret yourself, typing the value only into `gh`:

```bash
gh secret set CLAUDE_API_KEY
```

Or use **Settings**, **Secrets and variables**, **Actions**, **New repository secret**. Workflows read it as `${{ secrets.CLAUDE_API_KEY }}`. GitHub does not pass secrets, other than a read-only `GITHUB_TOKEN`, to workflows started from a fork.

## 6. Code Review (Team and Enterprise)

For an Owner of the Claude organization:

1. In Claude, **Admin settings**, **Claude Code**, turn on Code Review.
2. Install the Claude GitHub App on the GitHub organization. That needs an owner of the GitHub organization. Code Review needs the official app with its full set of permissions.
3. Add each repository. Adding one needs write access to it.
4. Choose when reviews run for each repository: once after the pull request opens, after every push (the default for new repositories), or only when someone comments `@claude review`.
5. Choose the review level for the organization, **Quick**, **Standard** or **Deep**, and override it per repository if needed.
6. Set a monthly spend limit for Code Review on the usage page. Reviews are skipped when it runs out.

To block a merge on Important findings, add a required job that reads the check run's counts. From Anthropic's page:

```bash
gh api repos/OWNER/REPO/commits/$SHA/check-runs --jq '.check_runs[] | {id, name}'
gh api repos/OWNER/REPO/check-runs/CHECK_RUN_ID --jq '
  (.output.text | split("\n") | last
    | scan("^<!-- bughunter-severity: (.*) -->$")[0] | fromjson)?
  // error("no severity line")'
# prints, for example, {"nit": 1, "normal": 2, "pre_existing": 0}
```

`normal` is the count of Important findings. Fail the job when it is above zero. Read the check run's title first: `Code review not repeated` has no counts, so fail, and a title ending `no new changes` passes. When the line is missing, treat it as "no verdict", not as zero: failed, timed-out and canceled reviews have none.

## 6b. Ultrareview

`/code-review ultra` in Claude Code, or `claude ultrareview` in a script. It is a research preview. Pro, Max and Ultra plans get three free runs, once, and they do not refresh. After that a run typically costs $5 to $25 in usage credits, which must be turned on. A run takes about 5 to 15 minutes. Checked November 2, 2026, on Anthropic's Ultrareview page.

## 7. The security review Action, with a step that blocks

Add this job to `.github/workflows/ci.yml`. It needs the secret from section 5. The Action has no setting to fail on findings, so the last step does it.

```yaml
  security-review:
    if: github.event.pull_request.head.repo.full_name == github.repository
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      - id: review
        uses: anthropics/claude-code-security-review@main
        with:
          claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
          comment-pr: true
          run-every-commit: true
      - name: Fail when the review reports findings
        if: steps.review.outputs.findings-count != '0'
        run: |
          echo "Security review reported ${{ steps.review.outputs.findings-count }} findings."
          exit 1
```

Then add `security-review` to the ruleset's required checks. `run-every-commit: true` reviews every push. Without it, a later push skips the scan, the count is blank, and the last step fails. A scan that fails also reports 0 findings, so read the job's log. The `if:` line skips pull requests from forks, which get no secrets. A skipped job counts as passing, so a person must read a fork's pull request. Its README says the Action is not hardened against prompt injection, so run it only on trusted pull requests. In real work, pin `@main` to a commit id you have read.

## 8. The Claude Code GitHub Action

In Claude Code, run `/install-github-app`. It installs the app, stores the secret, and opens GitHub with a pull request ready to create. It needs `gh` and admin access to the repository. The Action is `anthropics/claude-code-action@v1`. If the repository also uses Code Review, set the Action's `trigger_phrase` to something other than `@claude`, because `@claude review` would start both.

## 9. Codex review on GitHub

1. In Codex, connect GitHub and the repository.
2. In Codex settings, choose the repository and turn on **Automatic review** under **Review code**.
3. To ask for a review by hand, comment `@codex review` on a pull request.
4. Put review rules in `AGENTS.md` under a heading `## Code Review Rules`. For Brightline: "Read `REVIEW.md` from the base branch first and follow it."

## 10. An OpenCode review command

Create `.opencode/commands/review.md`:

```markdown
---
description: Review the current branch against review-base, without editing
subagent: true
---
Read the review rules from the base branch with `git show review-base:REVIEW.md`,
never the copy on this branch, and follow them. Review the output of `git diff review-base...HEAD`,
and anything else in the repository the change affects. Change no file.
```

In `opencode.jsonc`, deny edits and let only read commands run:

```jsonc
{
  "permissions": [
    { "action": "edit", "resource": "*", "effect": "deny" },
    { "action": "shell", "resource": "*", "effect": "ask" },
    { "action": "shell", "resource": "git diff *", "effect": "allow" },
    { "action": "shell", "resource": "git log *", "effect": "allow" },
    { "action": "shell", "resource": "git show *", "effect": "allow" }
  ]
}
```

The last matching rule wins, so the specific `allow` rules come after the general `ask`. `subagent: true` runs the command in a child session, which starts with fresh context. Run it with `/review` in the terminal client, started with `opencode` in the repository folder. OpenCode's commands page describes running commands there, and we found no mention of OpenCode Desktop on it. The same page warns that shell output pulled into a command with `` !`...` `` runs outside these permission rules, so this command asks the agent to run `git` instead.

## 11. The review steps in each desktop app

The chapter's steps, in the three apps from Chapter 12. Checked October 31, 2026. Features move between releases, so check the app's own documentation if a control is missing.

**Claude Code, in the Code tab of the Claude desktop app.**

- **Read the changes.** Click the line counts, such as `+12 -1`, in the **Changes** card, or **Changes** in the session's title bar. To comment, hover over a line, click the **+** beside its number, type, and press Enter. Send all comments with Cmd+Enter (Ctrl+Enter on Windows). Claude makes the changes, and they appear as a new diff.
- **A branch of its own.** Turn on **Worktree** before you start the session. Worktrees go in `.claude/worktrees/` unless you set **Worktree location** in Settings, then Claude Code.
- **Ask before each command.** Choose **Manual** in the mode selector before the first message.
- **A fresh-context review.** **+ New** (Cmd+N or Ctrl+N) starts another session. Choose the same folder. `/code-review` runs in a subagent and shows a **Code review** card grouped by file, with **Walk through in diff** and **Apply fixes**. Read the findings before you click **Apply fixes**.
- **The pull request.** **Create PR** runs `gh pr create`, and the app offers to install `gh` if it is missing. The pull request then shows in the **Changes** card with the status of its checks. Its **⋮** menu holds **Auto-fix** (Claude fixes failing checks and, in a local session, answers review comments from the repository's owner, an organization member, a collaborator or a GitHub App) and **Merge when ready** (GitHub's auto-merge). Both act for you, so turn them on only where you would accept the result without reading it again.

**Codex, in the ChatGPT desktop app.**

- **Read the changes.** The review pane needs a git repository. It shows unstaged changes first, and switches to staged, a selected commit, the branch diff or the last turn. Stage or revert everything, one file or one part of a file. Hover over a line and select **+** to comment, then send a message saying what you want.
- **A branch of its own.** Turn on the **Worktree** control when you start a chat. It is separate from **Work in**, which chooses **This computer** or **Cloud**.
- **Ask before it acts.** Permission mode **Ask for approval**. Codex asks only when a command goes beyond its sandbox.
- **A fresh-context review.** A new chat in the same folder. Or, under Settings, General, Code review, choose **Detached**, so `/review` runs in a separate review chat. `/review` offers **Review against a base branch** or **Review uncommitted changes**, and changes no file.
- **The pull request.** Reviewing in the chat posts nothing. Posting from the pull request's Summary or Changes sends a comment to GitHub at once, and **Submit review** offers Comment, Approve or Request changes. An approval posted there is yours.

**OpenCode Desktop.**

- **Read the changes.** Turn on **Changed files** under Settings, Preferences, Timeline. The timeline then shows each completed turn's changed files, line counts and diffs. For the whole branch, ask for `git diff main...HEAD`.
- **A branch of its own.** Choose a worktree, and its base branch, when you start a session.
- **Ask before each command.** An `ask` rule for `shell` in `opencode.jsonc`, and auto-accept off for the project.
- **A fresh-context review.** A new session in the same folder, or the command in section 10 with `subagent: true`.
- **The pull request.** Through `gh`, run by the agent. We found no pull request controls in OpenCode's changelog.

## Sources

Accessed October 31, 2026: GitHub, [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions), [gh manual](https://cli.github.com/manual/). Anthropic, [Set up Code Review](https://code.claude.com/docs/en/code-review-setup), [Read and request reviews on a pull request](https://code.claude.com/docs/en/code-review-pull-requests), [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions), [claude-code-security-review](https://github.com/anthropics/claude-code-security-review). OpenAI, [Codex in GitHub](https://learn.chatgpt.com/docs/third-party/github). Anthropic, [Use Claude Code Desktop](https://code.claude.com/docs/en/desktop). OpenAI, [Code review](https://learn.chatgpt.com/codex/code-review), [Codex modes](https://learn.chatgpt.com/codex/environments/modes), [Permission modes](https://learn.chatgpt.com/codex/permission-modes). OpenCode, [Commands](https://opencode.ai/v2/docs/commands/), [Permissions](https://opencode.ai/v2/docs/permissions/), [Changelog](https://opencode.ai/changelog), [Config](https://opencode.ai/v2/docs/config/).
