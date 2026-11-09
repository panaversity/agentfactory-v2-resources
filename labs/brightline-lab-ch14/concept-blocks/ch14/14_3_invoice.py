class Invoice:
    def __init__(self, number: str, cents: int) -> None:
        self.number = number
        self.cents = cents

    def needs_second_approver(self) -> bool:
        return self.cents > 1000000

first = Invoice("INV-8301", 482500)
second = Invoice("INV-8303", 1290000)
print(first.number, first.needs_second_approver())
print(second.number, second.needs_second_approver())
