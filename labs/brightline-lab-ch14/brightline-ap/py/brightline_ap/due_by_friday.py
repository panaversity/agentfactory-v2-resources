"""Lists the open invoices due on or before a cutoff date, with a total.

Run: npm run due:py -- 2027-03-05
Another export in data/: npm run due:py -- 2027-03-05 invoices-messy.csv
"""

import sys
from pathlib import Path

from brightline_ap.csv_rows import read_rows
from brightline_ap.invoice import invoice_from_row
from brightline_ap.invoice_book import DueLine, InvoiceBook
from brightline_ap.money import usd
from brightline_ap.vendor import VendorDirectory, vendor_from_row

DATA = Path(__file__).resolve().parents[2] / "data"


def due_by(invoices_csv: str, vendors_csv: str, cutoff: str) -> list[DueLine]:
    vendors = VendorDirectory([vendor_from_row(r) for r in read_rows(vendors_csv)])
    book = InvoiceBook([invoice_from_row(r) for r in read_rows(invoices_csv)], vendors)
    return book.due_by(cutoff)


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
    for line in found:
        print(f"{line.due}  {line.number}  {line.vendor}  {usd(line.cents)}")
    print(f"{len(found)} invoices, total {usd(sum(line.cents for line in found))}")
