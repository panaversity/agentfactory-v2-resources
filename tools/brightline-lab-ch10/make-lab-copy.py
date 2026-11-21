#!/usr/bin/env python3
"""Lab 10's data: the raw vendor export, and a check of every figure the keys use.

Run from the labs repository's root:

  python3 tools/brightline-lab-ch10/make-lab-copy.py

It writes labs/brightline-lab-ch10/fictional-vendor-master-2026-12-06.csv from
vendor-master-full.csv beside this script: 36 of the 412 vendors, as Maria
exported them on Sunday, December 6, 2026, with every number in full and the
notes. Its first row says the file is fictional. It adds one column,
tin_masked, each tax ID's last four digits as an accounting screen shows them,
so the learner can keep the last four by deleting one column. The file sits at
the lab folder's root, outside inputs.zip: the learner cuts it in a spreadsheet
before anything goes to the AI (Task 3). Every full number is fake: each Social
Security number starts 000, each EIN 00, the BN 0000, and each routing number
0000, numbers that are never issued. Then it checks the figures: the duplicate
pairs, the small suppliers' days, the early-pay list and the auditors' schedule.
"""

import csv
import datetime
import pathlib
import sys
from collections import defaultdict
from decimal import Decimal

HERE = pathlib.Path(__file__).resolve().parent
LAB = HERE.parents[1] / "labs" / "brightline-lab-ch10" / "inputs"


def last4(value, keep_shape=True):
    """'000-00-1840' -> 'xxx-xx-1840'; '000000375' -> 'xxxxx0375'."""
    digits_seen = 0
    out = []
    for ch in reversed(value):
        if ch.isdigit():
            digits_seen += 1
            out.append(ch if digits_seen <= 4 else "x")
        else:
            out.append(ch)
    return "".join(reversed(out))


RAW = "fictional-vendor-master-2026-12-06.csv"
MARKER = ("FICTIONAL: every name, address, number and note in this file is invented "
          "for Lab 10 of The AI Agent Factory.")


def main():
    rows = list(csv.DictReader(open(HERE / "vendor-master-full.csv", newline="")))
    fields = list(rows[0].keys())
    out_fields = fields[:fields.index("tin") + 1] + ["tin_masked"] + fields[fields.index("tin") + 1:]
    raw_rows = []
    for r in rows:
        r2 = dict(r)
        r2["tin_masked"] = last4(r["tin"])
        raw_rows.append(r2)
    with open(LAB.parent / RAW, "w", newline="") as f:
        f.write('"' + MARKER + '"\n')
        w = csv.DictWriter(f, fieldnames=out_fields, lineterminator="\n")
        w.writeheader()
        w.writerows(raw_rows)
    lab_rows = [dict(r, tin=r["tin_masked"]) for r in raw_rows]

    problems = []

    # The export is marked fictional, and every full number is one that is never issued.
    lines = (LAB.parent / RAW).read_text().split("\n")
    if "FICTIONAL" not in lines[0] or not lines[1].startswith("vendor_id,"):
        problems.append("the first row is not the fictional marker, or the second is not the header")
    for r in raw_rows:
        tin, kind = r["tin"], r["tin_type"]
        fake = {"SSN": tin.startswith("000-"), "EIN": tin.startswith("00-"), "BN": tin.startswith("0000")}.get(kind, False)
        if not fake:
            problems.append(f"{r['vendor_id']} tin {tin} is not in a range that is never issued")
        if not r["bank_routing"].startswith("0000"):
            problems.append(f"{r['vendor_id']} routing {r['bank_routing']} is not in a range that is never issued")
        if sum(c.isdigit() for c in r["tin_masked"]) != 4:
            problems.append(f"{r['vendor_id']} tin_masked shows {r['tin_masked']}")
    print(f"Wrote {RAW}. Rows: {len(lab_rows)}. SSNs: {sum(r['tin_type'] == 'SSN' for r in rows)}. "
          f"Small suppliers: {sum(r['small_supplier'] == 'Y' for r in rows)}.")

    # The duplicate pairs: tax ID type and last four digits.
    groups = defaultdict(list)
    for r in lab_rows:
        groups[(r["tin_type"], r["tin"][-4:])].append(f"{r['vendor_id']} {r['legal_name']}")
    pairs = sorted(v for v in groups.values() if len(v) > 1)
    print("Pairs on tax ID type and last four:")
    for p in pairs:
        print("  " + " / ".join(p))
    expected = {"V-2003", "V-2033", "V-2004", "V-2034", "V-2005", "V-2035", "V-2007", "V-2036"}
    found = {x.split()[0] for p in pairs for x in p}
    if found != expected:
        problems.append(f"pairs found {sorted(found)}, expected {sorted(expected)}")

    # Small suppliers with open invoices on Tuesday, December 1, 2026.
    dec1 = datetime.date(2026, 12, 1)
    dec4 = datetime.date(2026, 12, 4)
    dec11 = datetime.date(2026, 12, 11)
    invoices = list(csv.DictReader(open(LAB / "open-invoices.csv", newline="")))
    late = Decimal("0")
    print("Small suppliers on December 1:")
    for i in invoices:
        if i["small_supplier"] != "Y":
            continue
        got = datetime.date.fromisoformat(i["received_date"])
        days = (dec1 - got).days
        day15 = got + datetime.timedelta(days=15)
        if days > 15:
            when = f"{days - 15} days past the promise"
            late += Decimal(i["amount"])
        elif day15 < dec11:
            when = f"day 15 is {day15:%A, %B} {day15.day}: before the December 11 run, so pay December 4"
        else:
            when = f"day 15 is {day15:%A, %B} {day15.day}: can wait for the December 11 run"
        print(f"  {i['vendor']} {i['invoice_no']} {i['amount']} received {got}: {days} days; {when}")
    print(f"Three late owe USD {late:,.2f}")
    if late != Decimal("5115.50"):
        problems.append(f"late total {late}")

    # The early-pay list.
    lst = list(csv.DictReader(open(LAB / "early-pay-list.csv", newline="")))
    amount = sum(Decimal(r["amount_usd"]) for r in lst)
    disc = sum(Decimal(r["discount_usd"]) for r in lst)
    print(f"Early-pay list: {len(lst)} invoices, USD {amount:,.2f}, discounts USD {disc:,.2f}")
    if (len(lst), amount, disc) != (14, Decimal("344130.00"), Decimal("6882.62")):
        problems.append("early-pay list figures")

    # The register and the schedule.
    reg = list(csv.DictReader(open(LAB / "open-payables-register-2026-11-30.csv", newline="")))
    usd = sum(Decimal(r["open_balance"]) for r in reg if r["currency"] == "USD")
    cad = [r for r in reg if r["currency"] != "USD"]
    print(f"Register: {len(reg)} vendors; USD alone {usd:,.2f}; other: "
          + ", ".join(f"{r['vendor']} {r['currency']} {r['open_balance']}" for r in cad))
    if usd != Decimal("427931.00") or usd + sum(Decimal(r["open_balance"]) for r in cad) != Decimal("446331.00"):
        problems.append("register totals")

    if problems:
        sys.exit("PROBLEMS:\n- " + "\n- ".join(problems))
    print("All figures check.")


if __name__ == "__main__":
    main()
