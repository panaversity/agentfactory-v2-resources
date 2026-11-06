# Lab 22, Task 18: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** The model cannot see what it missed, so the portal checks the report against the tool results the platform recorded, with code.

**What good looks like:** the four check tests pass. The plan creates one deployment. The first run's report is posted after zero, one or two rounds, for under $0.50 in all. It has the line saying it was made with Ana's access. The second is recorded as a repeat. The deployment shows as paused, so it does not spend money every weekday after the lab.

**Expected from the platform's documentation:** Four check tests pass (missing invoice, invented citation, wrong total, passing). First run's report posted after zero to two check rounds, under $0.50 in all. Second recorded as a repeat. Deployment paused (to be confirmed by the authors' live run).

**Check before you approve, what you should have found:** the check fails that report, because a citation id that `search_policy` did not return in that session is one of its failures. Its two comparisons with the session's own tool results: every invoice `list_open_invoices` returned has exactly one decision, and every citation id was one `search_policy` returned in that session (22.16). The total, added up by the code from the tool results, is a third check.

**Never a deduction:** zero, one or two check rounds before the report is posted, since the page lists all three, or the decision the report gives each invoice, which this key does not list.
