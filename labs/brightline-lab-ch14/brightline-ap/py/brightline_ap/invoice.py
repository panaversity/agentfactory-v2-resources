from dataclasses import dataclass

from brightline_ap.csv_rows import Row


@dataclass(frozen=True)
class Invoice:
    number: str
    vendor_id: str
    invoice_date: str
    due_date: str | None  # None when the export left due_date empty
    terms: str
    amount_cents: int
    status: str


def invoice_from_row(row: Row) -> Invoice:
    return Invoice(
        number=row["invoice_number"],
        vendor_id=row["vendor_id"],
        invoice_date=row["invoice_date"],
        due_date=row["due_date"] or None,
        terms=row["terms"],
        amount_cents=int(row["amount_cents"]),
        status=row["status"],
    )
