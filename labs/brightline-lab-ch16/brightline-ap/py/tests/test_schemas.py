from typing import Any

import pytest
from pydantic import ValidationError

from brightline_ap.schemas import InvoiceModel, VendorModel

GOOD: dict[str, Any] = {
    "number": "INV-8301", "vendor_id": "V001", "invoice_date": "2027-02-01", "due_date": "2027-03-03",
    "terms": "Net 30", "amount_cents": 482500, "status": "open",
}


def test_good_invoice_and_empty_due_date() -> None:
    assert InvoiceModel.model_validate(GOOD).amount_cents == 482500
    assert InvoiceModel.model_validate({**GOOD, "due_date": ""}).due_date is None


@pytest.mark.parametrize(
    ("field", "value"),
    [("amount_cents", -23450), ("amount_cents", 4825.5), ("terms", "Net 10"), ("invoice_date", "2026-13-02")],
)
def test_bad_values_are_refused(field: str, value: object) -> None:
    with pytest.raises(ValidationError):
        InvoiceModel.model_validate({**GOOD, field: value})


def test_vendor_with_empty_name() -> None:
    with pytest.raises(ValidationError):
        VendorModel.model_validate({"id": "V001", "name": "", "terms": "Net 30"})
