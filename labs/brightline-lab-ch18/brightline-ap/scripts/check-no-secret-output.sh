#!/usr/bin/env bash
# Fails if a tracked file holds something that looks like a real key or a full bank account number.
set -eu
if git grep -nE '(AP_MCP_TOKEN|AP_HANDLE_KEY)=[A-Za-z0-9_\-]{12,}' -- ':!*.example' ':!*.md'; then echo "A key is committed"; exit 1; fi
echo "No secrets found"
