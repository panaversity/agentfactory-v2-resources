#!/usr/bin/env bash
# Authors only. Clone the reference bundle and check each tag from scratch: ch18, lab19-start, ch19.
# Usage: verify-tags.sh <brightline-ap.bundle> <local-neon.sh>   (a local Postgres 16+ with pgvector, as root)
set -u
# macOS copy: see env-macos.sh (PATH shims, TAP reporter, TMPDIR). Run it as an ordinary user, not root.
. "$(dirname "$0")/env-macos.sh"
BUNDLE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"; NEONLIKE="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"; FAIL=0
ok() { echo "PASS $1"; }; no() { echo "FAIL $1"; FAIL=$((FAIL+1)); }
count() { grep -E "^# $1" | awk '{print $3}'; }
export WRANGLER_SEND_METRICS=false
echo "verify-tags: $(date -u +%Y-%m-%dT%H:%MZ), node $(node -v), $(uv --version)"
(V=$(mktemp -d); cd "$V" && git init -q && git bundle verify -q "$BUNDLE" >/dev/null 2>&1; r=$?; rm -rf "$V"; exit $r) && ok "bundle verifies; tags: $(git bundle list-heads "$BUNDLE" | grep tags | sed 's#.*refs/tags/##' | tr '\n' ' ')" || no "bundle"
for TAG in ch18 lab19-start ch19; do
  D=$(mktemp -d); git clone -q "$BUNDLE" "$D/r" 2>/dev/null || exit 2
  cd "$D/r" && git checkout -q "$TAG" || exit 2
  npm ci --silent >/dev/null 2>&1; (cd py && uv sync -q --locked >/dev/null 2>&1); npm run -s keys >/dev/null 2>&1
  if [ "$TAG" = ch19 ]; then
    bash "$NEONLIKE" brightline_verify >/dev/null 2>&1; umask 077
    printf 'DATABASE_URL_OWNER=postgresql://neondb_owner:owner-local-only@127.0.0.1:5432/brightline_verify\n' > .secrets/db.dev.env
    printf 'AP_EMBEDDINGS=test\n' > .secrets/embeddings.env
    npm run -s db:migrate >/dev/null && npm run -s db:passwords >/dev/null
    for c in "org_brightline data" "org_cedar data-cedar" "org_conformance data-conformance"; do set -- $c; npm run -s tenant:load -- --company "$1" --folder "$2" >/dev/null; done
  fi
  S=$(npm run -s test:servers 2>&1); SP=$(echo "$S" | count pass); SF=$(echo "$S" | count fail)
  P=$(npm run -s test:py 2>&1 | tail -1)
  echo "     $TAG: $SP connector tests ($SF failed), Python: $P"
  [ "$SF" = 0 ] && echo "$P" | grep -q passed && ! echo "$P" | grep -q failed && ok "$TAG: connector and Python tests" || no "$TAG: tests"
  npm run -s typecheck >/dev/null 2>&1 && npm run -s check:py >/dev/null 2>&1 && ok "$TAG: typecheck and Pyright strict" || no "$TAG: type checks"
  C=$(npm run -s conformance 2>&1 | tail -1); echo "$C" | grep -q " 0 failed" && ok "$TAG: $C" || no "$TAG: conformance ($C)"
  DP=$(npm run -s check:deploy 2>&1 | grep 'settings checks'); echo "$DP" | grep -q " 0 failed" && ok "$TAG: $DP" || no "$TAG: check:deploy"
  bash scripts/check-no-secret-output.sh >/dev/null && [ -z "$(git ls-files | grep -E '\.dev\.vars$|\.secrets/')" ] && ok "$TAG: no secrets in tracked files" || no "$TAG: secrets"
  if [ "$TAG" = lab19-start ]; then
    [ ! -d db ] && [ -f docs/chapter-19/19.3.md ] && [ -f exercises/3nf/docs_flat.sql ] && [ -f data-cedar/settings.csv ] && git merge-base --is-ancestor ch18 lab19-start && ok "lab19-start: ch18 plus the starting data, the exercise and docs/chapter-19, no db/" || no "lab19-start: starting files"
  fi
  if [ "$TAG" = ch19 ]; then
    R=$(npm run -s check:roles 2>&1 | tail -1); echo "$R" | grep -q passed && ok "ch19: $R" || no "ch19: check:roles"
    Q=$(npm run -s check:queries 2>&1 | tail -1); echo "$Q" | grep -q passed && ok "ch19: $Q" || no "ch19: check:queries"
    M=$(timeout 300 npm run -s matrix:data 2>&1 | tail -1); echo "$M" | grep -q "25 rows passed, 0 failed" && ok "ch19: $M" || no "ch19: $M"
    E=$(npm run -s eval:retrieval 2>&1 | tail -1); echo "$E" | grep -q passed && ok "ch19: $E" || no "ch19: $E"
    git merge-base --is-ancestor lab19-start ch19 && ok "ch19: lab19-start is in its history" || no "ch19: history"
  fi
  cd /; rm -rf "$D"
done
echo "FAILURES: $FAIL"
exit $FAIL
