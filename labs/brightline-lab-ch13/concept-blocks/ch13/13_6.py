names: dict[str, str] = {"V001": "Midwest Packaging Co.", "V005": "Hocking Valley Pallets"}
print(names["V005"])
print(names.get("V099"))
cents: list[int] = [735000, 482500, 61875]
print(sorted(cents))
print(sorted(cents, key=str))
print(names["V099"])
