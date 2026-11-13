from brightline_ap.due_by_friday import due_by, usd

VENDORS = (
    "vendor_id,vendor_name,terms\n"
    "V001,Midwest Packaging Co.,Net 30\n"
    "V002,Buckeye Janitorial Supply,Net 15\n"
)
HEADER = "invoice_number,vendor_id,invoice_date,due_date,terms,amount_cents,status\n"


def test_an_empty_due_date_is_computed_from_the_terms():
    csv = HEADER + "INV-1,V001,2027-02-03,,Net 30,735000,open\n"
    assert [r["due"] for r in due_by(csv, VENDORS, "2027-03-05")] == ["2027-03-05"]


def test_paid_invoices_are_left_out():
    csv = HEADER + "INV-1,V001,2027-01-29,2027-02-28,Net 30,312000,paid\n"
    assert len(due_by(csv, VENDORS, "2027-03-05")) == 0


def test_late_invoices_are_kept():
    csv = HEADER + "INV-1,V002,2027-01-12,2027-02-26,Net 15,23450,open\n"
    assert len(due_by(csv, VENDORS, "2027-03-05")) == 1


def test_windows_line_endings_give_the_same_result():
    csv = (HEADER + "INV-1,V001,2027-02-01,2027-03-03,Net 30,482500,open\n").replace("\n", "\r\n")
    assert len(due_by(csv, VENDORS, "2027-03-05")) == 1


def test_usd_formats_whole_cents_with_integer_math():
    assert usd(1922953) == "$19,229.53"
    assert usd(19995) == "$199.95"
