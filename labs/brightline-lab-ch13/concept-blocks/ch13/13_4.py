invoices = [
    {"number": "INV-8301", "status": "open", "due": "2027-03-03"},
    {"number": "INV-8309", "status": "paid", "due": "2027-02-28"},
    {"number": "INV-8305", "status": "open", "due": ""},
]
open_invoices = [inv for inv in invoices if inv["status"] == "open"]
for inv in open_invoices:
    due = inv["due"] or "from the terms"
    print(inv["number"], due)
print(bool(""), bool([]))
