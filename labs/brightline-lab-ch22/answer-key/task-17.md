# Lab 22, Task 17: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**What good looks like:** one handled delivery, one skipped as a repeat, one refused. The reconcile job's first run handles nothing new.

**Check before you approve, what you should have found:** a message with a valid signature whose event id was already handled is skipped as a repeat, not handled twice. The receiver's three checks, in order: the signature, with `unwrap()` and the signing secret, which also refuses a message more than five minutes old; the event id, skipped if it is already in `webhook_events`; and the reconciliation, the hourly job that lists the last two hours of sessions and handles any it has not seen.

**Never a deduction:** a reconcile run that handles nothing new, which is the expected result, or the exact words of the refusal for the changed body.
