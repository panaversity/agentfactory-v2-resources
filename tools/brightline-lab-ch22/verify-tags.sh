#!/usr/bin/env bash
# Lab 22: is the reader's lab22-start what it should be? His PUBLISH-README, item 2.
#
#   bash verify-tags.sh <the reader's brightline-ap, after Task 0's step 1> <labs/brightline-lab-ch21>
#
# - lab22-start exists and is the first commit, and the folder has nothing it does not track.
# - Lab 21's end state is all there, unchanged: every file of our released Lab 21 folder, with its answer key's
#   finished files laid over it, is at lab22-start with the same bytes, except the files Lab 22 merges into
#   (MERGED below), and each of those still holds Lab 21's own lines.
# - There are no end-of-sitting tags (lab22-sitting1 and so on): a plain folder carries none, and the lab
#   promises none (NOTES.md, D5).
set -u
REPO=$(cd "$1" && pwd)
LAB21=$(cd "$2" && pwd)
FAILS=0
say() { echo "$1"; }
bad() { echo "FAIL: $1"; FAILS=$((FAILS + 1)); }
MERGED=".claude/settings.json AGENTS.md README.md data-cedar/vendor-notes.csv opencode.jsonc package-lock.json package.json scripts/token-test.ts src/sdk/policy.ts"

cd "$REPO" || exit 1
[ "$(git rev-list --count HEAD)" = 1 ] || bad "lab22-start should be the only commit"
[ "$(git rev-parse lab22-start 2>/dev/null)" = "$(git rev-parse HEAD)" ] && say "lab22-start is the first commit" || bad "no lab22-start at HEAD"
[ -z "$(git tag -l 'lab22-sitting*')" ] && say "no end-of-sitting tags (none promised)" || bad "unexpected sitting tags"
untracked=$(git ls-files --others --exclude-standard | grep -v -E '^(node_modules|py/\.venv)/' | head -5)
[ -z "$untracked" ] && say "nothing in the folder is left out of lab22-start" || bad "files not in lab22-start: $untracked"

# Lab 21's end state: its folder, with its answer key's files laid over it.
BASE=$(mktemp -d)
cp -R "$LAB21/brightline-ap/." "$BASE/"
cp -R "$LAB21/answer-key/files/." "$BASE/"
same=0; changed=""
while IFS= read -r f; do
  rel=${f#"$BASE/"}
  case " $MERGED " in *" $rel "*) changed="$changed $rel"; continue;; esac
  if git cat-file -e "lab22-start:$rel" 2>/dev/null; then
    if git show "lab22-start:$rel" | cmp -s - "$f"; then same=$((same + 1)); else bad "Lab 21's $rel changed"; fi
  else
    bad "Lab 21's $rel is missing at lab22-start"
  fi
done < <(cd "$BASE" && find . -type f | sed "s|^\./|$BASE/|" | sort)
say "Lab 21's files unchanged at lab22-start: $same"

# Each merged file still holds every line Lab 21 had (Lab 22 only adds), except the three planned replacements.
for rel in $MERGED; do
  [ "$rel" = package-lock.json ] && continue
  missing=$(comm -23 <(sort -u "$BASE/$rel") <(git show "lab22-start:$rel" | sort -u))
  case "$rel" in
    src/sdk/policy.ts) expect=$(printf '%s\n' "// Rule 2, in plain words: an answer must cite at least one policy line, written as (file.md:N)." "export function citesPolicyLine(answer: string): boolean {" "  return /\\([a-z0-9-]+\\.md:\\d+\\)/i.test(answer);" | sort -u) ;;
    data-cedar/vendor-notes.csv) expect="V102,Ships same day for orders before noon." ;;   # one note per vendor: V102's grows
    package.json|.claude/settings.json) expect=$(printf '%s\n' "$missing" | grep -E '^[[:space:]]*"(typecheck:sdk:py|servers/auth|Bash\(npm run stream:demo\*\)|Bash\(npm run sdk\*\))' ) ;;
    *) expect="" ;;
  esac
  if [ "$(printf '%s' "$missing" | sort -u)" = "$(printf '%s' "$expect" | sort -u)" ]; then
    say "merged, Lab 21's lines kept: $rel"
  else
    bad "$rel lost Lab 21's lines: $(printf '%s' "$missing" | head -3 | tr '\n' '|')"
  fi
done
rm -rf "$BASE"
[ $FAILS -eq 0 ] && say "verify-tags: lab22-start is Lab 21's end state with Lab 22 added" || say "verify-tags: $FAILS problem(s)"
[ $FAILS -eq 0 ]
