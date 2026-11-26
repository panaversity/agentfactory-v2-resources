# Lab 23, Task 11: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 23 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 21 and 22's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**What good looks like:** Luis gets Treasure Valley Lumber, Cedar Ridge's V001, with three open invoices, $7,945.75 in all. If the answer cites no policy line, the portal shows it under the label, which is right for a question about a vendor. The log line names Luis and `org_cedar`.

**Expected from the platform's documentation:** Luis gets Treasure Valley Lumber (Cedar Ridge's V001).

**Expected from the data:** in `data-cedar/invoices.csv`, V001 has three open invoices, INV-6201, INV-6210 and INV-6218, 794,575 cents in all.

**Never a deduction:** how the answer words Cedar Ridge's total, an answer shown under the label, since a question about a vendor needs no policy line, or a remark about the date that changes no answer.
