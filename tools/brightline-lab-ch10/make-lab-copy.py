#!/usr/bin/env python3
"""Lab 10's data: the vendor master's lab copy, and a check of every figure the keys use.

Run from the labs repository's root:

  python3 tools/brightline-lab-ch10/make-lab-copy.py

It writes labs/brightline-lab-ch10/inputs/vendor-master-lab-copy.csv from
vendor-master-full.csv beside this script, showing tax IDs and bank numbers by
their last four digits only, as an accounting screen shows them. No full number
ships in the lab. Then it checks the figures: the duplicate pairs, the small
suppliers' days, the early-pay list and the auditors' schedule.
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


def main():
    rows = list(csv.DictReader(open(HERE / "vendor-master-full.csv", newline="")))
    fields = list(rows[0].keys())
    lab_rows = []
    for r in rows:
        r2 = dict(r)
        for col in ("tin", "bank_routing", "bank_account"):
            r2[col] = last4(r[col])
        lab_rows.append(r2)
    with open(LAB / "vendor-master-lab-copy.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        w.writerows(lab_rows)

    problems = []

    # No full number ships.
    for r in lab_rows:
        for col in ("tin", "bank_routing", "bank_account"):
            if sum(c.isdigit() for c in r[col]) != 4:
                problems.append(f"{r['vendor_id']} {col} shows {r[col]}")
    print(f"Rows: {len(lab_rows)}. SSNs: {sum(r['tin_type'] == 'SSN' for r in rows)}. "
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
