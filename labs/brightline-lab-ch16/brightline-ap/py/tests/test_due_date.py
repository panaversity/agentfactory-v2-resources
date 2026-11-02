import pytest

from brightline_ap.due_date import due_date, parse_terms

CASES = [
    ("2026-10-23", "Net 15", "2026-11-07"),
    ("2026-10-07", "Net 30", "2026-11-06"),
    ("2026-09-15", "Net 45", "2026-10-30"),
    ("2026-09-05", "Net 60", "2026-11-04"),
    ("2026-11-02", "Due on receipt", "2026-11-02"),
    ("2026-10-20", "Net 15", "2026-11-04"),
    ("2026-12-20", "Net 30", "2027-01-19"),
    ("2028-02-15", "Net 15", "2028-03-01"),
]


@pytest.mark.parametrize(("invoice_date", "terms", "expected"), CASES)
def test_due_date(invoice_date: str, terms: str, expected: str) -> None:
    assert due_date(invoice_date, parse_terms(terms)) == expected


def test_unknown_terms() -> None:
    with pytest.raises(ValueError, match="Unknown terms: Net 10"):
        parse_terms("Net 10")
