"""Make the practice files for the section "Build Something" of The AI Agent Factory, Second Edition.

python3 tools/brightline-practice-build-something/make-files.py             (from the repository's root)
python3 tools/brightline-practice-build-something/make-files.py --expected  (also print what the pages quote)

Reads the three files in source/ and writes practice/brightline-practice-build-something/. The
source files are a class's practice set, kept here exactly as it was received on November 17, 2026.
Four things change on the way, each so the files agree with the Brightline the rest of the book
describes. To get the class's own files back, set SCALE to (1, 1) and empty RENAME and WORDING.

1. Every amount in the budget file is multiplied by SCALE. As received, the eight departments cost
   $2,280,500 in a quarter for which the notes give sales of $4.82m at a gross margin of 21.4%: a
   gross profit of about $1.03m. Scaled, they cost $684,150, and every percentage stays the same.
2. Two people get new names (RENAME). The book already has a Tom in Purchasing, a Tom at a vendor,
   and a vendor called Lena Park.
3. "The finance director" becomes "the owner" (WORDING). The book's Brightline has a controller and
   an owner, and no finance director.
4. Dates and spelling follow the book: "October 9", "colors".

One amount in the budget file is a typing mistake on purpose: IT's August actual has one zero too
many. The Sheets page asks the reader to find it. Do not correct it here.
Every name and number in these files is invented."""
import csv, io, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "source"
OUT = HERE.parents[1] / "practice" / "brightline-practice-build-something"

SCALE = (3, 10)                                   # multiply by 3, divide by 10
RENAME = {"Lena": "Nina", "Tom": "Ivan"}
WORDING = [
    ("Needs the finance director's OK.", "Needs the owner's OK."),
    ("to the finance director by", "to the owner by"),
    ("Friday 9 October 2026", "Friday, October 9, 2026"),
    ("Friday 15 January 2027", "Friday, January 15, 2027"),
]
TYPO = ("IT", "Aug actual")                       # the planted mistake: ten times too big
MONTHS = ("Jul", "Aug", "Sep")


def scale(amount):
    up, down = SCALE
    scaled, rest = divmod(int(amount) * up, down)
    assert rest == 0, f"{amount} does not scale to a whole dollar"
    return scaled


def swap(text, old, new, times=1):
    assert text.count(old) == times, f"expected {times} of {old!r}, found {text.count(old)}"
    return text.replace(old, new)


def budget():
    rows = list(csv.DictReader((SOURCE / "budget_actual_q3.csv").read_text().splitlines()))
    for row in rows:
        row["Owner"] = RENAME.get(row["Owner"], row["Owner"])
        for key in row:
            if key.endswith(("budget", "actual")):
                row[key] = scale(row[key])
    return rows


def quarter(row, kind, fixed=True):
    total = sum(row[f"{m} {kind}"] for m in MONTHS)
    if fixed and kind == "actual" and row["Department"] == TYPO[0]:
        total += row[TYPO[1]] // 10 - row[TYPO[1]]
    return total


def notes(rows):
    text = (SOURCE / "q3_review_notes.txt").read_text()
    logistics = next(r for r in rows if r["Department"] == "Logistics")
    text = swap(text, "$424,800 vs budget $360,000",
                f"${quarter(logistics, 'actual'):,} vs budget ${quarter(logistics, 'budget'):,}")
    for old, new in WORDING:
        text = swap(text, old, new)
    for old, new in RENAME.items():
        text, count = re.subn(rf"\b{old}\b", new, text)
        assert count >= 3, f"{old} was named {count} times"
    # The rest of the dates: "31 October" becomes "October 31", as the book writes them.
    return re.sub(r"\b(\d{1,2}) (October|November)\b", r"\2 \1", text)


def main():
    rows = budget()
    out = io.StringIO()
    writer = csv.DictWriter(out, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "budget_actual_q3.csv").write_text(out.getvalue())
    (OUT / "q3_review_notes.txt").write_text(notes(rows))
    brand = (SOURCE / "brand_note.txt").read_text()
    (OUT / "brand_note.txt").write_text(swap(brand, "Colours", "Colors"))

    # The checks: what the notes say, the planted mistake, and that nothing else is far off budget.
    it = next(r for r in rows if r["Department"] == TYPO[0])
    assert it[TYPO[1]] % 10 == 0 and it[TYPO[1]] > 5 * it["Jul actual"], "the planted mistake is gone"
    for r in rows:
        over = quarter(r, "actual") / quarter(r, "budget") - 1
        assert (over > 0.05) == (r["Department"] == "Logistics"), f"{r['Department']} is {over:.1%} over"
    print(f"wrote 3 files to {OUT.relative_to(HERE.parents[1])}")

    if "--expected" in sys.argv:
        print(f"\n{'Department':<16}{'Q3 budget':>11}{'Q3 actual':>11}{'difference':>12}{'percent':>9}")
        for r in rows + [None]:
            name = r["Department"] if r else "All eight"
            b = quarter(r, "budget") if r else sum(quarter(x, "budget") for x in rows)
            a = quarter(r, "actual") if r else sum(quarter(x, "actual") for x in rows)
            print(f"{name:<16}{b:>11,}{a:>11,}{a - b:>+12,}{(a - b) / b:>+9.1%}")
        unfixed = sum(quarter(x, "actual", fixed=False) for x in rows)
        it_unfixed = quarter(it, "actual", fixed=False)
        print(f"\nThe mistake: IT, {TYPO[1]}, {it[TYPO[1]]:,} should be {it[TYPO[1]] // 10:,}")
        print(f"Without the fix: total actual {unfixed:,}; IT {it_unfixed:,}, "
              f"{it_unfixed / quarter(it, 'budget') - 1:+.0%} against its budget")
        logistics = next(r for r in rows if r["Department"] == "Logistics")
        print("Logistics over budget by month: "
              + ", ".join(f"{m} {logistics[f'{m} actual'] - logistics[f'{m} budget']:,}" for m in MONTHS))


if __name__ == "__main__":
    main()
