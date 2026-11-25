# Task 5. Evidence that counts

| Candidate | Sessions | Independent | Merged |
| --- | --- | --- | --- |
| Date format | s01, s02, s03, s04, s06, s07, s09 | 6 | s03 and s04 |
| NA- documents | s01, s03, s04, s07, s08, s10, and the s08 flag | 5 | s03 and s04; the flag is an observation (rule 3) |
| Buckeye EDI copies | s02, s06 | 2 | none |
| Lakeshore | s02, s06 | 2 | none |
| Phone approval | s05 | 1 | none |

Rule 2 of docs/promotion-rules.md: "A retry of the same run counts once." s04 says "Retry of: s03 (same documents, started by the loop at 7:42)".

Then run `npm run check -- --stage evidence`: it confirms every session a candidate names exists.
