---
type: Policy
title: Weekly payment run and due dates
description: When an invoice is due and which Friday run pays it.
status: stable
generated: { by: "human:maria", at: 2026-11-03T16:00:00-05:00 }
sources:
  - { id: ap-policy-v3-s2-s3, resource: "AP Policy version 3, sections 2 and 3", title: "AP Policy version 3, sections 2 and 3" }
stale_after: 2027-03-31T00:00:00-04:00
ksor:
  audience: [ap-team]
  owner: "human:dave-kowalski"
  approval: { by: "human:dave-kowalski", at: 2026-11-04T10:00:00-05:00 }
  effective_from: 2026-09-28T00:00:00-04:00
---

Brightline pays vendors in one run each Friday. [^ap-policy-v3-s2-s3]

An invoice's due date is its invoice date plus the vendor's terms from the vendor record. The vendor record is the authority on terms. Terms printed on an invoice do not override it.

Each run pays every invoice whose due date falls on or before the date of the next run, seven days later. Invoices already past due are paid in the next run.

This concept does not cover paying outside the weekly run. Ask the controller.

[^ap-policy-v3-s2-s3]: AP Policy version 3, sections 2 and 3.
