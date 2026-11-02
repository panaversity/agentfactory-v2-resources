import sys
from pathlib import Path

# The repository beside this folder, as in the lab download.
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "brightline-ap" / "py"))

from brightline_ap.vendor import Vendor, VendorDirectory  # noqa: E402

hocking_valley = Vendor(id="V005", name="Hocking Valley Pallets", terms="Net 30")
directory = VendorDirectory([hocking_valley])
print(directory.name("V005"))
print(directory.name("V099"))
