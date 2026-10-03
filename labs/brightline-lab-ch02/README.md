# Brightline lab: Chapter 2

Lab files for Chapter 2 of The AI Agent Factory, Second Edition. This folder is standalone: everything the lab needs is here, and you need no files from any other lab or chapter. Every name, number and company here is invented.

**The scenario.** Brightline Wholesale Supply is a fictional distributor of packaging, janitorial and safety supplies in Columbus, Ohio, with about 40 staff. Its controller set up an "AP (accounts payable) assistant" without defining it. A fake email asking to change a vendor's bank account nearly went out with a confirming reply. In this lab you write the AP Worker's first Role Contract, test that it stops the fake and still handles routine work, and choose its runtime from scored test runs.

**Start with `LAB.md`.** It gives every step, with timings. The lab takes about 80 minutes.

| Path | What it is |
| --- | --- |
| `LAB.md` | The full instructions, Parts A to G |
| `role/role-contract-template.md` | The blank one-page Role Contract |
| `role/ap-work-inventory.md` | Brightline's recurring AP work today, the raw material for your contract |
| `role/controller-answers.md` | The controller's answers to your open questions. Open it only in Part D |
| `inputs/bank-change-email.txt` | The fake bank-change email. The contract must make the worker escalate it |
| `inputs/vendor-status-email.txt` | A routine vendor question. The contract must let the worker draft a reply |
| `invoices/invoice-01.txt` to `invoice-15.txt` | The 15 vendor invoices received in September, for the model runs in Part F |
| `briefs/contract-test.md` | A portable brief that tests your contract's wording against one email |
| `briefs/invoice-register.md` | A portable brief for the weekly invoice register, run in Part F |
| `briefs/invoice-register-port.md` | A blank port log, for moving your runtime choice to the other vendor |
| `results/contract-test.md` | Your predictions and the two test results |
| `results/model-test.md` | Your model runs, scores and port |
| `answer-key/role-contract-example.md` | A model Draft 1 for the AP Worker |
| `answer-key/role-contract-rubric.md` | The 10-point rubric for the Role Contract |
| `answer-key/answer-key.md` | The expected invoice register and its three traps |
| `answer-key/scoring-rubric.md` | The 10-point rubric for each run of the invoice brief |

**When to open the answer key.** Open the two `role-contract` files after Part E. Open `answer-key.md` and `scoring-rubric.md` in Part F, after your first run.
