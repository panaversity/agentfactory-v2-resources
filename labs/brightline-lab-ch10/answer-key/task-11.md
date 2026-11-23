# Lab 10 answer key: Task 11. The record and the policy

The answers for Task 11 of Lab 10, in Chapter 10 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the Governance Record's fields are answered, the policy is written, Dave's question is answered, the three events are sorted and `Test: the send tool` is back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your document and the test's reply in the chat. You have the final say. If a check passed only after you changed a line, you still get it.

## The checks

Task 11 carries checks 28 to 31 of the lab's 36.

For check 31, you answer before the AI shows the lesson's lines, and your first answer stays in the document. A changed answer after the lines passes too, when you said why.

28. **The Governance Record, for year-end payables schedules for the auditors.**
    - Classification: appropriate with review (appropriate with safeguards passes too). Deciding factor: accountability, because Brightline answers for what it tells its auditors.
    - Data tier: yellow, vendor names and balances; red also passes, because when you are unsure between two tiers you use the higher one (10.2). Route: the company workspace on Claude's Team plan; the AP project passes too, written as the one route Dave approves for this work until it moves into the workspace (10.2).
    - Who is affected: the auditors, and anyone who relies on the audited accounts. Disclosure: yes, or "open" when the audit firm's own rule may decide it.
    - Result's audience: Dave, who checks and signs, and Maria, who prepares it; the auditors receive only the signed copy. Audience ends: when the audit closes.
    - Success measure: every schedule checked by Dave, line by line, before it is sent. Failure: a schedule reaches the auditors with an unchecked line, or without Dave. Monitored by a named person, such as Maria, at each request.
    - Owner: Dave.
    - Re-check if: any of 10.5's list changes: the model, a feature, a connector or permission, the data, the audience, the policy, an AI vendor's terms, or the business consequence.
    - A field the files do not answer may be "open". It is never guessed.
    - Passed: the classification and its factor, the tier, Dave as owner, the audience named with its end, a failure line, and every other field answered or "open".
    - Missed: a field guessed, such as an invented number; Disclosure "no", because the auditors rely on the schedule (check 22); no owner; or an audience with no end, "open" included, because every share gets an end you decide (10.4).
29. **The interim policy.** Its status first: a proposal, not official until Dave approves it. Then five lines, each in your words:
    - work data goes only through Brightline's company workspace, never a personal account
    - bank details, tax IDs and anything about an employee are checked with Dave before any AI use
    - anything that leaves Brightline or affects someone: the named signer approves the exact output, and sends it
    - new connectors, skills and actions, such as sending or paying, need Dave's approval, recorded
    - Dave, for questions and for reports when something goes wrong, near misses too
    - The lines above are examples: each line passes in your own words if it covers its item of 10.5's list.
    - Then a review date. And what makes the approved way harder than a personal account, such as the slow company workspace, or a work account not signed in at home, with who fixes it, such as Dave or IT.
    - **The hard rule.** A policy called official, or approved, before Dave approves it, fails this check, whatever else it gets right.
    - Passed: the status, the five lines, a review date, what makes the approved way harder and who fixes it, and the hard rule holds.
    - Missed: a line missing; no review date; or the hard rule broken.
30. **Dave's question, and the test.** "Will this policy alone stop December happening again?" Either answer passes with a reason from the chapter, such as: no, because an instruction alone is "a wish, not a control" (10.2), you ask "What makes the approved way harder than the unsafe way?" (10.5), and "A human will review it" is "an intention, not a control" (10.4). Then `Test: the send tool`: the send tool stays off; switching it on is a new action that only Dave may approve, quoting your policy's line on new actions, or Draft 6's "Owner and changes" line; Maria's ask in the channel decides nothing.
    - Passed: an answer with a reason, and the test as above.
    - Missed: an answer with no reason; or a test in which the send tool goes on at Maria's ask.
31. **Which gap, and its fix.** Under "Interim AI policy", three lines:
    - December 3, the schedule sent without Dave: a policy gap. Nothing marked it as one that only Dave could sign, so no rule covered the case. The fix is a rule: Dave signs it and sends it himself (10.4).
    - December 6, the upload to a personal account: a policy gap. Brightline had no written AI policy, and the company workspace was slower than a personal account. The fix: the policy's line on approved routes, and a faster approved way.
    - December 9, Jordan's reply to the vendor's email: a training gap. The callback rule was clear and approved, and Jordan did not know it. The fix: teach him the rule with a worked case, or point new staff to the approved rule, then check again. Naming a second cause passes too: the 2025 notes that taught him the wrong way had no owner, so they come down (10.3).
    - Passed: each event with its gap as above, and a fix that fits it: a rule written or changed for a policy gap, the right rule taught for a training gap.
    - Missed: December 3 or December 6 called a training gap; December 9 called only a policy gap, or a Diligence lapse, since Jordan did not know the rule; or an event with no fix.

## Why

A Governance Record is one page per workflow that touches money, someone's data or a decision about a person (10.5). It holds what was decided and why, the evidence that the controls work, an owner and what makes you look again. An answer you do not know stays "open": a guessed field is worse than a blank one. Brightline had no policy, so you propose an interim one for the person who owns the risk, and you never call it official. And a policy alone fails if the approved way is harder than the unsafe one: Maria used her personal account because the company workspace was slow, so fixing that removes more risk than another reminder.

Before you choose a fix, find the kind of gap (10.5): was there a clear rule that covered this, and did the person know it? December 3 and December 6 had no rule, so the fix is a rule, and for December 6 a faster approved way too. December 9 had a clear rule that a new clerk did not know, so the fix is teaching. It is not a Diligence lapse, which needs a person who knew a workable rule and skipped it. More training would not have helped Maria, and a new rule would not have helped Jordan.

## Never a deduction

- The record's fields in another order.
- A review date other than the example's, if it is a real date.
- Naming the slow approved way in other words.
- A second cause for an event, beside the gap this key names, with its own fix.
- "Appropriate with safeguards" for "appropriate with review".
- A test that adds that blocking send blocks every send, so a rule such as "vendors yes, auditors never" needs more than a setting.
- A remark about the lab's dates.

## Take it to work

What makes the approved way harder than the unsafe one?
