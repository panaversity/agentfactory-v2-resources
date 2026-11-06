#!/usr/bin/env bash
# Lab 20's answer key: ports/trace-good.jsonl, Task 10's good trace, which Lab 21 compares with.
# The real loop, tracer and practice connector, with the editor-in-chief's stand-in model API serving
# sim-fixtures/claude-no-po-policy.json, so it is illustrative: its ids and timings come from this run.
#   bash make_trace_good.sh <brightline-ap, installed> <out file>
set -euo pipefail
SRC=$(cd "$1" && pwd); OUTF=$(cd "$(dirname "$2")" && pwd)/$(basename "$2"); HERE=$(cd "$(dirname "$0")" && pwd)
W=$(mktemp -d); cp -cR "$SRC"/. "$W"/ 2>/dev/null || cp -R "$SRC"/. "$W"/; cd "$W"
# The loop refuses to run with zero prices (F5), so the simulation's made-up prices, as simulate_lab20.sh's.
node -e 'const f="src/loop/config.json",c=JSON.parse(require("fs").readFileSync(f));c.prices.claude={input:3,output:15,cacheWrite:3.75,cacheRead:0.3};c.prices.checked_on="simulation only";require("fs").writeFileSync(f,JSON.stringify(c))'
mkdir -p .secrets; printf 'CONNECTOR_URL=http://127.0.0.1:8760/mcp\nCONNECTOR_TOKEN=sim-token\n' > .secrets/connector.env
printf 'ANTHROPIC_API_KEY=sk-ant-sim\n' > .secrets/anthropic.env
(cd py && PRACTICE_TOKEN=sim-token exec .venv/bin/python -m brightline_ap.practice_connector) & CONN=$!
node "$HERE/fake-model-server.mjs" 8765 "$HERE/sim-fixtures/claude-no-po-policy.json" & M=$!
trap 'kill $CONN $M 2>/dev/null; rm -rf "$W"' EXIT; sleep 3
rm -f trace.jsonl
ANTHROPIC_BASE_URL=http://127.0.0.1:8765 npm run -s ask -- --api claude --trace --quiet "What does our policy say about an invoice with no purchase order? Cite the line." > ask.log 2>&1 || true
if ! grep -q 'stop: end_turn | turns: 2' ask.log; then echo "the run did not end as expected:"; tail -25 ask.log; exit 1; fi
cp trace.jsonl "$OUTF"; echo "trace: $(wc -l < trace.jsonl | tr -d ' ') spans -> $OUTF"; tail -3 ask.log
