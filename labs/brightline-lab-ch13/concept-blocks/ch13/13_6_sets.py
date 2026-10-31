ids = ["INV-8301", "INV-8305", "INV-8301", "INV-8312"]
unique = set(ids)
print(len(unique), "INV-8305" in unique)
print(ids[0:2], ids[-1:])
pair = ("V005", 735000)
vendor_id, cents = pair
print(vendor_id, cents)
pair[1] = 0
