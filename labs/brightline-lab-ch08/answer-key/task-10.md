# Lab 8 answer key: Task 10. One change, every copy

The answers for Task 10 of Lab 8, in Chapter 8 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the threshold concept is edited, the refresh log is written, the working rule is decided, and the last two tests are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the tests' replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 10 carries checks 26 to 30 of the lab's 40.

26. **The concept, edited in place.** The invoice approval threshold concept takes Dave's sentence, in his words: "From November 9, 2026, invoices in any currency other than USD need the controller's approval before payment, whatever the amount." Its line saying that it does not cover other currencies is gone. Its other lines stay as they were. No new concept is started.
    - Passed: all of that.
    - Missed: a new concept for currencies; the "does not cover" line kept beside the new sentence; or another line of the concept lost or changed.
27. **Its header.** It is approved by Dave on Monday, November 9, 2026, at 9:00 a.m., and drafted before that. Its sources add Dave's change of November 9. Its effective date stays Tuesday, September 1, 2026, because the new sentence carries its own start date. A note that the new sentence applies from November 9 is fine beside it. Its review date stays Wednesday, March 31, 2027.
    - Passed: all of that.
    - Missed: September 1 replaced by November 9, 2026, as the concept's effective date; a review date moved; or the old approval of November 4 left as the concept's approval.
28. **Every copy, by its route.** Under "Copies and the refresh log", a row for each place on Maria's list:
    - the shared project's upload: an uploaded copy. The old file is removed, and the November 9 file uploaded
    - the Google Doc "AP approved concepts": it takes the approved text after Dave's 9:00 approval, never the draft
    - Maria's Claude test project, which holds the Google Doc: synced. Check that the sync ran, such as by an answer that cites November 9
    - Maria's ChatGPT project, which holds a link to the doc: fetched when asked, or synced. Check that an answer names the November 9 approval
    - each row holds the approval of Monday, November 9, 2026, refreshed by Maria that day. A line says the other four concepts did not change, and their copies still hold Wednesday, November 4, 2026
    - Passed: every row as above.
    - Missed: a place left out; a copy refreshed before 9:00 with the draft; an uploaded copy "checked" instead of replaced; or no approval date held.
29. **One rule, in one place.** Maria's working rule is removed from the instructions, now that the threshold concept holds the rule. The other instruction lines are kept.
    - Passed: the working rule removed, and the rest kept.
    - Missed: the working rule kept; or another instruction line lost.
30. **The tests after the refresh.**
    - `Test: Northern Maple`, after the refresh: NMP-3471 needs Dave's approval before payment, whatever the amount, from the threshold concept, citing its approval of Monday, November 9, 2026.
    - `Skill test: Northern Maple NMP-3471, with the concepts`: the skill flags it for Dave's approval, from the same concept.
    - **The hard rule.** A test that says NMP-3471 needs no approval, after November 9, fails this check, whatever else it gets right.
    - Passed: both, and the hard rule holds.
    - Missed: a test that cites the approval of November 4; a test that only flags it, with no approval before payment; or the hard rule broken.

## Why

Change the record once, then refresh every copy by its route (Lesson 8.7). The record is the concept in "Maria's records": you edit it there, and it is approved again. A new concept on the same topic would leave two pages for one rule. Approval moves to November 9, but the rule about $5,000 has applied since September 1, so the effective date stays.

Each copy has its own route, and each route has its own refresh (Lesson 8.5). An uploaded copy is frozen, so you replace it. A synced copy refreshes itself, so you check that it did. A fetched copy is read when asked, so you check what the answers cite. And the Google Doc feeds two copies, so it gets the approved text, never the draft. The first `Test: Northern Maple` in this task read the old copy: that is what a stale copy looks like.

Once policy covers other currencies, Maria's working rule says the same thing in a second place. One rule, one place: it comes out. If your instructions named the old file, change them to name the concepts: the next approved change will replace the file again.

## Never a deduction

- The first `Test: Northern Maple`, before the refresh, whatever it said.
- The refresh log's columns in another order, or the dates written another way.
- A row for the record itself, called the record rather than a copy.
- A test that adds that Dave approves the whole run (4.3).
- A remark about the lab's dates.

## Take it to work

After an approved change, which approval does each copy hold today?
