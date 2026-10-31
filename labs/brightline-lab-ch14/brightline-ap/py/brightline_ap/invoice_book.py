from dataclasses import dataclass

from brightline_ap.due_date import due_date
from brightline_ap.invoice import Invoice
from brightline_ap.vendor import VendorDirectory


@dataclass(frozen=True)
class DueLine:
    due: str
    number: str
    vendor: str
    cents: int


class InvoiceBook:
    """Holds the invoices and the vendor directory, and answers questions about them."""

    def __init__(self, invoices: list[Invoice], vendors: VendorDirectory) -> None:
        self.invoices = invoices
        self.vendors = vendors

    def open(self) -> list[Invoice]:
        return [inv for inv in self.invoices if inv.status == "open"]

    def due_date_of(self, inv: Invoice) -> str:
        return inv.due_date or due_date(inv.invoice_date, inv.terms)

    def due_by(self, cutoff: str) -> list[DueLine]:
        lines = [
            DueLine(self.due_date_of(inv), inv.number, self.vendors.name(inv.vendor_id), inv.amount_cents)
            for inv in self.open()
        ]
        return sorted(
            (line for line in lines if line.due <= cutoff), key=lambda l: (l.due, l.number)
        )
