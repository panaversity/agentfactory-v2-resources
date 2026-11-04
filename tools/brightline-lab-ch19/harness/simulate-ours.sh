#!/usr/bin/env bash
# Authors only. The standalone test for Lab 19: from a fresh unzip of brightline-lab-ch19.zip, check the
# starting state, then play the agents' part with the reference branch from the authors' bundle, and run
# every local step of every task against a local Postgres shaped like a fresh Neon branch.
# Usage: simulate-lab.sh <unzipped folder> <brightline-ap.bundle> <local-neon.sh>
# Needs: Node, uv, a local Postgres 16+ with pgvector, run as root (for su postgres). Prints no secret.
set -u
# macOS copy: see env-macos.sh (PATH shims, TAP reporter, TMPDIR). Run it as an ordinary user, not root.
. "$(dirname "$0")/env-macos.sh"
LAB="$(cd "$1" && pwd)"; BUNDLE="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"; NEONLIKE="$(cd "$(dirname "$3")" && pwd)/$(basename "$3")"
N=0; FAIL=0
ok() { N=$((N+1)); echo "PASS $1"; }; no() { N=$((N+1)); FAIL=$((FAIL+1)); echo "FAIL $1"; }
check() { local what="$1"; shift; if "$@" >/dev/null 2>&1; then ok "$what"; else no "$what"; fi; }
count() { grep -E "^# $1" | awk '{print $3}'; }
export WRANGLER_SEND_METRICS=false
echo "simulate-lab: $(date -u +%Y-%m-%dT%H:%MZ), node $(node -v), $(uv --version), $(psql --version | head -1)"
cd "$LAB/brightline-ap" || exit 2

# --- The starting state ------------------------------------------------------------------------------
[ "$(git describe --tags --exact-match 2>/dev/null)" = lab19-start ] && [ "$(git branch --show-current)" = main ] && ok "start: repository at lab19-start, branch main" || no "start: lab19-start"
[ ! -d db ] && [ ! -f servers/ap-ts/src/db.ts ] && ! git rev-parse -q --verify ch19 >/dev/null && ok "start: no solution in the history ($(git rev-list --count HEAD) commits, tags: $(git tag | tr '\n' ' '))" || no "start: solution present"
[ -f ../LAB.md ] && [ -d ../answer-key ] && [ ! -d answer-key ] && ok "start: LAB.md and answer-key/ beside the repository, not inside it" || no "start: LAB.md or answer-key"
[ -f docs/chapter-19/19.3.md ] && [ -f docs/chapter-19/F7.md ] && [ -f exercises/3nf/docs_flat.sql ] && [ -f data-cedar/policies/manifest.csv ] && [ -f data-juniper/vendors.csv ] && ok "start: docs/chapter-19, exercises/3nf, Cedar Ridge's and Juniper's data" || no "start: starting files"

# --- Task 0: every check at the start ------------------------------------------------------------------
npm ci --silent >/dev/null 2>&1; (cd py && uv sync -q --locked >/dev/null 2>&1)
npm run -s keys >/dev/null 2>&1 && [ -z "$(git ls-files .secrets)" ] && ok "Task 0: npm run keys writes only ignored files" || no "Task 0: keys"
T=$(npm test 2>&1 | count pass); S=$(npm run -s test:servers 2>&1 | count fail); P=$(npm run -s test:py 2>&1 | tail -1)
C=$(npm run -s conformance 2>&1 | tail -1)
[ "$S" = 0 ] && echo "$P" | grep -q passed && echo "$C" | grep -q " 0 failed" && ok "Task 0: every check passes at the start ($T TypeScript, connector 0 failed, $P, $C)" || no "Task 0: checks at start ($S, $P, $C)"
NODATA=$(grep -c 'No AP data is connected for Cedar Ridge Supply yet' scripts/matrix.ts)
[ "$NODATA" -ge 1 ] && ok "Task 0: at lab19-start Cedar Ridge still has no data (Chapter 18's matrix expects the message)" || no "Task 0: Cedar Ridge at start"

# --- The agents' work: the reference branch ---------------------------------------------------------
git fetch -q "$BUNDLE" "refs/tags/ch19:refs/tags/ch19" && git checkout -q ch19 && ok "agents: the reference work (tag ch19 from the authors' bundle) checked out" || { no "agents: ch19"; exit 1; }
npm ci --silent >/dev/null 2>&1; (cd py && uv sync -q --locked >/dev/null 2>&1)
bash "$NEONLIKE" brightline_sim >/dev/null 2>&1
umask 077
printf 'DATABASE_URL_OWNER=postgresql://neondb_owner:owner-local-only@127.0.0.1:5432/brightline_sim\n' > .secrets/db.dev.env
printf 'AP_EMBEDDINGS=test\n' > .secrets/embeddings.env
set -a; . ./.secrets/db.dev.env; set +a

# --- Tasks 2 and 3 -------------------------------------------------------------------------------------
M1=$(npm run -s db:migrate 2>&1 | tail -1); M2=$(npm run -s db:migrate 2>&1 | tail -1)
echo "$M1" | grep -q "4 applied, 0 already" && echo "$M2" | grep -q "0 applied, 4 already" && ok "Task 2: migrations apply once ($M1 / $M2)" || no "Task 2: migrations ($M1 / $M2)"
cp db/migrations/0002_tables.sql "$HARNESS/tmp/sim-0002.bak"; echo "-- an edit" >> db/migrations/0002_tables.sql
npm run -s db:migrate 2>&1 | grep -q "has changed since it ran" && ok "Task 2: an edited migration is refused" || no "Task 2: edited migration"
cp "$HARNESS/tmp/sim-0002.bak" db/migrations/0002_tables.sql
npm run -s db:passwords >/dev/null 2>&1; set -a; . ./.secrets/db.dev.env; set +a
R=$(npm run -s check:roles 2>&1 | tail -1); echo "$R" | grep -q passed && ok "Task 3: $R" || no "Task 3: check:roles ($R)"
for c in "org_brightline data" "org_cedar data-cedar" "org_conformance data-conformance"; do set -- $c; npm run -s tenant:load -- --company "$1" --folder "$2" >/dev/null 2>&1; done
E=$(psql "$DATABASE_URL_OWNER" -Atc "BEGIN; INSERT INTO invoices VALUES ('org_cedar','INV-9991','V006','2027-03-29',NULL,'Net 30',100,'open'); ROLLBACK;" 2>&1)
echo "$E" | grep -q "invoices_tenant_id_vendor_id_fkey" && ok "Task 2: a Cedar Ridge invoice for Brightline's V006 is refused by the composite foreign key" || no "Task 2: V006 ($E)"
Q=$(psql "$DATABASE_URL_OWNER" -Atc "select count(*) from vendors"); RC=$(psql "$DATABASE_URL_READER" -At -c "begin" -c "select set_config('app.tenant_id','org_cedar',true)" -c "select count(*) from vendors" -c "commit" 2>/dev/null | grep -E '^[0-9]+$' | head -1); RN=$(psql "$DATABASE_URL_READER" -Atc "select count(*) from vendors")
[ "$Q" = 25 ] && [ "$RC" = 9 ] && [ "$RN" = 0 ] && ok "Task 3: SELECT count(*) FROM vendors as the owner $Q, as the reader with Cedar Ridge set $RC, with nothing set $RN" || no "Task 3: three counts ($Q, $RC, $RN)"

# --- Task 3b: the exercise --------------------------------------------------------------------------
psql "$DATABASE_URL_OWNER" -q -v ON_ERROR_STOP=1 -f exercises/3nf/docs_flat.sql >/dev/null 2>&1
NAMES=$(psql "$DATABASE_URL_OWNER" -Atc "select max(n) from (select count(distinct org_name) n from exercise.docs_flat group by tenant_id) s")
K=$(psql "$DATABASE_URL_OWNER" -v ON_ERROR_STOP=1 -f ../answer-key/3nf-refactor.sql 2>&1)
PR=$(psql "$DATABASE_URL_READER" -q -f ../answer-key/3nf-proof-reader.sql 2>&1)
echo "$K" | grep -q "UPDATE 1" && [ "$(echo "$PR" | grep -c "^ org_cedar |")" = 3 ] && ok "Task 3b: docs_flat loads (one name per company, $NAMES), the answer key's refactor has 0 copies, UPDATE 1, and 3 Cedar Ridge rows as the reader" || no "Task 3b: exercise"
psql "$DATABASE_URL_OWNER" -qc "DROP SCHEMA exercise CASCADE" >/dev/null 2>&1

# --- Task 4 ------------------------------------------------------------------------------------------
CNT=$(psql "$DATABASE_URL_OWNER" -Atc "select string_agg(tenant_id||':'||n, ' ' order by tenant_id) from (select tenant_id, count(*) n from invoices group by 1) s")
L4=$(psql "$DATABASE_URL_OWNER" -Atc "select count(*) from vendor_banking where account_last4 !~ '^\d{4}$'")
[ "$CNT" = "org_brightline:15 org_cedar:20 org_conformance:15" ] && [ "$L4" = 0 ] && ok "Task 4: invoices per company ($CNT), and no full account number stored" || no "Task 4: counts ($CNT, $L4)"
X=$(psql "$DATABASE_URL_LOADER" -At -c "begin" -c "select set_config('app.tenant_id','org_cedar',true)" -c "insert into vendors values ('org_brightline','V099','Sneaky','Net 30')" -c "rollback" 2>&1)
echo "$X" | grep -q "row-level security" && ok "Task 4: Cedar Ridge's loader cannot write a Brightline vendor" || no "Task 4: loader ($X)"

# --- Task 4b: the 19.3 concept blocks, run as the reader would, change nothing ---------------------------
NET0=$(psql "$DATABASE_URL_OWNER" -Atc "select md5(string_agg(tenant_id||vendor_id||terms, ',' order by tenant_id, vendor_id)) from vendors")
B=""; for f in ../concept-blocks/sql/0*.sql; do B="$B$(node ../concept-blocks/sql/run.mjs "$f" 2>&1)"; done
NET1=$(psql "$DATABASE_URL_OWNER" -Atc "select md5(string_agg(tenant_id||vendor_id||terms, ',' order by tenant_id, vendor_id)) from vendors")
if echo "$B" | grep -q "INV-6201       | V001      | 412075" && echo "$B" | grep -q "^20 *$" && echo "$B" | grep -q "^PO-3108" \
   && echo "$B" | grep -q "^UPDATE 9$" && echo "$B" | grep -q "^ERROR 23503" && echo "$B" | grep -q "must be owner of table vendors" && [ "$NET0" = "$NET1" ]; then
  ok "Task 4b: the six 19.3 blocks give the chapter's outputs, and the database is unchanged after"
else no "Task 4b: concept blocks (vendors unchanged: $([ "$NET0" = "$NET1" ] && echo yes || echo no))"; fi

# --- Task 12b: the 19.14 concept blocks (stand-in embeddings, loaded in Task 4) -------------------------
V=""; for f in ../concept-blocks/sql/0[7-9]*.sql ../concept-blocks/sql/1[0-4]*.sql; do V="$V$(node ../concept-blocks/sql/run.mjs "$f" 2>&1)"; done
if echo "$V" | grep -q "^0.00           | 0.04  | 1.00            | 2.00" && echo "$V" | grep -q "^purchasing  | 5          | 0.72" \
   && echo "$V" | grep -q "^purchasing  | 7" && echo "$V" | grep -q "^1.00 " && echo "$V" | grep -q "Index Scan using policy_passages_pkey" \
   && echo "$V" | grep -q "Index Scan using policy_passages_embedding" && echo "$V" | grep -q "| 4100" && echo "$V" | grep -q "^purchasing  | 6          | 0.0325"; then
  ok "Task 12b: the eight 19.14 blocks give the chapter's outputs, hybrid search included"
else no "Task 12b: vector blocks"; fi

# --- Tasks 5 to 7 -------------------------------------------------------------------------------------
S=$(npm run -s test:servers 2>&1); SP=$(echo "$S" | count pass); SF=$(echo "$S" | count fail)
[ "$SF" = 0 ] && ok "Tasks 5, 6: TypeScript connector tests pass ($SP)" || no "Tasks 5, 6: TypeScript tests ($SF failed)"
P=$(npm run -s test:py 2>&1 | tail -1); echo "$P" | grep -qv failed && echo "$P" | grep -q passed && ok "Task 7: Python tests ($P)" || no "Task 7: Python ($P)"
check "Tasks 6, 7: typecheck and Pyright strict" bash -c "npm run -s typecheck && npm run -s check:py"
Q=$(npm run -s check:queries 2>&1 | tail -1); echo "$Q" | grep -q passed && ok "Task 6: $Q" || no "Task 6: $Q"
C=$(npm run -s conformance 2>&1 | tail -1); echo "$C" | grep -q " 0 failed" && ok "Tasks 6, 7: $C" || no "Tasks 6, 7: conformance ($C)"

# --- Task 8 ------------------------------------------------------------------------------------------
D=$(timeout 300 npm run -s matrix:data 2>&1 | tail -1); echo "$D" | grep -q "25 rows passed, 0 failed" && ok "Task 8: $D" || no "Task 8: $D"

# --- Task 10 ------------------------------------------------------------------------------------------
npm run -s tenant:load -- --company org_juniper --folder data-juniper >/dev/null 2>&1
EX=$(npm run -s tenant:export -- --company org_juniper 2>&1 | tail -1); DL=$(npm run -s tenant:delete -- --company org_juniper --confirm org_juniper 2>&1 | tail -1)
echo "$EX" | grep -q "vendors 2, vendor_notes 1, vendor_banking 2, invoices 2, purchase_orders 1" && echo "$DL" | grep -q "0 rows for org_juniper" && ok "Task 10: Juniper exported (its rows only) and deleted: every table holds 0 rows for it" || no "Task 10: export or delete ($EX / $DL)"
[ -z "$(git status --porcelain exports)" ] && ok "Task 10: exports/ is ignored by git" || no "Task 10: exports tracked"

# --- Tasks 13 and 14 ------------------------------------------------------------------------------------
F=$(psql "$DATABASE_URL_LOADER" -At -c "begin" -c "select set_config('app.tenant_id','org_cedar',true)" -c "update policy_passages set content = 'A purchase order is required for any purchase above \$5,000.00.' where passage_id = 'purchasing#L5'" -c "rollback" 2>&1)
echo "$F" | grep -q embedding_matches_content && ok "Task 13: a passage changed without a new embedding is refused" || no "Task 13: fingerprint ($F)"
EV=$(npm run -s eval:retrieval 2>&1 | tail -2 | head -1); npm run -s eval:retrieval >/dev/null 2>&1 && ok "Task 14: $EV" || no "Task 14: $EV"
npm run -s tenant:load -- --company org_cedar --folder data-cedar --replace --chunk document >/dev/null 2>&1
EW=$(npm run -s eval:retrieval 2>&1 | tail -2 | head -1); ! npm run -s eval:retrieval >/dev/null 2>&1 && ok "Task 14: whole documents fail the set ($EW)" || no "Task 14: worse chunking passed"
npm run -s tenant:load -- --company org_cedar --folder data-cedar --replace >/dev/null 2>&1

# --- Sitting 5 on one computer --------------------------------------------------------------------------
check "Tasks 15, 16: workflows parse" python3 -I -c "import yaml;[yaml.safe_load(open(f)) for f in ['.github/workflows/ci.yml','.github/workflows/ci-cleanup.yml','.github/workflows/deploy.yml']]"
DP=$(npm run -s check:deploy 2>&1 | grep 'settings checks'); echo "$DP" | grep -q "0 failed" && ok "Task 16: $DP (Hyperdrive ids still placeholders, as expected)" || no "Task 16: check:deploy"
check "Task 18: no secret in a tracked file" bash scripts/check-no-secret-output.sh
echo "Checks: $N, FAILURES: $FAIL"
exit $FAIL
