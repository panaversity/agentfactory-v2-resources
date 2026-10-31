with open("data/vendors.csv", encoding="utf-8") as f:
    header = f.readline().strip()
print(header)
print(f.closed)
