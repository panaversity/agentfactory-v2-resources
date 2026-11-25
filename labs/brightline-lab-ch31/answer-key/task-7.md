# Task 7. Regression run, tier and approval

scripts/regress.ts copies v3 to a trial folder, applies one candidate's Change (adding its note and removing or rewriting any note it replaces), and runs the 16 golden cases with v3 and with the trial memory.

Expected results (the folder task-7-memory/ holds a trial memory with all four lessons):

| Candidate | Fixes | Breaks | Tier | Decided by | Row in approvals.csv |
| --- | --- | --- | --- | --- | --- |
| Date format | no golden case (tool format) | none | low | scope and impact are small | automatic |
| NA- documents | G01, G02, G03 | none | high | impact: decides whether money is credited | needs Luis |
| Buckeye EDI copies | G04, G05 | none | high | impact: decides whether an invoice is paid | needs Ana |
| Lakeshore | usually none, as the worker follows vendor-terms.md:6; on some days v3 fails G12, and this fixes it | none | medium | evidence: two sessions is not strong | needs Ana |

The phone approval never reaches this step: it failed validation.

scripts/regress.ts should call `runCases` from `src/evaluate.ts`, so each case runs three times and passes with two right answers out of three. A regression is a case that passes with v3 by that rule and fails with the trial memory by the same rule. A case marked "unstable" in either run is not evidence either way: run it with `--trials 5` before you decide.

On claude-haiku-5-5 (checked 24 November 2026, three runs each), v3 fails G01 to G05, three of three each, and passes the other 11 with no unstable case. The trial memory in task-7-memory/ passes all 16, and all four cases of the week of October 26. history/v4-first fails only W1. If you see a case marked unstable, it is ordinary run-to-run variation: run it with --trials 5.

approvals.csv, after Task 7 (the agent writes these; no one has approved anything yet):

```
candidate,tier,decision,approved_by,approval_kind,time,version
date-format,low,approved,automatic,automatic,2026-10-20 08:55,
na-documents,high,needs Luis,,,,
buckeye-edi,high,needs Ana,,,,
lakeshore,medium,needs Ana,,,,
phone-approval,high,rejected,,,,
```

Then `npm run check` (stage tiered) passes for every candidate except the phone approval, whose tier and Approval read high and rejected.

If a lesson fixes fewer target cases than this, look at the failing runs' notes before you blame the model. In our clean test run (24 November 2026), a trial that pasted the Proposed text ("add to memory that an NA- document is a credit memo...") beside the old documents.md note fixed only one of G01 to G03: the worker called the note "an unverified lesson" and asked. The same lesson written as a memory note, with documents.md rewritten, passed G01, G02 and G03 three of three. The same held for Buckeye: G04 and G05 pass three of three once the old "Compare invoice numbers" line is replaced.
