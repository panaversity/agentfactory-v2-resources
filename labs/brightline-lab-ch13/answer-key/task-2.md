# Lab 13 answer key: Task 2. Predict, run, investigate

The answers for Task 2 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Both scripts print the same 8 lines, one for each vendor, in the order of `data/vendors.csv`. The first is V001, Midwest Packaging Co., and the last is V008, Cardinal Forklift Service.

```text
V001  Midwest Packaging Co.  (Net 30)
V002  Buckeye Janitorial Supply  (Net 15)
V003  Great Lakes Freight  (Net 30)
V004  Scioto Office Products  (Net 45)
V005  Hocking Valley Pallets  (Net 30)
V006  Lakefront Labels Inc.  (Net 60)
V007  Ohio Valley Electric  (Due on receipt)
V008  Cardinal Forklift Service  (Net 15)
```

The shape of one line is the vendor id, two spaces, the name, two spaces, then the terms in brackets. The common miss is one space instead of two, or the terms without brackets. Each script builds the line from one template: `` `${v.id}  ${v.name}  (${v.terms})` `` in TypeScript, and `f"{v['id']}  {v['name']}  ({v['terms']})"` in Python.

Your question and its answer have no single right form. What counts is that you asked about a line you got wrong, or about an input that would break the script, and wrote the answer in your own words. One good answer to "What input would make this script print something wrong?" is a vendor name with a comma in it, such as `Smith, Jones and Co.`. The TypeScript script then prints `V009  Smith  ( Jones and Co.)`, and the Python script stops with `ValueError: too many values to unpack`.
