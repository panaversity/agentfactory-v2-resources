# Task 8. Publish, monitor, roll back

Your simulated approvals, written by you, never by the agent. Use your own name:

```
na-documents,high,approved,"Sam Lee, standing in for Luis",simulated-training,2026-10-20 09:12,
buckeye-edi,high,approved,"Sam Lee, standing in for Ana",simulated-training,2026-10-20 09:20,
lakeshore,medium,approved,"Sam Lee, standing in for Ana",simulated-training,2026-10-20 09:21,
```

Replace the three "needs" rows with these, in an editor, before you send Task 8's request. The agent never writes them. The names Ana Morales and Luis Moreno never appear in `approved_by`. In our clean test run, an agent given approval instructions in its request wrote its own rows ("Claude, standing in for Luis"); that is why the approvals now come before the request, and why publish.ts should refuse rows it did not expect.

scripts/publish.ts: copy the newest version to memory/published/vN+1, apply the Change of every candidate whose row reads approved, with `approval_kind` automatic or simulated-training (in production, only a real person's approval counts), `chmod -R a-w` the new folder, and add a row to docs/promotion-log.md.

Monitor results over golden/week-of-oct-26.csv:
- Your version: 4 of 4 (W1 ask, W2 hold-duplicate, W3 apply-credit, W4 ready-to-pay).
- history/v4-first/: W1 fails. NA-2281 has code FR, a $410.00 freight charge, and the worker applies it as a credit, because v4-first says every NA- document is one. W2 (NA-2240, a second copy of a credit already applied) may also fail or be unstable, because v4-first says "Never hold it". W1 fails every time, so it is the case to add to the golden set.

Roll back inside history/: copy history/v3 to history/v5, change the index's first line to say v5, and add a row to history/promotion-log.md: "v5, Tuesday, October 27, 2026, v3's content again, rollback of v4". Nothing is deleted.

Add W1 to golden/cases.csv as G17 (kind regression, expected ask). The golden set now has 17 cases: change the number in tests/csv.test.ts to 17, and `npm test` passes again.
