import sys
sys.path.insert(0, "../../brightline-ap/py")
from brightline_ap.due_date import due_date

assert due_date("2026-10-07", "Net 30") == "2026-11-06"
print("first assert passed")
assert due_date("2026-10-07", "Net 30") == "2026-11-07", "Net 30 from Oct 7"
print("second assert passed")
