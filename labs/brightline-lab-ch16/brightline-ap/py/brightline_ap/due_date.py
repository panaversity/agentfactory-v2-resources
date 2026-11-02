"""The one engine for due dates. Every script uses it."""

from datetime import date, timedelta
from typing import Literal, TypeGuard

Terms = Literal["Net 15", "Net 30", "Net 45", "Net 60", "Due on receipt"]

DAYS: dict[str, int] = {"Net 15": 15, "Net 30": 30, "Net 45": 45, "Net 60": 60, "Due on receipt": 0}


def is_terms(text: str) -> TypeGuard[Terms]:
    return text in DAYS


def parse_terms(text: str) -> Terms:
    if not is_terms(text):
        raise ValueError(f"Unknown terms: {text}")
    return text


def terms_days(terms: Terms) -> int:
    return DAYS[terms]


def due_date(invoice_date: str, terms: Terms) -> str:
    return (date.fromisoformat(invoice_date) + timedelta(days=terms_days(terms))).isoformat()


def pay_by(due: str) -> str:
    """Finance proposal: a Saturday or Sunday due date is paid on the Friday before."""
    d = date.fromisoformat(due)
    shift = {5: 1, 6: 2}.get(d.weekday(), 0)
    return (d - timedelta(days=shift)).isoformat()
