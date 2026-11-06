# Lab 22, Task 14: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**What good looks like:** one refresh in the sign-in server's log, from the platform, about 6 minutes after the first question. Then a normal second answer. If the second answer fails at the connector instead, read the refresh in the sign-in server's log. Chapter 18's server needs the connector's address, `resource`, on every refresh. Without it, the server returns a token the connector refuses. Record that in `ports/ch22.md`. Whether the platform sends `resource` on a refresh is an open question: F4's `refresh` block has no field for it.

**Never a deduction:** a second answer that fails at the connector because the refresh carried no `resource`, which the page makes a finding to record, not a mistake, or a refresh a little before or after the 6-minute mark.
