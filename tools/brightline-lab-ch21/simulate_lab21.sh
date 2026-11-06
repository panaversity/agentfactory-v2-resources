#!/usr/bin/env bash
# Lab 21's offline simulation on our base, from the editor-in-chief's authors/simulate-lab.sh: both agent SDKs at
# their pinned versions in both languages (the Claude Agent SDK's own harness subprocess, the OpenAI Agents SDK's
# runner, the client SDK's tool runner), the real practice connector over MCP, and a stand-in model API
# (stand_in_model.py, ours from his) serving scripted turns. It proves the wiring and the options, not what a
# real model will choose. No key, no network, no cost. Nothing it prints is quoted on a page.
#
#   env -i PATH="$PATH" TMPDIR="$(getconf DARWIN_USER_TEMP_DIR)" LANG=en_US.UTF-8 bash simulate_lab21.sh <brightline-ap, installed> <log folder>
#
# TMPDIR must be a short path: tsx opens a Unix socket in it, and macOS allows 104 bytes for one.
#
# The editor allowed the Claude Agent SDK to run here only against the stand-in, with the worker's isolation
# (settingSources: [], strictMcpConfig: true, the short environment, Python's trimmed environment), so this
# script sets its own environment and refuses to run if anything could reach a real model or this computer's
# Claude settings: HOME is a new empty folder, both base URLs are the stand-in's, and both keys are fake.
#
# What differs from his: our install (py/.venv), our test file name (tests/sdk.spec.ts), one Brightline's numbers
# (the Chapter 20 session's map), macOS (no setsid or timeout), and it stops only the processes it started.
set -u
SRC=$(cd "$1" && pwd); mkdir -p "$2"; OUT=$(cd "$2" && pwd); HERE=$(cd "$(dirname "$0")" && pwd)
export HOME="$OUT/home"; rm -rf "$HOME"; mkdir -p "$HOME"
export ANTHROPIC_BASE_URL=http://127.0.0.1:8799 ANTHROPIC_API_KEY=sk-ant-stand-in
export OPENAI_BASE_URL=http://127.0.0.1:8799/v1 OPENAI_API_KEY=sk-stand-in
export CONNECTOR_TOKEN=practice-token-lab21 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
other=$(env | grep -E '^(CLAUDE|ANTHROPIC|OPENAI)' | grep -v -E '^(ANTHROPIC_BASE_URL|ANTHROPIC_API_KEY|OPENAI_BASE_URL|OPENAI_API_KEY|CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC)=' | cut -d= -f1)
[ -z "$other" ] || { echo "refusing: run under env -i; these are set: $other"; exit 2; }
[ ! -e "$HOME/.claude" ] && [ ! -e "$HOME/.claude.json" ] || { echo "refusing: HOME holds Claude settings"; exit 2; }
W=$(mktemp -d "$OUT/work.XXXXXX")/brightline-ap; cp -cR "$SRC" "$W" 2>/dev/null || cp -R "$SRC" "$W"; cd "$W"
PY=$W/py/.venv/bin/python; LOGS=$OUT/streams; mkdir -p "$LOGS"; rm -f "$LOGS"/*.txt "$OUT"/standin*.jsonl
tmo() { perl -e 'alarm shift; exec @ARGV' "$@"; }
pass=0; fail=0
check() { if grep -q -- "$2" "$LOGS/$1.txt"; then echo "PASS $1: $2"; pass=$((pass+1)); else echo "FAIL $1: $2"; fail=$((fail+1)); fi; }
nocheck() { if grep -q -- "$2" "$LOGS/$1.txt"; then echo "FAIL $1: found $2"; fail=$((fail+1)); else echo "PASS $1: no $2"; pass=$((pass+1)); fi; }

(cd py && PRACTICE_TOKEN=$CONNECTOR_TOKEN exec .venv/bin/python -m brightline_ap.practice_connector) > "$OUT/connector.log" 2>&1 & C1=$!
(cd py && PRACTICE_PORT=8761 PRACTICE_BROKEN=search_policy PRACTICE_TOKEN=$CONNECTOR_TOKEN exec .venv/bin/python -m brightline_ap.practice_connector) > "$OUT/connector-broken.log" 2>&1 & C2=$!
STAND_IN_LOG=$OUT/standin.jsonl "$PY" "$HERE/stand_in_model.py" > "$OUT/standin.log" 2>&1 & M1=$!
STAND_IN_PORT=11434 STAND_IN_LOG=$OUT/standin-open.jsonl "$PY" "$HERE/stand_in_model.py" > "$OUT/standin-open.log" 2>&1 & M2=$!
trap 'kill $C1 $C2 $M1 $M2 2>/dev/null; rm -rf "$(dirname "$W")"' EXIT
sleep 5

run() { local name=$1; shift; tmo 180 "$@" 2>&1 | grep -v "stream_event\|rate_limit_event\|system status\|post_turn_summary\|trace-warnings" > "$LOGS/$name.txt"; }
TS="node_modules/.bin/tsx scripts/sdk-ask.ts"
PYASK="env PYTHONPATH=py $PY -m brightline_ap.sdk_ask"

echo "--- offline tests"
node_modules/.bin/vitest run tests/sdk.spec.ts > "$LOGS/tests-ts.txt" 2>&1; check tests-ts "15 passed"
(cd py && .venv/bin/python -m pytest -q tests/test_sdk.py) > "$LOGS/tests-py.txt" 2>&1; check tests-py "13 passed"

echo "--- Sitting 1: the first rung"
run t1-runner-ts $TS --sdk runner "Which invoices are due this week?"; check t1-runner-ts "stop: end_turn | turns: 2"
run t1-runner-py $PYASK --sdk runner "Which invoices are due this week?"; check t1-runner-py "stop: end_turn | turns: 2"

echo "--- Sitting 2: the loop, run for you (both SDKs)"
run t3-claude-ts $TS --sdk claude "Which invoices are due this week?"
check t3-claude-ts "mcp__brightline__list_open_invoices"; check t3-claude-ts "mcp__local__flag_invoice"
check t3-claude-ts "result: success, turns 2"; check t3-claude-ts '\$24,927.63'
check t3-claude-ts '"due_on_or_before":"2027-04-04"'
run t3-claude-py $PYASK --sdk claude "Which invoices are due this week?"; check t3-claude-py "result: success, turns 2"; nocheck t3-claude-py "claude-in-chrome"
run t5-builtins-ts $TS --sdk claude --built-ins "What is today's exchange rate for the euro?"
check t5-builtins-ts "WebFetch"; check t5-builtins-ts "permission: Bash -> deny"
run t5-off-ts $TS --sdk claude "What is today's exchange rate for the euro?"; check t5-off-ts "result: success, turns 1"; nocheck t5-off-ts "WebFetch"
run t6-allow-ts $TS --sdk claude "Please flag INV-8316 for review."; check t6-allow-ts "permission: mcp__local__flag_invoice -> allow"
run t6-deny-ts $TS --sdk claude "Flag every invoice for review."; check t6-deny-ts "permission: mcp__local__flag_invoice -> deny"; check t6-deny-ts "tool_result (error)"
run t6-deny-py $PYASK --sdk claude "Flag every invoice for review."; check t6-deny-py "permission: mcp__local__flag_invoice -> deny"
check t3-claude-ts "hook: mcp__brightline__list_open_invoices"
CONNECTOR_URL=http://127.0.0.1:8761/mcp run t9-turns-ts $TS --sdk claude --max-turns 4 "Is there an early-payment discount?"; check t9-turns-ts "error_max_turns"
CONNECTOR_URL=http://127.0.0.1:8761/mcp run t9-budget-ts $TS --sdk claude --budget 0.01 "Is there an early-payment discount?"; check t9-budget-ts "error_max_budget_usd"
CONNECTOR_URL=http://127.0.0.1:8761/mcp run t9-turns-py $PYASK --sdk claude --max-turns 4 "Is there an early-payment discount?"; check t9-turns-py "error_max_turns"
run t11-persist-ts $TS --sdk claude --persist "Which invoices are due this week?"
SID=$(grep -o "session: [0-9a-f-]*" "$LOGS/t11-persist-ts.txt" | tail -1 | cut -d' ' -f2)
find "$HOME/.claude/projects" -name "*.jsonl" > "$LOGS/t11-session-files.txt" 2>&1; check t11-session-files "$SID.jsonl"
check t11-session-files "brightline-ap/$SID.jsonl"
run t11-resume-ts $TS --sdk claude --persist --resume "$SID" "Which of those has no purchase order?"; check t11-resume-ts "INV-8316 (\$389.00) has no purchase order"
find "$HOME/.claude" -type d -name memory > "$LOGS/auto-memory.txt" 2>&1; nocheck auto-memory "memory"

echo "--- Sitting 3: keeping a run in bounds (both SDKs)"
run t4-openai-ts $TS --sdk openai "Which invoices are due this week?"; check t4-openai-ts "stop: done | model calls: 2"
check t4-openai-ts "history: function_call list_open_invoices"
run t4-openai-py $PYASK --sdk openai "Which invoices are due this week?"; check t4-openai-py "stop: done | model calls: 2"
check t4-openai-py "request: store=False include=\['reasoning.encrypted_content'\] previous_response_id=None"
run t10-guard-claude-ts $TS --sdk claude "Just tell me yes or no: can we pay INV-8301 today?"; check t10-guard-claude-ts "stop: no_citation"
run t10-guard-claude-py $PYASK --sdk claude "Just tell me yes or no: can we pay INV-8301 today?"; check t10-guard-claude-py "stop: no_citation"
run t10-guard-ts $TS --sdk openai "Just tell me yes or no: can we pay INV-8301 today?"; check t10-guard-ts "stop: guardrail | model calls: 1"
run t10-guard-py $PYASK --sdk openai "Just tell me yes or no: can we pay INV-8301 today?"; check t10-guard-py "stop: guardrail | model calls: 1"
run t7-approve-ts $TS --sdk openai "Please flag INV-8316 for review."; check t7-approve-ts "approval: flag_invoice -> approve"
run t7-reject-ts $TS --sdk openai "Flag every invoice for review."; check t7-reject-ts "approval: flag_invoice -> reject"
run t7-reject-py $PYASK --sdk openai "Flag every invoice for review."; check t7-reject-py "approval: flag_invoice -> reject"
CONNECTOR_URL=http://127.0.0.1:8761/mcp run t9-openai-turns-ts $TS --sdk openai "Is there an early-payment discount?"; check t9-openai-turns-ts "stop: max_turns | model calls: 8"

echo "--- Sitting 4: the port"
run t14-open-ts $TS --sdk open "Which invoices are due this week?"; check t14-open-ts "stop: done | model calls: 2"
run t14-open-py $PYASK --sdk open "Which invoices are due this week?"; check t14-open-py "stop: done | model calls: 2"

echo "--- what the SDKs sent"
"$PY" - "$OUT/standin.jsonl" "$OUT/standin-open.jsonl" > "$LOGS/wire-summary.txt" <<'PYEOF'
import json, sys
seen = set()
for path in sys.argv[1:]:
    for line in open(path):
        d = json.loads(line)
        if d["kind"] not in ("messages", "responses"):
            continue
        b = d["body"]
        key = (d["kind"], d["headers"].get("user-agent", "")[:18], d["headers"].get("anthropic-version"))
        if key in seen:
            continue
        seen.add(key)
        fields = sorted(k for k in b if k not in ("messages", "input", "tools", "system", "instructions"))
        print(d["kind"], "|", d["headers"].get("user-agent", "")[:40], "| version", d["headers"].get("anthropic-version"),
              "| beta", d["headers"].get("anthropic-beta"), "| fields", fields, "| store", b.get("store"), "| include", b.get("include"))
PYEOF
check wire-summary "store False"; check wire-summary "include \['reasoning.encrypted_content'\]"
grep -h -o '"path": "[^"]*"' "$OUT"/standin*.jsonl | sort | uniq -c > "$LOGS/paths.txt"
echo "=== $pass passed, $fail failed"
[ $fail -eq 0 ]
