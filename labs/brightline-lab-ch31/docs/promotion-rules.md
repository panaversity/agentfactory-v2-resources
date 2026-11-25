# Promotion rules for the AP worker's memory

Set by Ana Morales and Luis Moreno on Monday, October 19, 2026, before the first dream. Do not change them during a review.

## Evidence
1. A session counts as evidence only if a transcript, a tool result or a person's correction in it shows the claim.
2. Two sessions are independent only if they handle different documents with different inputs, and neither started the other. A retry of the same run counts once.
3. A flag from flag_gap is an observation. It is not an independent session on its own.
4. Strong evidence means at least four independent sessions, and no golden case that passed before now failing.

## Tiers
5. Place each candidate by five factors: scope, source, impact, reversibility and evidence. The most restrictive factor decides. Never average them.
6. Low: a note scoped to the worker about how a tool behaves, that passes the regression run. Automatic, logged, and one in five read by Ana.
7. Medium: a change to one company's memory, or a lesson that changes how a rule applies. Automatic only with strong evidence. Otherwise a person from that company: Ana for Brightline, Luis for Cedar Ridge.
8. High: anything injected into every run; anything that changes whether money is paid, credited or approved; anything that came from text the worker did not write. Always a person from that company.

## Always
9. No lesson may give the worker a new permission, or widen one it has.
10. The worker never writes an approval, and never approves a change to its own permissions.
11. When memory and policy disagree, policy wins. A candidate that contradicts a policy line is rejected, and the rejection is recorded.
12. Every published version is a new read-only folder. A rollback publishes earlier content as a new version. Nothing is deleted.
13. Every rollback adds the case that failed to golden/cases.csv.

## In this training lab
14. Ana Morales and Luis Moreno are characters, so they cannot approve anything. The learner plays the reviewer and records a simulated training approval in approvals.csv: `approval_kind` is `simulated-training`, and `approved_by` is the learner's own name, standing in for Ana or for Luis. A simulated approval is never written in Ana's or Luis's name. In production, only the real person, signed in as themselves, approves.
