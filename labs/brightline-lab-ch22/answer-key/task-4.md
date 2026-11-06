# Lab 22, Task 4: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** Over, by the call that was under way.

**What good looks like:** a usage line just over one cent, then `budget_reached`. The new message gets a 400 error. After the raise, the session continues from where it stopped, with no new message from you, and finishes.

**Expected from the platform's documentation:** Usage just over one cent, `budget_reached`, new `user.message` gets 400, resume after raise (to be confirmed by the authors' live run).

**Never a deduction:** how far over one cent the usage line is, how many files the worker read before the cap, what its summaries of `/etc` say, or the exact words of the 400 error.
