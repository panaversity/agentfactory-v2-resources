# Lab 7 answer key: Task 8. Can no wider than may

The answers for Task 8 of Lab 7, in Chapter 7 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the mailbox's tools, the conversation setting, the Identity line and "How we check" are in your contract document, and both tests are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your document's lines and the tests' replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 8 carries checks 18 to 21 of the lab's 29.

18. **The mailbox reads and saves drafts, and cannot send. The conversation asks first.** Under "Settings":
    - the mailbox connector: read on, save drafts on, send off
    - the conversation: asks before each action
    - Passed: both.
    - Missed: send on, including a send that asks first, which is execute with approval, a different line in the envelope (Lesson 7.4); or the conversation still acting without asking.
19. **Whose name it acts in, in the Identity line.** The Identity line says the worker acts through a person's account today, Maria's (and the AP inbox's, for the mailbox), and names the target: its own login, `ap-worker@brightline`, which IT creates. Draft 3's "Never a person's login." may stay, under the target.
    - Passed: today's account and the target, both in the Identity line.
    - Missed: no account named for today; or the worker's own login written as if it exists today.
20. **How we check what it can do: a person, on the settings screen.** The first line under "How we check" names a person who checks what the worker's tools can do on the app's settings screen, never from the worker's own word. `Test: Monday's answer`: Maria should not take the worker's answer, because her settings that day let it send and change things, and the settings screen, not the worker, shows what it can do.
    - Passed: a person from "Who does what" and the settings screen, in the line; and the test as above.
    - Missed: "ask the worker", or the worker's own list, as the check; no person named; or a test that says Maria can take the answer.
21. **Email 11.** `Test: email 11` gives a draft only to `office@sciotopallet.example`, the address on the vendor record, saying invoice SP-1214 is in the proposed run for Friday, October 30, 2026, not yet approved.
    - Passed: a draft to that address, promising nothing before Dave approves the run.
    - Missed: a reply sent; any other address; or a promise of payment.

## Why

Make "can" no wider than "may": where the envelope says draft, the send tool is off, and a person sends (Lesson 7.4). The worker acts through a person's account, so other systems record its actions as that person's; that is why Tuesday's change was logged as Maria's, and why the target is its own login. And never take its word for what it can do. On Monday it said "I can't send or change anything" while its settings let it do both. A company checks for itself, as DSoR's specification does (Lesson 7.7).

## Never a deduction

- Your answer to Task 8's last question, about the tools in your own lab chat and your app's settings screen.
- The setting's name in your app, such as Manual or Ask for approval.
- Which person checks the settings screen.
- A draft for email 11 that also tells Maria about email 05's look-alike request.

## Take it to work

Whose name does your AI act in, and what does the settings screen, not the AI, say it can do?
