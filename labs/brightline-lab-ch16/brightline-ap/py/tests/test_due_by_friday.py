from brightline_ap.data import read_data
from brightline_ap.due_by_friday import due_by

VENDORS = read_data("vendors.csv")
HEADER = "invoice_number,vendor_id,invoice_date,due_date,terms,amount_cents,status\n"


def test_eight_invoices_due_by_friday() -> None:
    found = due_by(read_data("invoices.csv"), VENDORS, "2027-03-05")
    assert len(found) == 8
    assert sum(d.cents for d in found) == 1922953


def test_cutoff_day_is_included() -> None:
    csv = HEADER + "INV-9001,V001,2027-02-03,2027-03-05,Net 30,100,open\n"
    assert [d.number for d in due_by(csv, VENDORS, "2027-03-05")] == ["INV-9001"]
