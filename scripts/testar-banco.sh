#!/usr/bin/env bash
# Carrega admin/schema.sql num Postgres descartável, com o stub do Supabase,
# e roda os testes de RLS de tests/db/. Nunca aponte para o banco real.
# Uso: PGHOST=… PGPORT=… PGUSER=postgres bash scripts/testar-banco.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB="casamartech_teste_$$"
createdb "$DB"
trap 'dropdb --if-exists "$DB"' EXIT
psql -X -v ON_ERROR_STOP=1 -q -d "$DB" -f tests/db/supabase-stub.sql -f admin/schema.sql >/dev/null
psql -X -v ON_ERROR_STOP=1 -q -d "$DB" -f tests/db/rls.sql
