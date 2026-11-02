from pathlib import Path

DATA = Path(__file__).resolve().parent.parent.parent / "data"


def read_data(name: str) -> str:
    return (DATA / name).read_text(encoding="utf-8")


def records(text: str) -> list[dict[str, str]]:
    lines = text.strip().splitlines()
    header = lines[0].split(",")
    out: list[dict[str, str]] = []
    for line in lines[1:]:
        cells = line.split(",")
        out.append({name: (cells[i] if i < len(cells) else "") for i, name in enumerate(header)})
    return out
