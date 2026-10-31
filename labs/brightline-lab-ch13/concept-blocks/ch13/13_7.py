from datetime import date, timedelta

def add_days(iso_date: str, days: int) -> str:
    return (date.fromisoformat(iso_date) + timedelta(days=days)).isoformat()

print(add_days("2026-10-20", 15), add_days("2026-12-20", 30), add_days("2028-02-15", 15))
line = "INV-8301,V001,open\r"
print(line.split(",")[2] == "open", line.strip().split(",")[2] == "open")
