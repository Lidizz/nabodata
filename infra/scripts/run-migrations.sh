#!/usr/bin/env bash
set -euo pipefail

DATABASE_URL="${DATABASE_URL:-postgresql://nabodata:password@localhost:5432/nabodata}"
MIGRATIONS_DIR="$(dirname "$0")/../../services/api/src/db/migrations"

echo "Running migrations against: $DATABASE_URL"

for file in "$MIGRATIONS_DIR"/*.sql; do
  echo "  → $(basename "$file")"
  psql "$DATABASE_URL" -f "$file"
done

echo "Migrations complete."
