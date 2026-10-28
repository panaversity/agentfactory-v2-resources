# Sample Role Contracts

The chain of sample contracts that Part II's labs ship, in chapter order (rule 6 of the book's `docs/labs.md`). Each lab that changes the AP Worker's Role Contract ships the sample the lab before it ended with. The samples live here, never in a lab's folder, because a lab's zip would hand its own learners the answer. `tools/contract-chain/check.py` checks each shipped draft against its sample, less the cuts its lab names.

| File | What it is | Shipped by |
| --- | --- | --- |
| `role-contract-draft-3-source.md` | Lab 4's old proof final, Draft 3 of Friday, October 16, 2026: the chain's starting point | Lab 7, as `inputs/role-contract-draft-3.md`, with six named cuts |
| `role-contract-draft-4.md` | Lab 7's sample final, Draft 4 of Wednesday, October 28, 2026: the contract of a stand-in learner who passed all 29 checks and Task 12's fresh chat, with seven consistency fixes named in the commit that adds it | Lab 8 |
| `role-contract-draft-5.md` | Lab 8's sample final, Draft 5 of Monday, November 9, 2026: Draft 4 with the lines Lab 8's Task 11 changes, as a stand-in learner who passed every check decided them. Its knowledge sources are the five approved concepts; it adds the memory audit, the invoice-review skill as a draft, invoice 5149's case file, the copies and their log, the currency line pointing to the concept's November 9 approval, and that change's log line | Lab 9 |
| `role-contract-draft-6.md` | Lab 9's sample, Draft 6 of Monday, November 23, 2026: the shipped Draft 5 with the lines Lab 9's tasks add, as a stand-in author who passed all 27 checks and Task 12's fresh chat decided them: the jobs this worker does, who does each step, both standing specs, the AP matters record's rules, Initiative, Dave's bank-detail line, the jobs' identity and access, Kind, the check outside the run, both AI vendors' lines, and Who may ask in #ap-help. Two consistency fixes are named in the commit that adds it | Lab 10 |
| `role-contract-draft-7.md` | Lab 10's sample final, Draft 7 of Friday, December 11, 2026: Draft 6 with the five lines Lab 10's Tasks 2, 7 and 8 add (never rank staff; the small-supplier promise waits for Dave's approval; never sign or put a signature block on a draft; auditor, tax and court requests to Dave; the sign-off list's routing), and the new date. Built on Lab 9's sample Draft 6 by `tools/contract-chain/check.py --write` | Lab 11 |
| `role-contract-draft-8.md` | Lab 11's sample final, Draft 8 of Monday, January 18, 2027: Draft 7 with the lines Lab 11's tasks change. The end of the Part II chain | (none) |

Every name, address and number is invented.
