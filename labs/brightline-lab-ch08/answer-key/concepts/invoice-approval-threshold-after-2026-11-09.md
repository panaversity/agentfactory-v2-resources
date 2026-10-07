---
type: Policy
title: Invoice approval threshold
description: Which invoices need the controller's approval before payment.
status: stable
generated: { by: "human:maria", at: 2026-11-09T08:30:00-05:00 }
sources:
  - { id: ap-policy-v3-s4, resource: "AP Policy version 3, sections 4.1 to 4.3", title: "AP Policy version 3, sections 4.1 to 4.3" }
  - { id: change-2026-11-09, resource: "Controller's change of November 9, 2026", title: "Invoices in other currencies" }
stale_after: 2027-03-31T00:00:00-04:00
ksor:
  audience: [ap-team]
  owner: "human:dave-kowalski"
  approval: { by: "human:dave-kowalski", at: 2026-11-09T09:00:00-05:00 }
  effective_from: 2026-09-01T00:00:00-04:00
---

Invoices over $5,000.00 need the controller's approval before payment. [^ap-policy-v3-s4]

From November 9, 2026, invoices in any currency other than USD need the controller's approval before payment, whatever the amount. [^change-2026-11-09]

Approval is recorded by the controller in the accounting system, from the controller's own login. An approval sent by email or chat is not an approval.

The controller approves every weekly payment run as a whole, in addition to 4.1.

[^ap-policy-v3-s4]: AP Policy version 3, sections 4.1 to 4.3.
[^change-2026-11-09]: Controller's change of November 9, 2026.

Note for the lab: the file name keeps its date only so the key can hold both versions. In your record, edit `invoice-approval-threshold.md` in place. The record's history, not a new file, keeps the old version. `effective_from` stays September 1, because the $5,000 rule has been in force since then. The new sentence carries its own start date. `generated` (08:30) comes before `approval` (09:00), because Dave approves the text Maria drafted.
