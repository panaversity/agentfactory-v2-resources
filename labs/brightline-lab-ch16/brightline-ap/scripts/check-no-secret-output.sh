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
