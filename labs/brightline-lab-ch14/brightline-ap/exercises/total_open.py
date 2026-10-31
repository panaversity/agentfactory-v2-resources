"""Totals the amounts of the open invoices, in cents.

An agent wrote this. Predict what it prints before you run it.
"""

from pathlib import Path

text = (Path(__file__).resolve().parents[1] / "data" / "invoices.csv").read_text(encoding="utf-8")
rows = [line.split(",") for line in text.strip().splitlines()[1:]]

total = 0
for row in rows:
    if row[6] == "open":
        total += int(row[5])
print(f"Open invoices total {total} cents")
