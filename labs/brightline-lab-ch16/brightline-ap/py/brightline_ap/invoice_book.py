from brightline_ap.due_date import due_date
from brightline_ap.schemas import InvoiceModel


class InvoiceBook:
    def __init__(self, invoices: list[InvoiceModel]) -> None:
        self._invoices = invoices

    def open(self) -> list[InvoiceModel]:
        return [i for i in self._invoices if i.status == "open"]

    def due_of(self, invoice: InvoiceModel) -> str:
        if invoice.due_date is not None:
            return invoice.due_date.isoformat()
        return due_date(invoice.invoice_date.isoformat(), invoice.terms)

    def due_by(self, cutoff: str) -> list[InvoiceModel]:
        return [i for i in self.open() if self.due_of(i) <= cutoff]

    def open_total_cents(self) -> int:
        return sum(i.amount_cents for i in self.open())
