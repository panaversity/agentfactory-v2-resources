# Lab 22, Task 15: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** Storing the token shows three successes. Not storing it fails on the second refresh, because rotation made the first refresh token stop working.

**What good looks like:** one of the two branches below, recorded in `ports/ch22.md`, and a `valid` vault before Task 16. The rotation script's dry run prints the number of active credentials it would update (two, Ana's and Luis's) and changes nothing.

- **If every refresh succeeds** and the check says `valid`: the platform stores the rotated token. Record that, and go on to Task 16.
- **If a refresh fails because a used refresh token came back,** and the check says `invalid`: the platform does not store it, and the second refresh is usually the one that fails. Record which refresh failed. Do not build F4's fallback in this lab. Sign in again as Ana, which repairs her credential, and check that `vault:check` says `valid` before Task 16, because Tasks 17 and 18 need her vault.

**Expected from the platform's documentation:** the documents leave this question open (22.14), so either branch is the expected result. Either every refresh succeeds and `vault:check` says `valid`, or a refresh fails because a used refresh token came back, usually the second, and the check says `invalid`, then `valid` once Ana has signed in again. No fallback is built in this lab. The dry run counts two active credentials and changes nothing (to be confirmed by the authors' live run, which answers 22.14's open question).

**Never a deduction:** either branch, since this task answers an open question, a failure on a refresh other than the second once you record which, or no fallback, which the page says not to build.
