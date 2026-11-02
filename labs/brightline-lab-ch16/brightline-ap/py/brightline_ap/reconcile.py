import sys
from dataclasses import dataclass
from pathlib import Path

from brightline_ap.data import records
from brightline_ap.due_date import due_date, parse_terms


@dataclass(frozen=True)
class Mismatch:
    number: str
    stated: str
    computed: str


def reconcile(csv: str) -> list[Mismatch]:
    found: list[Mismatch] = []
    for r in records(csv):
        stated = r.get("due_date", "")
        if stated == "":
            continue
        computed = due_date(r["invoice_date"], parse_terms(r["terms"]))
        if computed != stated:
            found.append(Mismatch(r["invoice_number"], stated, computed))
    return found


if __name__ == "__main__":
    result = reconcile(Path(sys.argv[1]).read_text(encoding="utf-8"))
    for m in result:
        print(f"{m.number}  stated {m.stated}  computed {m.computed}")
    print(f"{len(result)} mismatches")
