import sys
from pathlib import Path

# The repository beside this folder, as in the lab download.
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "brightline-ap" / "py"))

from brightline_ap.due_date import due_date  # noqa: E402
from brightline_ap.money import usd  # noqa: E402

print(usd(1922953), due_date("2026-10-07", "Net 30"))
