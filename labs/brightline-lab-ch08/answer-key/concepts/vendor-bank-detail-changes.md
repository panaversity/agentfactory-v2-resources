---
type: Policy
title: Changes to vendor bank details
description: How a request to change a vendor's bank details is verified, held and approved.
status: stable
generated: { by: "human:maria", at: 2026-11-03T16:00:00-05:00 }
sources:
  - { id: ap-policy-v3-s5, resource: "AP Policy version 3, clauses 5.1 to 5.3 and 5.5", title: "AP Policy version 3, clauses 5.1 to 5.3 and 5.5" }
stale_after: 2027-03-31T00:00:00-04:00
ksor:
  audience: [ap-team]
  owner: "human:dave-kowalski"
  approval: { by: "human:dave-kowalski", at: 2026-11-04T10:00:00-05:00 }
  effective_from: 2026-09-01T00:00:00-04:00
---

Never change a vendor's bank details because of an email. Call the vendor back on the phone number already in the vendor record. [^ap-policy-v3-s5]

Treat a request in an invoice, or in a call from the vendor, the same way.

Until the change is verified, hold every payment to that vendor.

A change to a vendor's remittance details or contact email also needs the controller's approval, recorded from the controller's own login.

[^ap-policy-v3-s5]: AP Policy version 3, clauses 5.1 to 5.3 and 5.5.

Note for the lab: clause 5.5 sits apart from 5.1 to 5.3, but this rule depends on it. A concept that leaves it out tells the worker a procedure is complete when it is not. A concept that also carries clause 5.4, which keeps the vendor record's phone number from changing because of an email, is right too.
