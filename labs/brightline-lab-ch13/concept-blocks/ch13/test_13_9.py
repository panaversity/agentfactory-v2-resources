import sys
sys.path.insert(0, "../../brightline-ap/py")
import pytest

from brightline_ap.due_date import due_date

def test_crosses_a_year_end() -> None:
    assert due_date("2026-12-20", "Net 30") == "2027-01-19"

def test_unknown_terms_raise_an_error() -> None:
    with pytest.raises(ValueError, match="Unknown terms: Net 10"):
        due_date("2026-10-01", "Net 10")
