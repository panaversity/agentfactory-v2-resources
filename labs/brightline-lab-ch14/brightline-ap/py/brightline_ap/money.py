def usd(cents: int) -> str:
    """Whole cents to dollars with integer math, for example 735000 -> $7,350.00."""
    dollars, rest = divmod(cents, 100)
    return f"${dollars:,}.{rest:02d}"
