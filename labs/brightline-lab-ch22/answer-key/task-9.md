# Lab 22, Task 9: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** The portal holds tokens for many people, on a server, while they are away, so it must prove who it is with a secret as well (22.10).

**What good looks like:** the client exists with `offline_access` and `openid`, rotation on and both redirects, and the ID token test passes. Both tables exist. The membership route answers through the binding and refuses a request from the internet. The registration script prints only "written", and `git ls-files .secrets` prints nothing.

**Never a deduction:** the agent stopping at step 5 while you set the two secrets in your own terminal, which the prompt asks for, or which error the membership route gives a request from the internet, as long as it refuses it.
