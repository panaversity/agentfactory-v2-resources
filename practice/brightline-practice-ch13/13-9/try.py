from datetime import date, timedelta

def add_days(iso_date: str, days: int) -> str:
    start = date.fromisoformat(iso_date)
    end = start + timedelta(days=days)
    return end.isoformat()

print(add_days("2026-10-20", 15))
