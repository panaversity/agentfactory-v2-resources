#!/usr/bin/env bash
# Authors only: make a local Postgres database shaped like a fresh Neon branch.
# neondb_owner: LOGIN, CREATEROLE, BYPASSRLS, not a superuser (as Neon's neon_superuser members are).
# macOS copy: `su postgres -c "psql ..."` is `pgsu ...` (psql as the postgres superuser over TCP, see env-macos.sh).
set -euo pipefail
. "$(dirname "$0")/env-macos.sh"
DB=${1:-brightline_dev}
pgsu -q -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS $DB WITH (FORCE)"
# Roles belong to the whole server. Drop the lab's roles only when no other lab database is left.
if [ -z "$(pgsu -Atc "select 1 from pg_database where datname like 'brightline_%'")" ]; then
  pgsu -q -c 'DROP ROLE IF EXISTS ap_reader' -c 'DROP ROLE IF EXISTS ap_loader' -c 'DROP ROLE IF EXISTS dash_role'
fi
pgsu -q -v ON_ERROR_STOP=1 <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='neondb_owner') THEN
    CREATE ROLE neondb_owner LOGIN CREATEROLE CREATEDB BYPASSRLS PASSWORD 'owner-local-only';
  END IF;
END \$\$;
CREATE DATABASE $DB OWNER neondb_owner;
\c $DB
CREATE EXTENSION IF NOT EXISTS vector;
SQL
echo "local database $DB ready"
