#!/bin/bash
# Run the 14 concept blocks against the lab's dev database and save each block's real output next to its SQL,
# ready for check-page-outputs.py.
# Usage: run-blocks.sh <lab folder, after simulate-ours.sh has loaded the database> <output folder>
#   then: python3 -I check-page-outputs.py <output folder> <page.md> [<page.md> ...]
# Fresh passwords are written first, because verify-ours.sh rotates the shared roles' passwords.
# Block 11's plan depends on whether Postgres has statistics for policy_passages yet: a freshly loaded table gives the
# plan the page prints (an index scan on the key), an analyzed one gives a sequential scan.
set -euo pipefail
LAB="$(cd "$1" && pwd)"; mkdir -p "$2"; OUT="$(cd "$2" && pwd)"
. "$(dirname "$0")/env-macos.sh"
cd "$LAB/brightline-ap"
npm run -s db:passwords >/dev/null
cp ../concept-blocks/sql/[01]*.sql "$OUT"/
for f in ../concept-blocks/sql/[01]*.sql; do
  b="$(basename "$f" .sql)"
  node ../concept-blocks/sql/run.mjs "$f" > "$OUT/$b.out" 2>&1
done
echo "wrote $(ls "$OUT"/*.out | wc -l) block outputs to $OUT"
