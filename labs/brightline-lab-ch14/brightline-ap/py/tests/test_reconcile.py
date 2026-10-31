from brightline_ap.reconcile import reconcile

HEADER = "invoice_number,vendor_id,invoice_date,due_date,terms,amount_cents,status\n"


def test_a_matching_date_is_not_a_mismatch():
    assert reconcile(HEADER + "INV-1,V001,2027-02-01,2027-03-03,Net 30,482500,open\n") == []


def test_a_wrong_date_is_reported():
    assert reconcile(HEADER + "INV-2,V006,2027-01-07,2027-03-07,Net 60,158200,open\n") == [
        {"invoice": "INV-2", "stated": "2027-03-07", "computed": "2027-03-08"}
    ]


def test_an_empty_due_date_is_skipped():
    assert reconcile(HEADER + "INV-3,V005,2027-02-03,,Net 30,735000,open\n") == []


def test_windows_line_endings_give_the_same_result():
    csv = (HEADER + "INV-2,V006,2027-01-07,2027-03-07,Net 60,158200,open\n").replace("\n", "\r\n")
    assert len(reconcile(csv)) == 1
