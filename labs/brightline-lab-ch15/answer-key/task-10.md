# Lab 15 answer key: Task 10. Fix it at the source

The answers for Task 10 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

The script, below, runs as a third job, `no-secrets`. Add `no-secrets` to the ruleset's required checks after it has run once. On `main`, "No logging call with a secret's name found." On `agent-speedup` after pulling and merging `main`, the `no-secrets` job fails with:

```text
Possible secret in output:
src/ap-client.ts:14:  console.debug(`[ap-client] GET ${path} key=${o.key}`); // debug: remove later
```

It fails with exit code 2 if a folder is missing or `grep` itself fails, so it cannot pass by not looking. Otherwise it is a simple pattern match, not a security tool. It would miss a key printed through a variable with an innocent name. It catches the mistake that actually happened here, every time, at no cost, which is the point of fixing a repeat at the source.

## The reference script, `scripts/check-no-secret-output.sh`

```bash
#!/usr/bin/env bash
# A narrow check for one risky pattern: a logging or print call with a secret's name
# (key, token, secret or password) on the same line, in src/, scripts/ and py/brightline_ap/.
# It does not prove that no secret is printed or committed. A call split over two lines,
# or a secret in a variable with an innocent name, gets past it. Review still matters.
# It fails closed: a missing folder or a grep error is a failure, not a pass.
set -uo pipefail
dirs=(src scripts py/brightline_ap)
for d in "${dirs[@]}"; do
  if [ ! -d "$d" ]; then
    echo "Expected folder '$d' is missing. Run this from the top of the repository."
    exit 2
  fi
done
pattern='(console\.(log|debug|info|warn|error)|print)\(.*(key|token|secret|password)'
hits=$(grep -rniE "$pattern" "${dirs[@]}" --include='*.ts' --include='*.py')
code=$?
if [ "$code" -eq 0 ]; then
  echo "Possible secret in output:"
  echo "$hits"
  exit 1
elif [ "$code" -ne 1 ]; then
  echo "The search failed (grep exit $code), so nothing was checked."
  exit 2
fi
echo "No logging call with a secret's name found."
```

## The third job in `.github/workflows/ci.yml`

```yaml
  no-secrets:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - name: No secret is printed or written in code
        run: bash scripts/check-no-secret-output.sh
```
