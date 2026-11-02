from brightline_ap.data import read_data
from brightline_ap.invoice_book import InvoiceBook
from brightline_ap.load_invoices import load_invoices, vendor_ids

BOOK = InvoiceBook(load_invoices(read_data("invoices.csv"), vendor_ids()).valid)


def test_open_and_due() -> None:
    assert len(BOOK.open()) == 13
    assert len(BOOK.due_by("2027-03-05")) == 8
    assert BOOK.open_total_cents() == 4383363
