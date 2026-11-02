from brightline_ap.data import read_data
from brightline_ap.load_invoices import load_invoices, vendor_ids


def test_messy_export() -> None:
    res = load_invoices(read_data("invoices-messy.csv"), vendor_ids())
    assert len(res.valid) == 11
    assert [(e.line, e.number) for e in res.errors] == [
        (5, "INV-8304"), (7, "INV-8306"), (11, "INV-8310"), (14, "INV-8313"),
    ]


def test_bad_amounts_are_errors() -> None:
    header = "invoice_number,vendor_id,invoice_date,due_date,terms,amount_cents,status\n"
    for amount in ["", "  ", "4825.0", "12.5"]:
        res = load_invoices(f"{header}INV-9003,V001,2027-02-01,,Net 30,{amount},open\n", vendor_ids())
        assert len(res.errors) == 1, amount
