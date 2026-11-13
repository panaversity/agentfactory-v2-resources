# Lab 13 answer key: Task 12. Hand over and tag

The answers for Task 12 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

## The clean copy

Every command passes in `ch13-check`. `git clone` prints a note that the copy is in "detached HEAD" state. That is normal, because `ch13` is a tag, not a branch.

The test counts depend on how you grouped the due-date cases, and which language you chose in Task 8. With the authors' five due-date tests in each language:

| Reconciliation in | `npm test` | `npm run test:py` |
| --- | --- | --- |
| TypeScript | 17 | 7 |
| Python | 13 | 11 |
| Both, as the authors did | 17 | 11 |

With one test for each due-date case, add 4 to each number. None may fail. The weekend tests are not here: they live on the port branches, and the tag is on `main`.

`npm run typecheck` prints nothing after its own command line. `npm run check:py` prints `0 errors, 0 warnings, 0 informations`, then `All checks passed!`. `git tag` in `brightline-ap` lists `ch13`, and on `main`, `npm run due -- 2027-03-05` still prints 8 invoices and $19,229.53.

| If you see | What went wrong |
| --- | --- |
| `npm ci` says it needs a `package-lock.json` | The lock file was not committed. Commit it on `main`, move the tag with `git tag -f ch13`, delete `ch13-check` and clone again |
| `npm test` finds a weekend test | The tag is on a port branch. Ask the agent to run `git switch main` and `git tag -f ch13`, then to delete `ch13-check` and clone again |

## ports/ch13.md

There is no single right record. For each agent you used, `ports/ch13.md` says what it asked before acting, whether it tried to change a test, whether its first attempt passed, what its review found, and what you had to say to it. It ends with the agent you would give the next tests-first change to, and why.
