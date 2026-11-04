#!/bin/bash
# Build what simulate-ours.sh and verify-ours.sh need from OUR lab folder and OUR Chapter 18 end state.
# Usage: make-ours.sh <our lab folder> <our Chapter 18 end state> <new output folder>
# It makes, inside the output folder:
#   brightline-lab-ch19/   the lab folder as the zip holds it (answer-key/task-*.md left out), with brightline-ap/
#                          put under git the way Task 0 asks: branch main, one commit "Start from the end of Chapter 18",
#                          tag lab19-start
#   ref/                   the reference repository: ch18 (the end state) -> lab19-start (the same tree as above)
#                          -> ch19 (that plus answer-key/files/, with the two deleted files removed)
#   brightline-ap.bundle   ref's main and its three tags
# The inputs are only read.
set -euo pipefail
LABSRC="$(cd "$1" && pwd)"; CH18="$(cd "$2" && pwd)"; OUT="$3"
[ ! -e "$OUT" ] || { echo "make-ours.sh: $OUT exists already; give a new folder" >&2; exit 2; }
mkdir -p "$OUT"; OUT="$(cd "$OUT" && pwd)"; LAB="$OUT/brightline-lab-ch19"; REF="$OUT/ref"
DELETED_AT_CH19="servers/ap-ts/scripts/copy-assets.ts servers/ap-ts/src/data.ts"   # listed in answer-key/README.md

# 1. the folder as the zip holds it, and Task 0's git steps
cp -R "$LABSRC" "$LAB"
rm -f "$LAB"/answer-key/task-*.md
( cd "$LAB/brightline-ap"
  [ ! -e .git ] || { echo "brightline-ap/ already has a .git" >&2; exit 2; }
  git init -q -b main
  git config user.name "Brightline Learner"; git config user.email "learner@brightline.example"   # this project only
  git add -A; git commit -q -m "Start from the end of Chapter 18"; git tag lab19-start )
START_TREE="$(git -C "$LAB/brightline-ap" rev-parse 'lab19-start^{tree}')"

# 2. the reference repository
mkdir -p "$REF"; cd "$REF"
git init -q -b main; git config user.name "Brightline Authors"; git config user.email "authors@brightline.example"
cp -R "$CH18"/. .                                         # commit 1: the Chapter 18 end state
git add -A; git commit -q -m "Chapter 18 end state"; git tag ch18
# commit 2: exactly the learner's starting tree. --no-tags: do not import the learner's repository's tag
git fetch -q --no-tags "$LAB/brightline-ap" refs/tags/lab19-start:refs/tmp/learner-start
C2="$(git commit-tree "$START_TREE" -p ch18 -m "Start from the end of Chapter 18")"
git update-ref -d refs/tmp/learner-start
git tag lab19-start "$C2"; git checkout -q -B main lab19-start
[ "$(git rev-parse 'lab19-start^{tree}')" = "$START_TREE" ] || { echo "lab19-start tree differs from the learner's" >&2; exit 1; }
# commit 3: the authors' finished files at their paths, the two deleted files removed
for f in $DELETED_AT_CH19; do [ -f "$f" ] || { echo "$f is not in the starting tree" >&2; exit 1; }; done
cp -R "$LAB/answer-key/files"/. .
git rm -q $DELETED_AT_CH19
git add -A; git commit -q -m "Chapter 19 reference work (answer-key/files, with copy-assets.ts and data.ts removed)"; git tag ch19
git bundle create "$OUT/brightline-ap.bundle" main ch18 lab19-start ch19 >/dev/null 2>&1
git bundle verify "$OUT/brightline-ap.bundle" >/dev/null 2>&1

echo "lab folder : $LAB"
echo "bundle     : $OUT/brightline-ap.bundle"
echo "lab19-start tree $START_TREE (the same in the learner's repository and in the bundle)"
echo "ch19 differs from lab19-start by: $(git diff --shortstat lab19-start ch19)"
