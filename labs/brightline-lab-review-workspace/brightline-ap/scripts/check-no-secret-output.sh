#!/usr/bin/env bash
# Fails if a tracked file holds something that looks like a real key or secret. Chapter 18's secrets:
# the handle key, the sign-in server's two, the test signing key and a CI client's secret.
# Chapter 19's: database passwords, connection strings with a password in them, and API tokens.
set -eu
if git grep -nE '(AP_HANDLE_KEY|AP_HANDLE_KEY_PREVIOUS|BETTER_AUTH_SECRET|AUTH_ADMIN_KEY|AP_TEST_SIGNING_KEY|CONFORMANCE_CLIENT_SECRET[A-Z_]*|AP_LOADER_PASSWORD|AP_READER_PASSWORD|AP_EMBEDDINGS_TOKEN|NEON_API_KEY)=[A-Za-z0-9_\-]{12,}' -- ':!*.example' ':!*.md'; then echo "A key is committed"; exit 1; fi
if git grep -nE 'postgres(ql)?://[^:/@\s]+:[^@\s<]{8,}@' -- ':!*.md' ':!*.example'; then echo "A connection string with a password is committed"; exit 1; fi
echo "No secrets found"
