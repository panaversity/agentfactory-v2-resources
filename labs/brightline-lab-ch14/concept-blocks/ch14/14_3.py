import sys
from pathlib import Path

# The repository beside this folder, as in the lab download.
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "brightline-ap" / "py"))

from brightline_ap.invoice import Invoice  # noqa: E402
from brightline_ap.invoice_book import InvoiceBook  # noqa: E402
from brightline_ap.vendor import Vendor, VendorDirectory  # noqa: E402

hocking_valley = Vendor(id="V005", name="Hocking Valley Pallets", terms="Net 30")
inv_8305 = Invoice("INV-8305", "V005", "2027-02-03", None, "Net 30", 735000, "open")
inv_8313 = Invoice("INV-8313", "V005", "2027-01-27", "2027-02-26", "Net 30", 510000, "paid")

book = InvoiceBook([inv_8305, inv_8313], VendorDirectory([hocking_valley]))
print(len(book.open()), book.open_total_cents(), book.due_by("2027-03-05")[0].vendor)
