# Lab 17 answer key: Task 3. Acceptance checks

The answers for Task 3 of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Compare with [`docs/acceptance-prompts.md`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/docs/acceptance-prompts.md). The JSON block must hold eight machine-checkable checks. The two values you checked by hand: INV-8303 is $900.00 over its PO, and 13 invoices are open.

The authors' answers, from the data, are below. The facts must match. The exact words of an error come from your contract, so yours may differ, but each must say what failed and what to do next.

| Check | Answer |
| --- | --- |
| A1, A8 | V005, Hocking Valley Pallets, Net 30, last four digits `2217`, and the note word for word |
| A2 | `No vendor V099. Known vendor ids are V001 to V008. To search by name, call find_vendor with name.` |
| A3 | INV-8303 ($12,900.00, due 2027-03-06) and INV-8310 ($8,700.00, no due date), and no next page |
| A4 | 13 open invoices: INV-8301 to 8305, then 8306, 8307, 8308, 8310, 8311, then 8312, 8314, 8315 |
| A5 | PO-7003, $12,000.00 against $12,900.00, so $900.00 over (90000 cents) |
| A6 | `No purchase order for INV-8310. Policy: an invoice with no PO is held until the buyer raises one (docs/policies/po-matching.md, line 9). Tell the AP lead. Do not treat it as ready.` |
| A7 | `docs/policies/vendor-onboarding.md`, lines 6 and 7 |
