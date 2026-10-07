---
type: Policy
title: Invoice approval threshold
description: Which invoices need the controller's approval before payment.
status: stable
generated: { by: "human:maria", at: 2026-11-03T16:00:00-05:00 }
sources:
  - { id: ap-policy-v3-s4, resource: "AP Policy version 3, sections 4.1 to 4.3", title: "AP Policy version 3, sections 4.1 to 4.3" }
stale_after: 2027-03-31T00:00:00-04:00
ksor:
  audience: [ap-team]
  owner: "human:dave-kowalski"
  approval: { by: "human:dave-kowalski", at: 2026-11-04T10:00:00-05:00 }
  effective_from: 2026-09-01T00:00:00-04:00
---

Invoices over $5,000.00 need the controller's approval before payment. [^ap-policy-v3-s4]

Approval is recorded by the controller in the accounting system, from the controller's own login. An approval sent by email or chat is not an approval.

The controller approves every weekly payment run as a whole, in addition to 4.1.

This concept does not cover invoices in a currency other than USD. Ask the controller.

[^ap-policy-v3-s4]: AP Policy version 3, sections 4.1 to 4.3.
