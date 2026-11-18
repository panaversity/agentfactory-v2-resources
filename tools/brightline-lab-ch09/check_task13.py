"""Check Lab 9's Task 13 key against its invoice file, for The AI Agent Factory, Second Edition.

python3 tools/brightline-lab-ch09/check_task13.py   (from the repository's root)

Task 13's key states each supplier group's 2025 total, 2 percent of it, and how many days
after the invoice Brightline paid. This script works each one out again from
labs/brightline-lab-ch09/inputs/paid-invoices-2025.csv, in exact decimal arithmetic, and stops
if the key states another figure. It also checks what the file promises: 36 rows, one number
per invoice, every payment on a Friday, and no 2 percent that lands on half a cent."""
import csv, datetime, pathlib, sys
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP

LAB = pathlib.Path(__file__).resolve().parents[2] / "labs" / "brightline-lab-ch09"
rows = list(csv.DictReader((LAB / "inputs" / "paid-invoices-2025.csv").open()))
key = (LAB / "answer-key" / "task-13.md").read_text()
problems = []


def money(amount, currency):
    return ("$" if currency == "USD" else "CAD ") + f"{amount:,.2f}"


if len(rows) != 36:
    problems.append(f"{len(rows)} rows, not 36")
if len({r["invoice_no"] for r in rows}) != len(rows):
    problems.append("an invoice number is used twice")

total, days = defaultdict(Decimal), defaultdict(list)
for r in rows:
    group = (r["supplier_group"], r["currency"])
    invoiced, paid = (datetime.date.fromisoformat(r[c]) for c in ("invoice_date", "paid_date"))
    if paid.weekday() != 4:
        problems.append(f"{r['invoice_no']} was not paid on a Friday")
    if invoiced.year != 2025 or paid.year != 2025:
        problems.append(f"{r['invoice_no']} is not all in 2025")
    total[group] += Decimal(r["amount"])
    days[group].append((paid - invoiced).days)

for (name, currency), amount in sorted(total.items()):
    exact = amount * Decimal("0.02")
    two = exact.quantize(Decimal("0.01"), ROUND_HALF_UP)
    if exact != two:
        problems.append(f"{name} {currency}: 2 percent is {exact}, not a whole cent")
    for figure in (money(amount, currency), money(two, currency)):
        if figure not in key:
            problems.append(f"{name} {currency}: the key does not state {figure}")
    average = sum(days[(name, currency)]) / len(days[(name, currency)])
    print(f"{name:20s} {currency}  {money(amount, currency):>14s}  2 percent {money(two, currency):>10s}  paid after {average:5.2f} days")

usd = sum(v for (_, c), v in total.items() if c == "USD") * Decimal("0.02")
if money(usd, "USD") not in key:
    problems.append(f"the key does not state the US-dollar 2 percent, {money(usd, 'USD')}")
pallets = sum(days[("Pallets", "USD")]) / len(days[("Pallets", "USD")])
others = [sum(v) / len(v) for g, v in days.items() if g[0] != "Pallets"]
if not (5.5 <= pallets <= 6.5 and "about 6 days" in key):
    problems.append(f"Pallets was paid after {pallets:.2f} days: the key says about 6")
if not (24 <= min(others) and max(others) <= 26 and "about 24 to 26 days" in key and "about 14 to 16 days sooner" in key):
    problems.append(f"the other groups were paid after {min(others):.2f} to {max(others):.2f} days: the key says about 24 to 26")

for p in problems:
    print("problem:", p)
print(f"{len(problems)} problem(s).")
sys.exit(1 if problems else 0)
