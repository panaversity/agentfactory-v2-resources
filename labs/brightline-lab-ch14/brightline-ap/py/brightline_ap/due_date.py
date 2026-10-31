"""Computes an invoice's due date from its invoice date and payment terms."""

from datetime import date, timedelta

TERMS_DAYS: dict[str, int] = {
    "Due on receipt": 0,
    "Net 15": 15,
    "Net 30": 30,
    "Net 45": 45,
    "Net 60": 60,
}


def terms_days(terms: str) -> int:
    if terms not in TERMS_DAYS:
        raise ValueError(f"Unknown terms: {terms}")
    return TERMS_DAYS[terms]


def due_date(invoice_date: str, terms: str) -> str:
    """Dates are ISO text, such as "2027-03-05"."""
    return (date.fromisoformat(invoice_date) + timedelta(days=terms_days(terms))).isoformat()
