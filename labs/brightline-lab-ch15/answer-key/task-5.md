# Lab 15 answer key: Task 5. The rules files and code owners

The answers for Task 5 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your `REVIEW.md` passes if it has all six of these points. Reference copies of all three files are at the end of this key.

1. What failure means here, in Brightline's terms: money, dates, rules, secrets and tests.
2. A limit on nits, and no formatting comments.
3. Paths to skip, at least the lock files.
4. A file and line, and a breaking input, for every finding.
5. A count first, and "No issues found." when there are none.
6. The three risk tiers, set by what a change touches, with an agent's approval never counting, and a line on how GitHub enforces them here (one approval for all of `main`, code owners for the high paths).

Your `CODEOWNERS` should list the high-tier paths only, plus the check scripts, `package.json`, `tsconfig.json` and `py/pyproject.toml`. A `*` line would make every file owned, so every change would wait for the owner, and the low tier would disappear.

## Reference `REVIEW.md`

```markdown
# Review rules for brightline-ap

These rules are for every reviewer of a pull request here, person or agent. They are read from `main`, so a pull request cannot change the rules it is judged by.

## What failure means here
- **Money.** A total, count or amount that differs from what the tests and the AP team expect. Money is whole cents. A floating-point amount is a bug.
- **Dates.** A due date that does not come from `src/due-date.ts` or `py/brightline_ap/due_date.py`. Dates are ISO `YYYY-MM-DD`, in UTC.
- **Rules.** A policy change, such as when a weekend due date is paid, that is not behind a flag or not approved by AP.
- **Secrets.** A key, token or `.env` value read, printed, logged or committed.
- **Tests.** An existing test changed to make code pass. Tests in `tests/` and `py/tests/` change only with a stated reason.

## How to report
- Start with the number of findings. If there are none, say "No issues found." and stop.
- Every finding names a file and a line, and says what input would make it go wrong.
- Important means it would pay the wrong amount, on the wrong day, leak a key, or weaken a test. Fix before merging.
- Report at most three nits. Never report formatting. The type checkers and Ruff enforce style.
- Mark a bug that was already on `main` as pre-existing.

## Skip
- `package-lock.json`, `py/uv.lock`, `out/`, `exercises/`.

## Risk tiers
The change sets the tier, not who or what wrote it. An agent's approval never counts as a person's.

| Tier | What the change touches | Human approvals |
| --- | --- | --- |
| Low | `README.md`, `NOTES.md`, `ports/`, `changes/`, `exercises/` | None once every required check is green |
| Medium | `src/`, `py/brightline_ap/`, `scripts/`, new tests | One |
| High | Due dates, the due list, money formatting, `data/`, `.github/`, `CODEOWNERS`, `REVIEW.md`, the check scripts, the test and type-check settings, `.env.example`, any change to an existing test, any policy flag turned on | Two, one of them a code owner |

How GitHub enforces this here: a ruleset sets one approval count for all of `main`, so every pull request needs one approval. `.github/CODEOWNERS` adds the owner for every high-tier path. The second approval on high-tier changes is this team's rule, checked by the code owner before approving.
```

## Reference `.github/pull_request_template.md`

```markdown
## What and why
<!-- One or two sentences. Link the change brief in changes/ if there is one. -->

## How it was tested
<!-- Commands you ran and what they printed. Paste the numbers, not "tests pass". -->

## Risk
<!-- Low, medium or high, from REVIEW.md. What could go wrong, and for whom? -->

## How to undo it
<!-- Revert the pull request? Turn off a flag? Anything that cannot be undone? -->

## Who directed the agent
<!-- The person who ran the agent owns this change and answers the review. -->
```

## Reference `.github/CODEOWNERS`

```text
# The high-tier paths from REVIEW.md, and their owner.
# Replace @your-github-name with your own GitHub user name.
# The last matching line wins. Paths not listed here have no owner, so no owner review.
/.github/                      @your-github-name
/REVIEW.md                     @your-github-name
/AGENTS.md                     @your-github-name
/data/                         @your-github-name
/.env.example                  @your-github-name
/src/due-date.ts               @your-github-name
/src/due-by-friday.ts          @your-github-name
/src/money.ts                  @your-github-name
/py/brightline_ap/due_date.py  @your-github-name
/tests/                        @your-github-name
/py/tests/                     @your-github-name
# The checks themselves, and the files that decide how tests run
/scripts/check-*.sh            @your-github-name
/package.json                  @your-github-name
/tsconfig.json                 @your-github-name
/py/pyproject.toml             @your-github-name
```
