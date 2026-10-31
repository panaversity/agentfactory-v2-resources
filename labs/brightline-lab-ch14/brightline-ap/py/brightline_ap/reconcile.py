"""Compares each stated due_date with the one computed from the terms.

Run from py/: uv run python -m brightline_ap.reconcile ../data/invoices.csv
"""

import sys
from pathlib import Path

from brightline_ap.csv_rows import read_rows
from brightline_ap.due_date import due_date


def reconcile(csv: str) -> list[dict[str, str]]:
    mismatches: list[dict[str, str]] = []
    for row in read_rows(csv):
        stated = row["due_date"]
        if stated == "":
            continue  # nothing stated, nothing to compare
        computed = due_date(row["invoice_date"], row["terms"])
        if stated != computed:
            mismatches.append(
                {"invoice": row["invoice_number"], "stated": stated, "computed": computed}
            )
    return mismatches

if __name__ == "__main__":
    file = sys.argv[1] if len(sys.argv) > 1 else "../data/invoices.csv"
    found = reconcile(Path(file).read_text(encoding="utf-8"))
    for m in found:
        print(f"{m['invoice']}  stated {m['stated']}  computed {m['computed']}")
    print(f"{len(found)} mismatches in {file}")
