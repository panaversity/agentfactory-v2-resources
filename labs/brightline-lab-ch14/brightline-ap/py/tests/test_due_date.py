import pytest

from brightline_ap.due_date import due_date


def test_each_term_in_the_data():
    assert due_date("2026-10-23", "Net 15") == "2026-11-07"
    assert due_date("2026-10-07", "Net 30") == "2026-11-06"
    assert due_date("2026-09-15", "Net 45") == "2026-10-30"
    assert due_date("2026-09-05", "Net 60") == "2026-11-04"
    assert due_date("2026-11-02", "Due on receipt") == "2026-11-02"


def test_crosses_a_month_end():
    assert due_date("2026-10-20", "Net 15") == "2026-11-04"


def test_crosses_a_year_end():
    assert due_date("2026-12-20", "Net 30") == "2027-01-19"


def test_counts_a_leap_day():
    assert due_date("2028-02-15", "Net 15") == "2028-03-01"


def test_unknown_terms_raise_an_error():
    with pytest.raises(ValueError, match="Unknown terms: Net 10"):
        due_date("2026-10-01", "Net 10")
