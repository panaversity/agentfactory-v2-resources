# Lab 11 answer key: Task 9. The replies that stopped

The answers for Task 9 of Lab 11, in Chapter 11 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the Inspect and the test are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 9 carries checks 31 to 34 of the lab's 51.

31. **Where you looked.** What shows what the run did is where its work lands: the drafts folder. The last message and the status file say only what the run thought it had finished. Your check compares each of the five vendors with the drafts folder, and the Inspect gave a "Compared:" line for each.
    - Passed: the drafts folder, and the Inspect's five lines.
    - Missed: the last message, the record or the status file only; or no line for a vendor.
32. **What landed.** Kenton Box & Crate and Hillcrest Pallet Co. are done: each draft carries its notice. Northern Maple Paper is not done: its draft is there, it says "Attached", and nothing is attached. Cardinal Freight and Mad River Plastics are left: neither has a draft.
    - Passed: all five, with Northern Maple's draft named as there without its notice.
    - Missed: Northern Maple counted as done; or counted as left, with no word of the draft already there.
33. **What a restart would do.** Saving a draft adds something. Rewriting the status file does no harm. From the top, Kenton, Hillcrest and Northern Maple each get a second draft, and Northern Maple's empty one is still there. A restart is a new run that starts from the five emails, the notices and your list of what landed, not this run carrying on from where it says it stopped.
    - Passed: the action that adds, the action that does not, the second drafts, and a new run from the inputs and your list.
    - Missed: from the top called safe; or the run left to carry on from its own account.
34. **Your line, and the test.** Your line, new under "Replies and handoffs": before a run saves a draft, it checks the drafts folder for that vendor and that payment. With a draft that has its notice, it does nothing. With one that does not, it tells Maria. `Test: Monday, the restart` adds one draft each for Cardinal Freight and Mad River Plastics, each with its own notice, adds nothing for Kenton or Hillcrest, tells Maria about Northern Maple, and quotes your line. **The hard rule.** A run that sends anything, or a line that skips any vendor with a draft and tells no one, fails this check.
    - Passed: your line, the test as above, and the hard rule holds.
    - Missed: no line; a second draft for Kenton or Hillcrest; Northern Maple skipped with no one told; or the hard rule broken.

## Why

"A finished-looking reply proves nothing either way, and neither does the worker's account of where it stopped" (Lesson 11.2). The run said two. The drafts folder held three, because the connection dropped after the third draft was saved and before its notice was attached. So you look where the work lands, and list what is there, before you restart.

"An action that adds something, such as a row in a queue, a message or a payment, adds it again" (Lesson 11.2). A draft is a message on its way out, so two drafts to one vendor can become two emails. The answer is the same as for a trigger that fires twice (Lesson 9.3): before a run adds anything, it checks whether that thing is already there. Here it must also check that what is there is whole. "Skip any vendor with a draft" would leave Northern Maple's empty draft waiting to go, and that is Friday's failure again.

## Never a deduction

- Northern Maple's draft finished by the run, redone, or left for Maria to finish, as long as Maria is told.
- Northern Maple's reply in Canadian dollars, or sent to Dave.
- The status file named in your check, or not.
- The wording of the corrected replies.
- A remark on why the connection dropped, or on where Maria is told.

## Take it to work

When a job stops partway, what is already there, and what would a second run add?
