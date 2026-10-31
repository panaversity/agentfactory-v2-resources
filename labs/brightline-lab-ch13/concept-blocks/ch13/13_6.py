names = {"V001": "Midwest Packaging Co.", "V005": "Hocking Valley Pallets"}
open_invoices = [
    {"vendor_id": "V005", "cents": 735000},
    {"vendor_id": "V001", "cents": 482500},
    {"vendor_id": "V002", "cents": 61875},
]
total = sum(inv["cents"] for inv in open_invoices)
print(names["V005"], total)
print(names.get("V099"))
print(sorted(inv["cents"] for inv in open_invoices))
print(names["V099"])
