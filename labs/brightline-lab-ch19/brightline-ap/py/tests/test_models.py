from pathlib import Path

from brightline_ap.models import Invoice, Vendor, load_csv

DATA = Path(__file__).resolve().parents[2] / "data"


def test_vendors_load() -> None:
    rows, problems = load_csv((DATA / "vendors.csv").read_text(), Vendor)
    assert len(rows) == 8 and problems == []


def test_invoices_load_with_null_due_dates() -> None:
    rows, problems = load_csv((DATA / "invoices.csv").read_text(), Invoice)
    assert len(rows) == 15 and problems == []
    assert next(r for r in rows if r.invoice_number == "INV-8305").due_date is None


def test_every_bad_row_is_reported() -> None:
    text = "vendor_id,vendor_name,terms\nV001,A,Net 30\nX9,B,Net 30\nV003,,Net 30\n"
    rows, problems = load_csv(text, Vendor)
    assert len(rows) == 1
    assert [p.line for p in problems] == [3, 4]
