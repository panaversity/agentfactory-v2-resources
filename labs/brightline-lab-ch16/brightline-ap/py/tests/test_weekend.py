import pytest

from brightline_ap.due_date import pay_by


@pytest.mark.parametrize(
    ("due", "expected"),
    [("2026-11-07", "2026-11-06"), ("2026-11-01", "2026-10-30"), ("2026-11-04", "2026-11-04"), ("2026-08-01", "2026-07-31")],
)
def test_pay_by(due: str, expected: str) -> None:
    assert pay_by(due) == expected
