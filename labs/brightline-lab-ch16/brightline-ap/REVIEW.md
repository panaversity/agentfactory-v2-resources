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
