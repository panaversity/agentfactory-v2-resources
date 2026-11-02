# Lab 15 answer key: Task 4. Required checks

The answers for Task 4 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Check your workflow for these five points. The reference workflow and script are at the end of this key.

1. `permissions: contents: read` at the top.
2. The trigger `pull_request` with `branches: [main]` and `types: [opened, synchronize, reopened, labeled, unlabeled]`. Without `labeled`, adding the `tests-changed` label does not rerun the checks. No `pull_request_target`.
3. Two jobs, `checks` and `tests-unchanged`. In one job the steps run in order and stop at the first failure, so a failing test would hide the test comparison. Separate jobs each report.
4. `fetch-depth: 0` on the `tests-unchanged` checkout, so the script can see `main`.
5. No step that uses a secret.

The script first checks that the base branch exists, and fails with exit code 2 if it does not. Then:

```bash
diff_out=$(git diff -U0 "$base"...HEAD -- tests py/tests)
removed=$(printf '%s\n' "$diff_out" | grep -E '^-[^-]' || true)
```

It looks for removed lines in test files, and for added lines that switch a test off (`.skip(`, `.only(`, `.todo(`, `pytest.mark.skip`, `xfail`, a bare `return`). Ordinary added lines, such as a new test, pass. It cannot tell whether a new test checks anything useful, or whether `package.json` now runs fewer tests. That is why `package.json` and the check scripts have a code owner.

`bash scripts/check-tests-unchanged.sh no-such-branch` prints "Cannot find the base branch" and exits 2. On `agent-speedup` the script fails and lists four removed lines from `tests/due-by-friday.test.ts`: the old test name and three asserts on 8 invoices and $19,229.53. On `weekend-rule` it passes, because that branch only adds test files.

## The reference workflow, `.github/workflows/ci.yml`

Task 10 adds a third job, `no-secrets`.

```yaml
# Required checks for every pull request to main. Two jobs, so each problem shows on its own.
name: ci
on:
  pull_request:
    branches: [main]
    # labeled and unlabeled rerun the checks when the tests-changed label is added or removed
    types: [opened, synchronize, reopened, labeled, unlabeled]

# The workflow token can read the code and nothing else.
permissions:
  contents: read

jobs:
  checks:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - uses: astral-sh/setup-uv@v6
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: cd py && uv sync --locked
      - run: npm run test:py
      - run: npm run check:py

  tests-unchanged:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Existing tests are not weakened
        run: bash scripts/check-tests-unchanged.sh "origin/${{ github.base_ref }}"
        env:
          ALLOW_TEST_CHANGES: ${{ contains(github.event.pull_request.labels.*.name, 'tests-changed') }}
```

## The reference script, `scripts/check-tests-unchanged.sh`

```bash
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
```
