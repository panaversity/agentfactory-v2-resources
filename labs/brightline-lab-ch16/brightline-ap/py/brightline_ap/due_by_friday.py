"""Which open invoices are due on or before the payment run?

Run from py/: uv run python -m brightline_ap.due_by_friday 2027-03-05
"""

import sys
from dataclasses import dataclass

from brightline_ap.data import read_data, records
from brightline_ap.due_date import due_date, parse_terms


@dataclass(frozen=True)
class DueInvoice:
    due: str
    number: str
    vendor: str
    cents: int


def usd(cents: int) -> str:
    return f"${cents // 100:,}.{cents % 100:02d}"


def due_by(invoices_csv: str, vendors_csv: str, cutoff: str) -> list[DueInvoice]:
    names = {v["vendor_id"]: v["vendor_name"] for v in records(vendors_csv)}
    out: list[DueInvoice] = []
    for r in records(invoices_csv):
        if r["status"] != "open":
            continue
        due = r["due_date"] or due_date(r["invoice_date"], parse_terms(r["terms"]))
        if due <= cutoff:
            out.append(DueInvoice(due, r["invoice_number"], names.get(r["vendor_id"], r["vendor_id"]), int(r["amount_cents"])))
    return sorted(out, key=lambda d: (d.due, d.number))


def main() -> None:
    cutoff = sys.argv[1] if len(sys.argv) > 1 else "2027-03-05"
    found = due_by(read_data("invoices.csv"), read_data("vendors.csv"), cutoff)
    for d in found:
        print(f"{d.due}  {d.number}  {d.vendor}  {usd(d.cents)}")
    print(f"{len(found)} invoices, total {usd(sum(d.cents for d in found))}")


if __name__ == "__main__":
    main()
