"""Chapter 14: the data models every Brightline tool shares, in Python."""

from __future__ import annotations

import csv
import io
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, ValidationError

ISO_DATE = r"^\d{4}-\d{2}-\d{2}$"


class Vendor(BaseModel):
    model_config = ConfigDict(extra="forbid")
    vendor_id: str = Field(pattern=r"^V\d{3}$")
    vendor_name: str = Field(min_length=1)
    terms: str = Field(min_length=1)


class Invoice(BaseModel):
    model_config = ConfigDict(extra="forbid")
    invoice_number: str = Field(pattern=r"^INV-\d{4}$")
    vendor_id: str = Field(pattern=r"^V\d{3}$")
    invoice_date: str = Field(pattern=ISO_DATE)
    due_date: str | None = Field(pattern=ISO_DATE)
    terms: str = Field(min_length=1)
    amount_cents: int = Field(ge=0)
    status: Literal["open", "paid"]


class RowProblem(BaseModel):
    line: int
    message: str


def load_csv[M: BaseModel](text: str, model: type[M]) -> tuple[list[M], list[RowProblem]]:
    """Check every row. Never stop at the first bad one."""
    rows: list[M] = []
    problems: list[RowProblem] = []
    reader = csv.DictReader(io.StringIO(text.replace("\r\n", "\n")))
    for i, raw in enumerate(reader, start=2):
        cleaned: dict[str, object] = {}
        for key, value in raw.items():
            cell = (value or "").strip()
            if cell == "":
                cleaned[key] = None
            elif key.endswith("_cents"):
                cleaned[key] = int(cell) if cell.isdigit() else cell
            else:
                cleaned[key] = cell
        try:
            rows.append(model.model_validate(cleaned))
        except ValidationError as err:
            problems.append(RowProblem(line=i, message=str(err.errors()[0]["msg"])))
    return rows, problems
