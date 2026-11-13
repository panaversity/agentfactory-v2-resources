"""Lists the open invoices due on or before a cutoff date, with a total.

Run: npm run due:py -- 2027-03-05
Another export in data/: npm run due:py -- 2027-03-12 invoices-next-week.csv
"""

import sys
from datetime import date, timedelta
from pathlib import Path
from typing import TypedDict

DATA = Path(__file__).resolve().parents[2] / "data"


class DueInvoice(TypedDict):
    due: str
    number: str
    vendor: str
    cents: int


def rows(csv: str) -> list[list[str]]:
    return [line.split(",") for line in csv.strip().splitlines()[1:]]


# An empty due_date means: invoice_date plus the days in the terms.
def add_days(iso_date: str, days: int) -> str:
    return (date.fromisoformat(iso_date) + timedelta(days=days)).isoformat()


def terms_days(terms: str) -> int:
    return 0 if terms == "Due on receipt" else int(terms.split(" ")[1])


def due_by(invoices_csv: str, vendors_csv: str, cutoff: str) -> list[DueInvoice]:
    names = {row[0]: row[1] for row in rows(vendors_csv)}
    found: list[DueInvoice] = []
    for number, vendor_id, invoice_date, due, terms, cents, status in rows(invoices_csv):
        if status != "open":
            continue
        due_date = due or add_days(invoice_date, terms_days(terms))
        if due_date <= cutoff:
            found.append(
                {"due": due_date, "number": number, "vendor": names[vendor_id], "cents": int(cents)}
            )
    return sorted(found, key=lambda r: (r["due"], r["number"]))


# Whole cents to dollars with integer math, for example 735000 -> $7,350.00.
def usd(cents: int) -> str:
    return f"${cents // 100:,}.{cents % 100:02d}"


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: npm run due:py -- YYYY-MM-DD [file in data/]", file=sys.stderr)
        sys.exit(1)
    cutoff = sys.argv[1]
    export = sys.argv[2] if len(sys.argv) > 2 else "invoices.csv"
    found = due_by(
        (DATA / export).read_text(encoding="utf-8"),
        (DATA / "vendors.csv").read_text(encoding="utf-8"),
        cutoff,
    )
    for r in found:
        print(f"{r['due']}  {r['number']}  {r['vendor']}  {usd(r['cents'])}")
    print(f"{len(found)} invoices, total {usd(sum(r['cents'] for r in found))}")
