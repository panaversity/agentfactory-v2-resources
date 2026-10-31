"""Reads a simple CSV export into records keyed by the header row.

The exports have no quoted fields and no commas inside values.
"""

Row = dict[str, str]


def read_rows(csv: str) -> list[Row]:
    lines = [line.split(",") for line in csv.strip().splitlines()]
    header, cells = lines[0], lines[1:]
    return [dict(zip(header, row)) for row in cells]
