# Lab 13 answer key: Task 3. Modify

The answers for Task 3 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Both languages print:

```text
V007  Ohio Valley Electric  (Due on receipt)
V002  Buckeye Janitorial Supply  (Net 15)
V008  Cardinal Forklift Service  (Net 15)
V001  Midwest Packaging Co.  (Net 30)
V003  Great Lakes Freight  (Net 30)
V005  Hocking Valley Pallets  (Net 30)
V004  Scioto Office Products  (Net 45)
V006  Lakefront Labels Inc.  (Net 60)
```

The three vendors on Net 30 keep their file order, V001, V003 and V005, and so do the two on Net 15, V002 and V008. `npm test` still passes 7 tests, and `npm run test:py` passes 2.

Your sentence for each sort line should say that it compares the number of days in the terms, as numbers, fewest first. Check the sentence against the diff, not only the output:

| If the diff or the output shows | What it means |
| --- | --- |
| The sort compares the terms as text | This file prints the right order by luck: "Due on receipt" comes before every "Net", and every Net term here has two digits. The rule is still wrong. A vendor on Net 120 would sort before Net 15 |
| Net 60 comes first | The sort runs the wrong way, largest first |
| V008 comes before V002 | The sort did not keep file order for ties. Both languages' standard sorts keep it, so the agent wrote something unusual |
