#!/usr/bin/env bash
# Fails if a tracked file holds something that looks like a real key or secret. Chapter 18's secrets:
# the handle key, the sign-in server's two, the test signing key and a CI client's secret.
set -eu
if git grep -nE '(AP_HANDLE_KEY|AP_HANDLE_KEY_PREVIOUS|BETTER_AUTH_SECRET|AUTH_ADMIN_KEY|AP_TEST_SIGNING_KEY|CONFORMANCE_CLIENT_SECRET[A-Z_]*)=[A-Za-z0-9_\-]{12,}' -- ':!*.example' ':!*.md'; then echo "A key is committed"; exit 1; fi
echo "No secrets found"
