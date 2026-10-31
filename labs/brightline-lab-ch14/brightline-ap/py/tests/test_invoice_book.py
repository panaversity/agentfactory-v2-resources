from pathlib import Path

from brightline_ap.csv_rows import read_rows
from brightline_ap.invoice import invoice_from_row
from brightline_ap.invoice_book import InvoiceBook
from brightline_ap.vendor import VendorDirectory, vendor_from_row

DATA = Path(__file__).resolve().parents[2] / "data"


def make_book() -> InvoiceBook:
    invoices = read_rows((DATA / "invoices.csv").read_text(encoding="utf-8"))
    vendors = read_rows((DATA / "vendors.csv").read_text(encoding="utf-8"))
    return InvoiceBook(
        [invoice_from_row(r) for r in invoices],
        VendorDirectory([vendor_from_row(r) for r in vendors]),
    )


def test_due_by_gives_the_chapter_12_answer():
    lines = make_book().due_by("2027-03-05")
    assert len(lines) == 8
    assert sum(line.cents for line in lines) == 1922953


def test_an_empty_due_date_comes_from_the_terms():
    book = make_book()
    inv = next(i for i in book.invoices if i.number == "INV-8305")
    assert book.due_date_of(inv) == "2027-03-05"


def test_open_leaves_out_paid_invoices():
    assert len(make_book().open()) == 13
