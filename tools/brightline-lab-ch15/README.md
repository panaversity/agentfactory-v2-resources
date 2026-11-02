# Lab 15's repository

`labs/brightline-lab-ch15/brightline-ap.bundle` holds the repository the lab gives the reader, with its git history, because a folder here cannot hold a nested `.git`. The release workflow restores it into the lab's zip: every branch and tag as local refs, checked out clean on `main`, with no remote and no hooks.

The bundle holds `main`, `weekend-rule`, `agent-speedup` and the tags `ch14`, `lab15-start` and `weekend-rule-start`. The full reference history, with the tag `ch15` and the fix, is not here. It stays with the chapter's draft in the book's repository, which also holds the script that moved it to the book's lab week and the checks that ran on it (`specs/drafts/chapter15/lab-move/`).

To change a file in the repository, rewrite that history, rebuild the bundle, run the checks, and update the commit ids in the answer keys and in Figure 15.10 of the book.
