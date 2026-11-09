from datetime import date, timedelta

TERMS_DAYS = {"Net 15": 15, "Net 30": 30}

def due_date(invoice_date: str, terms: str) -> str:
    return (date.fromisoformat(invoice_date) + timedelta(days=TERMS_DAYS[terms])).isoformat()
