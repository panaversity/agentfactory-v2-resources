"""Check the chain of sample Role Contracts that Part II's labs ship, for The AI Agent Factory, Second Edition.

python3 tools/contract-chain/check.py           (from the repository's root)
python3 tools/contract-chain/check.py --write   (writes each shipped draft from its source and cuts)

Each lab that changes the contract ships the previous lab's finished sample (rule 6 of the book's
docs/labs.md). tools/contract-chain/chain.json lists each shipped draft, its source, and the named
cuts between them, each an exact text replacement. The check applies the enabled cuts to the source
and fails, printing the difference, if the shipped draft differs in any other way, or if a cut's
text is not found exactly once."""
import difflib, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CHAIN = json.loads((Path(__file__).parent / "chain.json").read_text(encoding="utf-8"))
WRITE = "--write" in sys.argv[1:]

failed = False
for entry in CHAIN["entries"]:
    if not entry.get("enabled", True):
        continue
    text = (ROOT / entry["source"]).read_text(encoding="utf-8")
    for cut in entry["cuts"]:
        if not cut.get("enabled", True):
            continue
        if text.count(cut["before"]) != 1:
            print(f"{entry['name']}: the cut \"{cut['name']}\" is found {text.count(cut['before'])} times in "
                  f"{entry['source']}, not once.")
            failed = True
            continue
        text = text.replace(cut["before"], cut["after"])
    shipped = ROOT / entry["shipped"]
    if WRITE:
        shipped.write_text(text, encoding="utf-8")
        print(f"{entry['name']}: wrote {entry['shipped']}.")
        continue
    actual = shipped.read_text(encoding="utf-8") if shipped.exists() else ""
    if actual != text:
        failed = True
        print(f"{entry['name']}: {entry['shipped']} differs from {entry['source']} beyond its named cuts:")
        sys.stdout.writelines(difflib.unified_diff(
            text.splitlines(keepends=True), actual.splitlines(keepends=True),
            "source with the named cuts", entry["shipped"]))
    else:
        named = [c["name"] for c in entry["cuts"] if c.get("enabled", True)]
        print(f"{entry['name']}: matches its source, less {len(named)} named cuts.")
sys.exit(1 if failed else 0)
