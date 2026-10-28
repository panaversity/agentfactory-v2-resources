# Sample Role Contracts

The chain of sample contracts that Part II's labs ship, in chapter order (rule 6 of the book's `docs/labs.md`). Each lab that changes the AP Worker's Role Contract ships the sample the lab before it ended with. The samples live here, never in a lab's folder, because a lab's zip would hand its own learners the answer. `tools/contract-chain/check.py` checks each shipped draft against its sample, less the cuts its lab names.

| File | What it is | Shipped by |
| --- | --- | --- |
| `role-contract-draft-3-source.md` | Lab 4's old proof final, Draft 3 of Friday, October 16, 2026: the chain's starting point | Lab 7, as `inputs/role-contract-draft-3.md`, with six named cuts |
| `role-contract-draft-4.md` | Lab 7's sample final, Draft 4 of Wednesday, October 28, 2026: the contract of a stand-in learner who passed all 29 checks and Task 12's fresh chat, with seven consistency fixes named in the commit that adds it | Lab 8 |
| `role-contract-draft-7.md` | Lab 10's sample final, Draft 7 of Friday, December 11, 2026: Draft 6 with the five lines Lab 10's Tasks 2, 7 and 8 add (never rank staff; the small-supplier promise waits for Dave's approval; never sign or put a signature block on a draft; auditor, tax and court requests to Dave; the sign-off list's routing), and the new date. Built on Lab 9's sample Draft 6 by `tools/contract-chain/check.py --write` | Lab 11 |

Every name, address and number is invented.
