from datetime import date, timedelta

def add_days(iso_date: str, days: int) -> str:
    start = date.fromisoformat(iso_date)
    end = start + timedelta(days=days)
    return end.isoformat()

print(add_days("2026-10-20", 15), add_days("2026-12-20", 30), add_days("2028-02-15", 15))
line = "INV-8301,V001,open\r"
parts = line.split(",")
cleaned = line.strip().split(",")
print(parts[2] == "open", cleaned[2] == "open")
