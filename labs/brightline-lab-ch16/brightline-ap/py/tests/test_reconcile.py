from brightline_ap.data import read_data
from brightline_ap.reconcile import reconcile


def test_real_exports() -> None:
    assert reconcile(read_data("invoices.csv")) == []
    assert len(reconcile(read_data("invoices-check.csv"))) == 2
