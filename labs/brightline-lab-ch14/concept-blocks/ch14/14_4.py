import sys
from pathlib import Path

# The repository beside this folder, as in the lab download.
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "brightline-ap" / "py"))

from pydantic import ValidationError  # noqa: E402

from brightline_ap.schemas import InvoiceModel  # noqa: E402

inv_8310: dict[str, str | int] = {
    "number": "INV-8310", "vendor_id": "V003", "invoice_date": "2027-02-08", "due_date": "",
    "terms": "Net 30", "amount_cents": 870000, "status": "open",
}

try:
    InvoiceModel.model_validate({**inv_8310, "invoice_date": "2026-13-02", "terms": "Net 10"})
except ValidationError as err:
    for e in err.errors():
        print(e["loc"], e["msg"])
