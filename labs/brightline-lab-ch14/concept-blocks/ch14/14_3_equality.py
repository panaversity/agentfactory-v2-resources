from dataclasses import dataclass


@dataclass
class Vendor:
    id: str
    name: str


class PlainVendor:
    def __init__(self, id: str, name: str) -> None:
        self.id = id
        self.name = name


a: Vendor = Vendor("V005", "Hocking Valley Pallets")
b: Vendor = Vendor("V005", "Hocking Valley Pallets")
print(a == b, a)
print(PlainVendor("V005", "Hocking Valley Pallets") == PlainVendor("V005", "Hocking Valley Pallets"))
