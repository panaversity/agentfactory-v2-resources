invoices = [
    ["INV-8301", "open", "2027-03-03"],
    ["INV-8309", "paid", "2027-02-28"],
    ["INV-8305", "open", ""],
]

for inv in invoices:
    if inv[1] == "open":
        print(inv[0])
