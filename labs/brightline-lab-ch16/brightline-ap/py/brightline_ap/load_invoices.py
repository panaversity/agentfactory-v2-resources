import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

from pydantic import ValidationError

from brightline_ap.data import read_data, records
from brightline_ap.schemas import InvoiceModel


@dataclass(frozen=True)
class RowError:
    line: int
    number: str
    message: str


@dataclass
class LoadResult:
    valid: list[InvoiceModel] = field(default_factory=list[InvoiceModel])
    errors: list[RowError] = field(default_factory=list[RowError])


def _cents(text: str) -> int | str:
    return int(text) if re.fullmatch(r"-?\d+", text) else text


def load_invoices(csv: str, vendor_ids: set[str]) -> LoadResult:
    result = LoadResult()
    for i, r in enumerate(records(csv)):
        line = i + 2
        number = r.get("invoice_number", "")
        try:
            inv = InvoiceModel.model_validate(
                {
                    "number": number,
                    "vendor_id": r.get("vendor_id"),
                    "invoice_date": r.get("invoice_date"),
                    "due_date": r.get("due_date"),
                    "terms": r.get("terms"),
                    "amount_cents": _cents(r.get("amount_cents", "")),
                    "status": r.get("status"),
                }
            )
        except ValidationError as e:
            message = "; ".join(f"{'.'.join(str(p) for p in err['loc'])} {err['msg']}" for err in e.errors())
            result.errors.append(RowError(line, number, message))
            continue
        if inv.vendor_id not in vendor_ids:
            result.errors.append(RowError(line, number, f"vendor_id {inv.vendor_id} is not in vendors.csv"))
        else:
            result.valid.append(inv)
    return result


def vendor_ids() -> set[str]:
    return {v["vendor_id"] for v in records(read_data("vendors.csv"))}


if __name__ == "__main__":
    res = load_invoices(Path(sys.argv[1]).read_text(encoding="utf-8"), vendor_ids())
    for e in res.errors:
        print(f"line {e.line}  {e.number}  {e.message}")
    print(f"{len(res.valid)} valid, {len(res.errors)} errors")
    sys.exit(1 if res.errors else 0)
