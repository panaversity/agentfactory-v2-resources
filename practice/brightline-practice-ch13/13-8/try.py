line = "INV-8301,V001,open\r"
parts = line.split(",")
print(parts[2] == "open")
