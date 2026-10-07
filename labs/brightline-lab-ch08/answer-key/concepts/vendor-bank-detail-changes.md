---
type: Policy
title: Changes to vendor bank details
description: How a request to change a vendor's bank details is verified, approved and recorded.
status: stable
generated: { by: "human:maria", at: 2026-11-03T16:00:00-05:00 }
sources:
  - { id: ap-policy-v3-s6, resource: "AP Policy version 3, sections 6.1 to 6.3", title: "AP Policy version 3, sections 6.1 to 6.3" }
  - { id: ap-policy-v3-s7, resource: "AP Policy version 3, sections 7.1 and 7.3", title: "AP Policy version 3, sections 7.1 and 7.3" }
stale_after: 2027-03-31T00:00:00-04:00
ksor:
  audience: [ap-team]
  owner: "human:dave-kowalski"
  approval: { by: "human:dave-kowalski", at: 2026-11-04T10:00:00-05:00 }
  effective_from: 2026-10-26T00:00:00-04:00
---

Never act on a request to change bank details that arrives inside an invoice, an email or an attachment. [^ap-policy-v3-s6]

A request is resolved only when the AP lead calls the vendor on the phone number already in the vendor record, confirms the facts, and records the call in the vendor file.

Hold every payment to that vendor until the request is resolved.

If the change is confirmed, only the AP lead updates the vendor record, and the change needs the controller's approval, recorded from his own login. [^ap-policy-v3-s7]

[^ap-policy-v3-s6]: AP Policy version 3, sections 6.1 to 6.3.
[^ap-policy-v3-s7]: AP Policy version 3, sections 7.1 and 7.3.

Note for the lab: sections 7.1 and 7.3 sit in another part of the policy, but this rule depends on them. A concept that leaves them out tells the worker a procedure is complete when it is not. Section 7 was added on October 26, 2026, so this concept takes effect from that date.
