"""Make Dave's approved memo for Lab 6, Part F, of The AI Agent Factory, Second Edition.

python3 tools/brightline-lab-ch06/make-approved-memo.py        (from the repository's root)

Writes labs/brightline-lab-ch06/part-f/approved-memo-2026-11-06.md: the payment run for Friday,
November 6, 2026, which Dave approved on Thursday, November 5. It is the next week's run, so it
gives away nothing from Lab 6's review of the October 30 package. Task F1 adapts it for Linda.
What the lab teaches is kept out of the file, and the script checks that it stays out: Linda and
her three needs, and Dave's later hold on Midwest's 4588, which only his message gives. The script
also checks every total. Every name and number is invented."""
import sys
from decimal import Decimal as D
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "labs/brightline-lab-ch06/part-f/approved-memo-2026-11-06.md"

PAY = [  # vendor, invoice, amount
    ("Midwest Packaging", "4579", "5480.00"),
    ("Midwest Packaging", "4588", "2940.00"),
    ("Buckeye Office Supply", "BO-23177", "612.40"),
    ("Buckeye Office Supply", "BO-23181", "461.00"),
    ("Lakeshore Janitorial", "5163", "1180.00"),
    ("Tri-County Freight", "5183", "1265.00"),
    ("Tri-County Freight", "5190", "890.10"),
    ("Scioto Pallet Co.", "SP-1241", "1408.00"),
]
NOT_DUE = [("Midwest Packaging", "4592", "2210.00"), ("Scioto Pallet Co.", "SP-1248", "1260.00")]
money = lambda a: f"${D(a):,.2f}"
pay_total = sum(D(a) for _, _, a in PAY)
not_due_total = sum(D(a) for _, _, a in NOT_DUE)

lines = [
    "# Payment run for Friday, November 6, 2026", "",
    "To: Dave Kowalski, Controller  ",
    "From: AP Worker  ",
    "Prepared: Tuesday, November 3, 2026  ",
    "Approved: by Dave Kowalski, in the accounting system, on Thursday, November 5, 2026", "",
    "## Decisions recorded", "",
    "1. Midwest Packaging invoice 4579 ($5,480.00) is over $5,000.00. Dave approved it on Wednesday, November 4 (policy 4.1).",
    "2. Northern Maple Paper invoice NMP-3502 (CAD 2,140.00) is not in this run. Policy version 3 does not cover other currencies. Dave decides on it next week.",
    "3. Dave approved the run as a whole on Thursday, November 5 (policy 4.3).", "",
    "## Friday's run", "",
    f"**Pay on Friday: {money(pay_total)} across {len(PAY)} invoices.**", "",
    "| Vendor | Invoice | Amount |", "| --- | --- | --- |",
] + [f"| {v} | {i} | {money(a)} |" for v, i, a in PAY] + [
    "", "## Held", "",
    "- Lakeshore Janitorial invoice 5171 ($1,180.00) has the same vendor, amount and invoice date as 5163, which is in the run. The later copy, 5171, is held, and the AP lead is told (policy 6.1).", "",
    "## Not in this run", "",
    "- Northern Maple Paper NMP-3502 (CAD 2,140.00): see decision 2.",
] + [f"- Not yet due: {v} {i} ({money(a)})." for v, i, a in NOT_DUE] + [""]
text = "\n".join(lines)

problems = []
if pay_total != D("14236.50"): problems.append(f"the run totals {pay_total}, not 14,236.50")
if len(PAY) != 8: problems.append("the run should have 8 invoices")
if not_due_total != D("3470.00"): problems.append("the invoices not yet due should total 3,470.00")
after = pay_total - D("2940.00")
if after != D("11296.50"): problems.append("the run less Midwest's 4588 should be 11,296.50")
for word in ("Linda", "11,296.50", "corrected copy", "three lines", "phone", "leadership"):
    if word.lower() in text.lower(): problems.append(f"the file says '{word}', which only Dave's message may give")
if problems: sys.exit("make-approved-memo: " + "; ".join(problems))

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(text, encoding="utf-8")
print(f"wrote {OUT.relative_to(ROOT)}: run {money(pay_total)} across {len(PAY)} invoices; "
      f"after Dave's hold on 4588: {money(after)} across {len(PAY) - 1}")
