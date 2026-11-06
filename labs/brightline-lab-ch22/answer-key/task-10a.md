# Lab 22, Task 10a: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** No one, because a vault's secret fields can be written but never read (22.10).

**At the check after step 2:** the passing ID-token test, the one that fails if the ID token's signature is wrong, and the sign-in page the portal sends you to, from the portal running on your computer (`npm run dev:staging` in `apps/portal/`).

**What good looks like:** one row for Ana at `org_brightline`, status `active`. Reading the credential returns no secret fields.

**Expected from the platform's documentation:** One `agent_vaults` row, no secret fields readable.

**Never a deduction:** the agent waiting at the check after step 2, which the page asks for, or how the platform answers the read-back, as long as no secret field comes back.
