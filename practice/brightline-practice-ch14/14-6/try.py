rows = [
    {"number": "INV-8301", "amount": 482500, "terms": "Net 30"},
    {"number": "INV-8304", "amount": -23450, "terms": "Net 30"},
    {"number": "INV-8306", "amount": 158200, "terms": "Net 10"},
]

errors: list[str] = []

for row in rows:
    if row["amount"] < 0:
        errors.append(row["number"] + " amount must be zero or more")
    if row["terms"] != "Net 15" and row["terms"] != "Net 30":
        errors.append(row["number"] + " terms must be one of the known terms")

for error in errors:
    print(error)
print(len(errors), "errors")
