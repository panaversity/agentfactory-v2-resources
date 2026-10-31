from dataclasses import dataclass

from brightline_ap.csv_rows import Row


@dataclass(frozen=True)
class Vendor:
    id: str
    name: str
    terms: str


def vendor_from_row(row: Row) -> Vendor:
    return Vendor(id=row["vendor_id"], name=row["vendor_name"], terms=row["terms"])


class VendorDirectory:
    """Looks up vendors by id."""

    def __init__(self, vendors: list[Vendor]) -> None:
        self._by_id = {v.id: v for v in vendors}

    def has(self, vendor_id: str) -> bool:
        return vendor_id in self._by_id

    def name(self, vendor_id: str) -> str:
        vendor = self._by_id.get(vendor_id)
        return vendor.name if vendor else f"Unknown vendor {vendor_id}"
