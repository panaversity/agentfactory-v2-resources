invoices = [
    ["INV-8301", "open", "2027-03-03"],
    ["INV-8309", "paid", "2027-02-28"],
    ["INV-8305", "open", ""],
]

cutoff = "2027-03-05"
for inv in invoices:
    if inv[1] == "open" and inv[2] <= cutoff:
        due = inv[2] or "from the terms"
        print(inv[0] + " " + due)
