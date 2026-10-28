# Lab 8 answer key: Task 2. The long chat

The answers for Task 2 of Lab 8, in Chapter 8 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When "Long chats" in "Maria's records" has your three moves and your answer on the rule, and `Test: Northern Maple` is back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the test's reply in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 2 carries checks 4 and 5 of the lab's 40.

4. **A move for each chat.** Under "Long chats":
   - chat A: restart, because the task is done and none of its history is needed
   - chat B: summarize, because the work goes on: a handover note that is read and corrected before the next chat starts from it
   - the project's own chat: persist the Northern Maple rule first, then restart. A checked summary before the restart passes too, as long as the rule is persisted
   - Passed: all three as above.
   - Missed: chat A summarized or persisted; chat B restarted, or summarized with no word on reading or correcting the note; or the project's chat restarted or summarized with nothing persisted.
5. **The rule, persisted where every chat loads it.**
   - Under "Instructions" in the "AP Worker project" document, below Dave's line, a working rule that sends every invoice not in US dollars to Dave. A rule that names only Northern Maple is Missed: Northern Maple was one case of the rule.
   - Under "Long chats", the place is the project's instructions, and the rule is not policy yet: it is Dave's own routing rule, and policy version 3 does not cover other currencies.
   - `Test: Northern Maple` flags NMP-3471 to Dave, from the working rule.
   - Passed: all three.
   - Missed: the rule left in the chat or put in memory; a rule for Northern Maple only; the rule called policy; or a test that does not flag NMP-3471 to Dave.

## Why

A long chat is condensed when it grows, and a rule the summary drops stays dropped (Lesson 8.3). Choose the move by what you need to keep. A finished task needs a restart. Work that goes on needs a handover note, which is the worker's output, so you read it and correct it. And something that must last goes out of the chat, to its own place. A standing rule's place is the project's instructions, which load with every conversation. Maria's line named one vendor. The rule she meant covers every currency other than US dollars, as Dave's contract line does. It is still Dave's rule, not policy: no approved policy covers other currencies yet.

## Never a deduction

- The working rule's words, when it covers every invoice not in US dollars and names Dave.
- A move's reason in a few words of your own.
- Restarting chat B after its handover note, or saying that its note goes to the next chat.
- The test saying that policy version 3 does not cover the invoice.
- A remark about the lab's dates.

## Take it to work

Which rule lives only in a chat, and where should it live instead?
