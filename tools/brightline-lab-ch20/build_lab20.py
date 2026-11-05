"""Build Lab 20's starting folder on our Lab 19's end state.

    python3 -I build_lab20.py base <lab19 folder> <out brightline-ap>
    python3 -I build_lab20.py overlay <his lab20-start checkout> <out brightline-ap>

base:    our released Lab 19 folder's brightline-ap/, with its answer-key/files/ laid over it and the two
         files Lab 19's finish deletes removed: Lab 19's end state, as a reader who finished it has it.
overlay: the editor-in-chief's lab20-start files (his zip is an overlay, not a ch19 history), with the
         week moved as C58 (+119 days, INV-51NN to INV-83NN; his story dates are all in December 2026, and
         every real-world date, API versions, beta names and check dates, is on or before November 5,
         2026, so only dates from 2026-11-15 to 2027-01-31 move) and Ana Torres as Ana Morales. Then the
         files both repositories have are taken from merged/, written by hand from both sides.

His files that do not come over as they are:
  - package-lock.json: made again by npm from the merged package.json
  - py/requirements.txt: his pins go into Lab 19's uv project (py/pyproject.toml, py/uv.lock)
  - opencode.json: his rules join Lab 19's opencode.jsonc (OpenCode 2's format)
  - docs/chapter-20/: written from the book's pages by make_docs_20.py
  - tests/*.test.ts: renamed *.spec.ts, so Lab 19's `node --test "tests/**/*.test.ts"` never loads a vitest file
"""
import datetime as dt
import pathlib
import re
import shutil
import sys

HERE = pathlib.Path(__file__).resolve().parent
SHIFT = dt.timedelta(days=119)
MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
LO, HI = dt.date(2026, 11, 15), dt.date(2027, 1, 31)
DELETED_BY_LAB19 = ["servers/ap-ts/scripts/copy-assets.ts", "servers/ap-ts/src/data.ts"]
NOT_COPIED = {"package-lock.json", "py/requirements.txt", "opencode.json"}
NOT_COPIED_PREFIX = ("docs/chapter-20/",)
MERGED = {".claude/settings.json", ".codex/config.toml", ".gitignore", "AGENTS.md", "README.md", "package.json",
          "py/pyproject.toml", "opencode.jsonc", "vitest.config.ts", "py/pyrightconfig.loop.json", "tsconfig.json"}


def files(root):
    return sorted(p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file() and ".git" not in p.parts)


def move(m):
    d = dt.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    if not (LO <= d <= HI):
        return m.group(0)
    return (d + SHIFT).isoformat()


def move_long(m):
    wd, mon, day, year = m.group(1), m.group(2), int(m.group(3)), int(m.group(4))
    d = dt.date(year, MONTHS.index(mon) + 1, day)
    if not (LO <= d <= HI):
        return m.group(0)
    d += SHIFT
    s = f"{MONTHS[d.month - 1]} {d.day}, {d.year}"
    return (f"{DAYS[d.weekday()]}, " if wd else "") + s


def week(text):
    text = re.sub(r"INV-51(\d\d)", r"INV-83\1", text)
    text = text.replace("Ana Torres, AP lead", "Ana Morales, AP analyst").replace("Ana Torres", "Ana Morales")
    text = re.sub(r"(?<!\d)(20\d\d)-(\d\d)-(\d\d)(?![\dT])", move, text)
    text = re.sub(r"(?:(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), )?(" + "|".join(MONTHS) + r") (\d{1,2}), (20\d\d)", move_long, text)
    return text


def base(lab19, out):
    if out.exists():
        shutil.rmtree(out)
    shutil.copytree(lab19 / "brightline-ap", out)
    fin = lab19 / "answer-key" / "files"
    for rel in files(fin):
        d = out / rel
        d.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(fin / rel, d)
    for rel in DELETED_BY_LAB19:
        p = out / rel
        assert p.exists(), rel
        p.unlink()
    for p in out.rglob(".DS_Store"):
        p.unlink()
    print(f"base: {len(files(out))} files (Lab 19's start, its {len(files(fin))} finished files laid over, {len(DELETED_BY_LAB19)} removed)")


def overlay(his, out):
    have = set(files(out))
    added, merged_his, skipped = [], [], []
    for rel in files(his):
        if rel in NOT_COPIED or rel.startswith(NOT_COPIED_PREFIX):
            skipped.append(rel)
            continue
        if rel in MERGED:
            merged_his.append(rel)
            continue
        target = rel
        if re.fullmatch(r"tests/[^/]+\.test\.ts", rel):
            target = rel[: -len(".test.ts")] + ".spec.ts"
        src = his / rel
        if target in have and src.read_bytes().strip() == b"":
            skipped.append(rel + " (empty, Lab 19's kept)")
            continue
        assert target not in have, f"{target} is in Lab 19 too: merge it by hand"
        dst = out / target
        dst.parent.mkdir(parents=True, exist_ok=True)
        try:
            dst.write_text(week(src.read_text(encoding="utf-8")), encoding="utf-8")
        except UnicodeDecodeError:
            shutil.copy2(src, dst)
        added.append(target)
    for rel in sorted(MERGED):
        src = HERE / "merged" / rel
        assert src.exists(), f"merged/{rel} is missing"
        dst = out / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
    print(f"overlay: {len(added)} of his files added (week moved), {len(merged_his)} taken from merged/, {len(skipped)} not copied")
    for rel in skipped:
        print("  not copied:", rel)


if __name__ == "__main__":
    stage, src, out = sys.argv[1], pathlib.Path(sys.argv[2]), pathlib.Path(sys.argv[3])
    {"base": base, "overlay": overlay}[stage](src, out)
