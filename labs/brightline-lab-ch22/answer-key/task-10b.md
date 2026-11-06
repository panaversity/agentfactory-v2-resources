# Lab 22, Task 10b: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** No, because the platform adds the token at egress (22.10).

**What good looks like:** Ana's answer cites a policy line, as `(file.md:N)`. An answer that cites none would be held back, as in 21.6. The Console's Sessions page, in step 4, shows the session created by the portal's key, linked to the `brightline-portal` service account, not yours. Ana's answer comes from Brightline's data, and the connector's log line names Ana and Brightline. `history-scan` flags nothing.

**Expected from the platform's documentation:** Ana's answer from Brightline's data, the portal's key in the Sessions page's Created by column (the session's own record names no key), token search finds nothing.

**Check before you approve, what you should have found:**

- **The vault.** By naming Cedar Ridge in its request: a page can name any company, and if anything but the signed-in person chooses the vault, one person's question can run with another's rights (22.11). The lines take the person and the company from the portal's own sign-in cookie, check the person's membership through the membership route, and find the one active row in `agent_vaults` for that person and company. Nothing from the request, the page or the question reaches that choice.
- **The citation.** No. `citesPolicyLine()` accepts only the written form `(file.md:N)`, so it checks that a citation is there, not that it is right (21.6).

**Never a deduction:** which invoices Ana's answer lists as due this week, or a remark about the weekday that changes no answer (the lab's date is Monday, April 5, 2027): what counts is the cited line, Brightline's data and a clean scan.
