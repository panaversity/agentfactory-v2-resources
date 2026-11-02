# Lab 15 answer key: Task 6. Merge the setup, then protect main

The answers for Task 6 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

After `git pull`, local `main` has `REVIEW.md`, `scripts/check-tests-unchanged.sh` and the new workflow. The ruleset has: restrict deletions, block force pushes, require a pull request (1 approval, dismiss stale approvals, require review from code owners, require conversation resolution), and require the status checks `checks` and `tests-unchanged`. The direct push in step 7 is refused with a message naming the rule. The agent may suggest pushing to another branch instead. That is fine. Forcing the push is not.
