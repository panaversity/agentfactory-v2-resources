#!/usr/bin/env bash
# Lab 20's offline simulation on our base, from the editor-in-chief's authors/simulate-lab.sh: the real
# ask scripts, the real MCP practice connector, and a stand-in model API (fake-model-server.mjs, his)
# serving recorded responses. It proves the wiring, not the model's behavior. No key, no network.
#
#   bash simulate_lab20.sh <brightline-ap, installed: node_modules and py/.venv> <log folder>
#
# What differs from his: our install (py/.venv from uv sync), our command names (npm run typecheck,
# test:loop, test:loop:py), the week moved (INV-8301), a copy-on-write copy on macOS, and the logs
# written to <log folder>.
set -euo pipefail
SRC=$(cd "$1" && pwd); mkdir -p "$2"; OUT=$(cd "$2" && pwd); HERE=$(cd "$(dirname "$0")" && pwd)
W=$(mktemp -d); cp -cR "$SRC"/. "$W"/ 2>/dev/null || cp -R "$SRC"/. "$W"/; cd "$W"
pass=0; fail=0; check() { if eval "$2"; then echo "PASS $1"; pass=$((pass+1)); else echo "FAIL $1"; fail=$((fail+1)); fi; }
node -e 'const f="src/loop/config.json",c=JSON.parse(require("fs").readFileSync(f));for(const a of ["claude","openai"])c.prices[a]={input:3,output:15,cacheWrite:3.75,cacheRead:0.3};c.prices.checked_on="simulation only";require("fs").writeFileSync(f,JSON.stringify(c))'
mkdir -p .secrets; printf 'CONNECTOR_URL=http://127.0.0.1:8760/mcp\nCONNECTOR_TOKEN=sim-token\n' > .secrets/connector.env
printf 'ANTHROPIC_API_KEY=sk-ant-sim\n' > .secrets/anthropic.env; printf 'OPENAI_API_KEY=sk-sim\n' > .secrets/openai.env
(cd py && PRACTICE_TOKEN=sim-token exec .venv/bin/python -m brightline_ap.practice_connector) & CONN=$!
node "$HERE/fake-model-server.mjs" 8761 tests/fixtures/loop/claude-one-tool.json & M1=$!
node "$HERE/fake-model-server.mjs" 8762 tests/fixtures/loop/openai-one-tool.json & M2=$!
node "$HERE/fake-model-server.mjs" 8763 tests/fixtures/loop/claude-one-tool.json & M3=$!
node "$HERE/fake-model-server.mjs" 8764 tests/fixtures/loop/claude-try-again.json & M4=$!
(cd py && PRACTICE_TOKEN=sim-token PRACTICE_PORT=8770 PRACTICE_BROKEN=search_policy exec .venv/bin/python -m brightline_ap.practice_connector) & CONN2=$!
trap 'kill $CONN $CONN2 $M1 $M2 $M3 $M4 2>/dev/null; rm -rf "$W"' EXIT; sleep 3
check "typecheck (TypeScript)" "npm run -s typecheck >/dev/null"
check "typecheck (Python, pyright)" "npm run -s typecheck:py >/dev/null"
check "unit tests (TypeScript)" "npm run -s test:loop >/dev/null 2>&1"
check "unit tests (Python)" "npm run -s test:loop:py >/dev/null 2>&1"
check "git would ignore .secrets/" "grep -qx '.secrets/' .gitignore"
ANTHROPIC_BASE_URL=http://127.0.0.1:8761 npm run -s ask -- --api claude --trace "Which invoices are due this week?" > ask-claude.log 2>&1 || true
check "ask (TS, Claude): request, real tool call over MCP, end_turn" "grep -q 'stop: end_turn | turns: 2' ask-claude.log && grep -q 'INV-8301' ask-claude.log"
check "ask (TS, Claude): the tool result came from the connector, reading data/" "grep -q '482500' ask-claude.log && grep -q 'INV-8316' ask-claude.log"
check "ask (TS, Claude): trace has 3 spans" "[ \$(wc -l < trace.jsonl) -eq 3 ]"
check "ask (TS, Claude): no key or token in the log" "! grep -q 'sk-ant-sim\\|sim-token' ask-claude.log"
OPENAI_BASE_URL=http://127.0.0.1:8762 npm run -s ask -- --api openai "Which invoices are due this week?" > ask-openai.log 2>&1 || true
check "ask (TS, OpenAI): stateless, stop done after 2 turns" "grep -q 'stop: done | turns: 2' ask-openai.log && grep -q '\"store\": false' ask-openai.log"
ANTHROPIC_BASE_URL=http://127.0.0.1:8763 npm run -s ask:py -- --api claude "Which invoices are due this week?" > ask-py.log 2>&1 || true
check "ask (Python, Claude): the same run" "grep -q 'stop: end_turn | turns: 2' ask-py.log"
CONNECTOR_URL=http://127.0.0.1:8770/mcp ANTHROPIC_BASE_URL=http://127.0.0.1:8764 npm run -s ask -- --api claude --max-turns 4 "Is there an early-payment discount?" > ask-broken.log 2>&1 || true
check "Task 8b: CONNECTOR_URL reaches the broken connector, turn limit 4" "grep -q 'try again' ask-broken.log && grep -q 'stop: turn_limit | turns: 4' ask-broken.log"
cp ask-claude.log ask-openai.log ask-py.log ask-broken.log trace.jsonl "$OUT/" 2>/dev/null || true
echo "PASSED $pass, FAILED $fail"; [ $fail -eq 0 ]
