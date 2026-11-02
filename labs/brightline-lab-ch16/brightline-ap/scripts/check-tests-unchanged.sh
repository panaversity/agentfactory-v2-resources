#!/usr/bin/env bash
# A narrow check on existing tests. It fails when a pull request:
#   - removes or edits a line in an existing file under tests/ or py/tests/, or
#   - adds a line that switches a test off: .skip( .only( .todo( { skip: { todo:
#     pytest.mark.skip or xfail, or a bare "return" inside a test file.
# It cannot tell whether a new or changed test still checks something useful.
# That stays a reviewer's job. Changing an existing test needs the label
# "tests-changed", a reason in the pull request, and a code owner's approval.
# It fails closed: if it cannot find the base branch, it fails instead of passing.
set -euo pipefail
base="${1:-}"
if [ -z "$base" ] || [ "$base" = "origin/" ] || ! git rev-parse --verify --quiet "$base^{commit}" >/dev/null; then
  echo "Cannot find the base branch '$base'. Check out with full history (fetch-depth: 0)."
  exit 2
fi
diff_out=$(git diff -U0 "$base"...HEAD -- tests py/tests)
removed=$(printf '%s\n' "$diff_out" | grep -E '^-[^-]' || true)
disabled=$(printf '%s\n' "$diff_out" | grep -E '^\+[^+]' \
  | grep -E '\.(skip|only|todo)\(|\{ *(skip|todo) *:|pytest\.mark\.(skip|xfail)|^\+[[:space:]]*return[[:space:]]*;?[[:space:]]*$' || true)
status=0
if [ -n "$removed" ]; then
  if [ "${ALLOW_TEST_CHANGES:-false}" = "true" ]; then
    echo "Existing test lines changed, allowed by the tests-changed label:"
    echo "$removed"
  else
    echo "This change removes or edits existing test lines:"
    echo "$removed"
    status=1
  fi
fi
if [ -n "$disabled" ]; then
  echo "This change adds lines that can switch tests off:"
  echo "$disabled"
  status=1
fi
if [ "$status" -ne 0 ]; then
  echo "Tests are the specification. Explain any test change in the pull request, and ask a code owner."
  exit "$status"
fi
echo "No existing test lines removed or edited, and no test switched off."
