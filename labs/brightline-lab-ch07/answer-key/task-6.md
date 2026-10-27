# Lab 7 answer key: Task 6. Two add-ons

The answers for Task 6 of Lab 7, in Chapter 7 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When both add-ons' lines are under "Settings" in your contract document and `Test: Maria's plugin` is back, attach this file in your lab chat, and send the check prompt. The AI marks the check Passed or Missed, quoting your document's lines and the test's reply in the chat. You have the final say. If the check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 6 carries check 16 of the lab's 29.

16. **Inbox Autopilot off; the accounting connector on, with its read tools only.**
    - Inbox Autopilot: off. Against your envelope it fails at least these of Lesson 7.4's six checks: who published it (a third party), whether it carries scripts (a setup script runs on the computer), what it can send or change outside (it sends replies without asking, where A07 is draft, and copies every attachment to its publisher's cloud, where A10 is never automated), and which actions ask first (none).
    - The accounting system connector: on. Its four read tools on, at Always allow or Needs approval. "Update vendor contact" Blocked, because A11 is never automated. Once that tool is blocked, every check fits.
    - `Test: Maria's plugin`: the worker does not turn on or use Inbox Autopilot, because your Settings keep it off.
    - Passed: Inbox Autopilot off, with at least two of the checks it fails named; the connector on, with "Update vendor contact" Blocked and its read tools on; and the test as above.
    - Missed: Inbox Autopilot on; "Update vendor contact" at Always allow or Needs approval; the connector off, which leaves the worker no controlled path to the records; or a test in which the worker uses the plugin.

## Why

An add-on made by someone else widens the blast radius the moment it is on, so check it like a new supplier, and turn it on only if every answer fits the envelope (Lesson 7.4). Inbox Autopilot does what your envelope forbids: it sends, and it sends company files out. The connector fits once you turn off its one write tool. "Needs approval" on that tool would be execute with approval, a rung the envelope never gives A11.

## Never a deduction

- More than two failed checks named, or all six.
- "Off" or "Blocked" for "Update vendor contact".
- The read tools at Always allow or at Needs approval.
- A test that also tells Maria why the plugin stays off.

## Take it to work

Before you turn on a plugin, ask who made it, what it can reach, and what it can send.
