#!/usr/bin/env python3
"""Move a lab's check numbers up, to make room for a new check.

Run from the labs repository's root:

  python3 tools/renumber-checks.py labs/brightline-lab-ch05 --after 10 --total 26 --dry-run
  python3 tools/renumber-checks.py labs/brightline-lab-ch05 --after 10 --total 26

Every check numbered above --after moves up by --by, and every total ("of
the lab's 26", "after the lab's 26", "the lab's 30 scored checks") grows by
--by. It changes three kinds of text, and nothing else:

- in answer-key/task-*.md, the "carries" line and the numbered checks under
  "## The checks" or "## The check"
- in LAB.md, the "**Checkpoint.**" lines
- in the book's lab page too, when you pass --book-page <path>. Pass it:
  LAB.md is only a copy of that page, and the next copy would undo the change

--total is the lab's total today, as its keys state it ("of the lab's 26").
The tool stops when the keys state another total, so a second run by mistake
changes nothing.

Run it once for each new check, from the last new check backward, then add
the new check's text by hand. It prints every line it changes. Part keys
such as task-f1.md and task-h1.md keep their own numbering and are skipped.
"""

import argparse
import pathlib
import re
import sys

NUM = re.compile(r"\d+")


def bump_numbers(text, after, by):
    """Raise every whole number above `after` in `text` by `by`."""
    return NUM.sub(lambda m: str(int(m.group()) + by) if int(m.group()) > after else m.group(), text)


def bump_totals(line, by):
    """Raise the lab's total, wherever the line states it."""
    line = re.sub(r"(of the lab's |after the lab's |the lab's )(\d+)",
                  lambda m: m.group(1) + str(int(m.group(2)) + by), line)
    return line


def fix_carries(line, after, by):
    """'Task 7 carries checks 13 and 14 of the lab's 26.' and its variants."""
    m = re.match(r"(Task \w+ (?:is optional\. It )?carries checks? )([\d ,andto]+?)((?:,| of| after|\.).*)$", line)
    if not m:
        return line
    head, nums, tail = m.groups()
    return head + bump_numbers(nums, after, by) + bump_totals(tail, by)


def process_key(path, after, by):
    lines = path.read_text().split("\n")
    out, in_checks, changed = [], False, []
    for line in lines:
        new = line
        if line.startswith("## "):
            in_checks = line.strip() in ("## The checks", "## The check")
        elif " carries check" in line:
            new = fix_carries(line, after, by)
            if "lab's" in line and new == line:
                new = bump_totals(line, by)
        elif in_checks:
            m = re.match(r"^(\d+)(\. \*\*.*)$", line)
            if m and int(m.group(1)) > after:
                new = str(int(m.group(1)) + by) + m.group(2)
        if new != line:
            changed.append((line, new))
        out.append(new)
    return "\n".join(out), changed


def process_page(path, after, by):
    lines = path.read_text().split("\n")
    out, changed = [], []
    for line in lines:
        new = line
        if line.startswith("**Checkpoint.**"):
            m = re.match(r"(\*\*Checkpoint\.\*\* Checks? )([\d ,andto]+)(.*)$", line)
            if m:
                new = m.group(1) + bump_numbers(m.group(2), after, by) + m.group(3)
        if new != line:
            changed.append((line, new))
        out.append(new)
    return "\n".join(out), changed


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("lab", help="the lab's folder, such as labs/brightline-lab-ch05")
    ap.add_argument("--after", type=int, required=True, help="the last check number that stays as it is")
    ap.add_argument("--by", type=int, default=1, help="how many new checks go in after it (default 1)")
    ap.add_argument("--total", type=int, required=True, help="the lab's total today, as its keys state it")
    ap.add_argument("--book-page", help="the book's lab page, such as ../agentfactory-v2/knowledge/.../lab.md")
    ap.add_argument("--dry-run", action="store_true", help="print the changes, write nothing")
    a = ap.parse_args()

    lab = pathlib.Path(a.lab)
    keys = sorted(lab.glob("answer-key/task-*.md"))
    keys = [k for k in keys if re.fullmatch(r"task-\d+\.md", k.name)]
    if not keys:
        sys.exit(f"No answer keys in {lab}/answer-key/")
    if a.by < 1:
        sys.exit("--by must be 1 or more")

    # The keys must state the total this run expects. After a run they state the new total,
    # so running the same command twice stops here.
    stated = set()
    for k in keys:
        stated.update(int(n) for n in re.findall(r"(?:of the lab's |after the lab's |the lab's )(\d+)", k.read_text()))
    if stated != {a.total}:
        sys.exit(f"The keys state a total of {', '.join(str(n) for n in sorted(stated)) or 'nothing'}, not {a.total}. "
                 "Nothing was changed. Was this check already renumbered?")

    work = [(k, process_key) for k in keys] + [(lab / "LAB.md", process_page)]
    if a.book_page:
        work.append((pathlib.Path(a.book_page), process_page))

    total = 0
    for path, fn in work:
        if not path.exists():
            print(f"skip: {path} not found")
            continue
        text, changed = fn(path, a.after, a.by)
        for old, new in changed:
            print(f"{path}:\n  - {old}\n  + {new}")
        total += len(changed)
        if changed and not a.dry_run:
            path.write_text(text)
    print(f"{total} line(s) {'would change' if a.dry_run else 'changed'}.")

    # Prose that names a check by number, such as "Why check 26." or
    # "every check through Check 26", is not changed. List it for a person.
    prose = re.compile(r"\b[Cc]hecks? (\d+)")
    hand = []
    for path, _ in work:
        if not path.exists():
            continue
        for n, line in enumerate(path.read_text().split("\n"), 1):
            if " carries check" in line or line.startswith("**Checkpoint.**") or re.match(r"^\d+\. \*\*", line):
                continue
            if any(int(m.group(1)) > a.after for m in prose.finditer(line)):
                hand.append(f"{path}:{n}: {line.strip()[:120]}")
    if hand:
        print("\nCheck these by hand. They name a check number in prose:")
        print("\n".join(hand))


if __name__ == "__main__":
    main()
