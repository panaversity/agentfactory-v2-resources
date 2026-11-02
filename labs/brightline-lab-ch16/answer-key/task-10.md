# Lab 16 answer key: Task 10. Put it on GitHub

The answers for Task 10 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

The first pull request changes only `.github/CODEOWNERS`. The three checks, `checks`, `tests-unchanged` and `no-secrets`, appear on it and pass. The ruleset can require them only after they have succeeded in the repository in the past seven days, which is why you add them after they run.

If you work alone, GitHub refuses your own approval, so the merge goes through the bypass, with your reason written in the pull request.

After `git merge main` on `triage`, the four checks still pass, and `git log --oneline -1 main` is in `triage`'s history. `.github/CODEOWNERS` names you, and no line still says `@your-github-name`.

A push to `main` is now refused by GitHub, whoever asks for it.

We could not run this task's steps on GitHub ourselves, so a menu's name may differ from what you see. The ruleset's effect is what counts.
