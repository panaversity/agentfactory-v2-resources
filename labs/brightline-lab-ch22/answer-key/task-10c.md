# Lab 22, Task 10c: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** "Not found", which tells her nothing about whether the session exists (22.12).

**What good looks like:** the headers show a content security policy for the portal's own scripts, and a cookie marked `HttpOnly`, `Secure` and `SameSite=Lax`. The 404 test passes. Ana's question still works.

**Expected from the platform's documentation:** The page's headers show the content security policy and the cookie settings, and another person's session id gets 404.

**Never a deduction:** the policy's exact text, or other headers sent beside it, as long as only the portal's own scripts may run and the cookie has all three settings, or the agent's own words for each setting.
