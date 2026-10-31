"""Lists Brightline's vendors with their payment terms."""

from pathlib import Path

from brightline_ap.due_date import terms_days

DATA = Path(__file__).resolve().parents[2] / "data"


def parse_vendors(csv: str) -> list[dict[str, str]]:
    lines = csv.strip().splitlines()[1:]
    vendors: list[dict[str, str]] = []
    for line in lines:
        vendor_id, name, terms = line.split(",")
        vendors.append({"id": vendor_id, "name": name, "terms": terms})
    return vendors


if __name__ == "__main__":
    text = (DATA / "vendors.csv").read_text(encoding="utf-8")
    by_days = sorted(parse_vendors(text), key=lambda v: terms_days(v["terms"]))
    for v in by_days:
        print(f"{v['id']}  {v['name']}  ({v['terms']})")
