# Task 6. Check against policy

| Candidate | Validation | Result |
| --- | --- | --- |
| Phone approval | approvals.md:5 and :6: an approval by phone is not an approval until recorded | Rejected (rule 11). Recorded |
| Lakeshore | vendor-terms.md:6: Net 15 since August 14, 2026 | Confirmed: delete the 45-day note |
| Buckeye EDI copies | payments.md:6 defines a duplicate; Ana's corrections in s02 and s06 say the EDI copy is the same invoice | Confirmed for Buckeye at Brightline only |
| NA- documents | credits.md:5 and :6: a credit memo lowers what Cedar Ridge owes; apply it. The codes SS, RT and PC come from Luis | Confirmed for Northfield at Cedar Ridge, for the codes seen |
| Date format | the tool's own error: "due_before must be YYYY-MM-DD, such as 2026-10-09" | Confirmed |

The NA- claim, rewritten with the seen kept apart from the guessed:
- Seen: NA- documents with codes SS, RT and PC, each naming its invoice in the line text, each a credit (Luis, five mornings).
- Not seen: any other code. Proposed: ask Luis.
- credits.md:7: a credit memo received twice is a duplicate. Hold it.

Then run `npm run check -- --stage validated`: it confirms every policy line a candidate cites exists.

Each surviving candidate's Change, written as memory, not as a proposal (compare task-7-memory/):
- NA- documents: a new page notes/cedar-ridge/credit-memos.md with the four lines in task-7-memory, and documents.md rewritten so it no longer holds every second document that names an invoice.
- Buckeye: the Buckeye line in notes/brightline/vendors.md replaced with the BO-NNNNN / NNNNN rule.
- Lakeshore: the 45-day line removed from vendors.md.
- Date format: one line in notes/worker/tools.md: due_before takes YYYY-MM-DD.

