"""The edge of the program: every record is checked here before any code trusts it."""

from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from brightline_ap.due_date import Terms


class InvoiceModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    number: str = Field(pattern=r"^INV-\d{4}$")
    vendor_id: str = Field(pattern=r"^V\d{3}$", alias="vendorId")
    invoice_date: date = Field(alias="invoiceDate")
    due_date: date | None = Field(default=None, alias="dueDate")
    terms: Terms
    amount_cents: int = Field(gt=0, strict=True, alias="amountCents")
    status: Literal["open", "paid"]

    @field_validator("due_date", mode="before")
    @classmethod
    def empty_is_none(cls, value: object) -> object:
        return None if value == "" else value


class VendorModel(BaseModel):
    id: str = Field(pattern=r"^V\d{3}$")
    name: str = Field(min_length=1)
    terms: Terms
