from typing import Literal

Terms = Literal["Net 15", "Net 30"]

DAYS: dict[Terms, int] = {"Net 15": 15, "Net 30": 30}

def days(terms: Terms) -> int:
    return DAYS[terms]

print(days("Net 30"))
print(days("Net 10"))
