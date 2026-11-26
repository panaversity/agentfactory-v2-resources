# Lab 23, Task 10b: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 23 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 21 and 22's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** No, because the platform's own servers add the token when they call the connector (23.10).

**What good looks like:** Ana's answer says that no open invoice is due this week, April 5 to 11. Ten are already past due, $24,927.63 in all, and four have no due date (INV-8305, INV-8308, INV-8310 and INV-8314). It comes from Brightline's data, and the connector's log line names Ana and Brightline. The portal shows it, under the label if it cites no policy line. The Console's Sessions page, in step 4, shows the session created by the portal's key, linked to the `brightline-portal` service account, not yours. `history-scan` flags nothing.

**Expected from the platform's documentation:** Ana's answer from Brightline's data, the portal's key in the Sessions page's Created by column, token search finds nothing.

**Expected from the data:** in `data/invoices.csv`, Brightline has 16 open invoices. On Monday, April 5, 2027, none is due from April 5 to 11 (the next, INV-8317, is due April 19). Ten are past due, 2,492,763 cents, and four have no due date.

**Check before you approve, what you should have found:**

- **The vault.** By naming Cedar Ridge in its request: a page can name any company, and if anything but the signed-in person chooses the vault, one person's question can run with another's rights (23.11). The lines take the person and the company from the portal's own sign-in cookie, check the person's membership through the membership route, and find the one active row in `agent_vaults` for that person and company. Nothing from the request, the page or the question reaches that choice.
- **The citation.** No. `citesPolicyLine()` accepts only the written form `(file.md:N)`, with or without the file's folder, such as `(docs/policies/po-matching.md:6)`, so it checks that a citation is there, not that it is right (22.6).

**Never a deduction:** the answer's own words, whether it lists the past-due invoices one by one, whether it cites a policy line (a due-date answer may cite none, and then the portal shows it under the label), or signing Ana in again after `mcp_authentication_failed_error`, as the page says. What counts is the date, Brightline's data and a clean scan.
