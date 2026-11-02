#!/usr/bin/env bash
# Fails if any existing test file was changed or deleted since the given base. New test files are fine.
set -eu
base="${1:-origin/main}"
changed=$(git diff --name-status "$base" -- tests py/tests servers/*/test | awk '$1 != "A" {print $2}')
if [ -n "$changed" ]; then echo "Existing tests changed:"; echo "$changed"; exit 1; fi
echo "No existing test changed since $base"
