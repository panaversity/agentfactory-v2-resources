# Sourced (not run) by the macOS copies of the authors' three scripts. Not part of the authors' originals.
# It supplies what the authors' Linux root shell had for free:
#   - bin/timeout and bin/pgsu on PATH (macOS has no `timeout`; `su postgres -c psql` becomes `pgsu`)
#   - Postgres 17 client tools on PATH (psql)
#   - Node's TAP reporter: the scripts grep Node's test summary for "# pass" / "# fail", and Node 24's
#     default reporter prints "ℹ pass" instead
#   - a TMPDIR inside the harness folder, so nothing lands in /tmp
#   - PSQLRC=/dev/null, so a personal ~/.psqlrc can never change psql's output
HARNESS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export HARNESS
export PATH="$HARNESS/bin:/opt/homebrew/opt/postgresql@17/bin:$PATH"
export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--test-reporter=tap"
mkdir -p "$HARNESS/tmp"; export TMPDIR="$HARNESS/tmp/"
export PSQLRC=/dev/null
if ! pg_isready -q -h 127.0.0.1 -p 5432 -U postgres; then
  echo "env-macos.sh: no Postgres is answering on 127.0.0.1:5432. Start the private cluster first:" >&2
  echo "  LC_ALL=C.UTF-8 /opt/homebrew/opt/postgresql@17/bin/pg_ctl -D <scratch>/pg/data -l <scratch>/pg/log start" >&2
  exit 2
fi
