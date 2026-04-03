#!/usr/bin/env bash
set -e

PORT="${1:-3000}"

# Ensure PostgreSQL is running (pg_ctl is more reliable than brew services after reboots)
PG_DATA="/opt/homebrew/var/postgresql@18"
PG_CTL="/opt/homebrew/opt/postgresql@18/bin/pg_ctl"

if "$PG_CTL" -D "$PG_DATA" status &>/dev/null; then
  echo "✅ PostgreSQL already running"
else
  echo "🗄️  Starting PostgreSQL..."
  "$PG_CTL" -D "$PG_DATA" start -l /opt/homebrew/var/log/postgresql@18.log
fi

# Ensure Prisma dev server is running
if npx prisma dev ls 2>&1 | grep -q "running"; then
  echo "✅ Prisma dev server already running"
else
  echo "🗄️  Starting Prisma dev server..."
  npx prisma dev --detach
  sleep 2
fi

# Extract the raw TCP PostgreSQL port from the Prisma dev server output
# The TCP line contains the actual postgres:// URL we need
DB_PORT=$(npx prisma dev ls 2>&1 | grep -A1 'TCP' | grep -o 'localhost:[0-9]*' | head -1 | cut -d: -f2)

if [ -z "$DB_PORT" ]; then
  echo "❌ Could not detect Prisma dev server DB port"
  exit 1
fi

export PRISMA_DEV_URL="postgresql://postgres:postgres@localhost:${DB_PORT}/template1?sslmode=disable"

echo "🔗 Using DB on port $DB_PORT"
echo "📦 Applying migrations..."
npx prisma migrate dev

echo "🚀 Starting Next.js on port $PORT..."
exec npx next dev -p "$PORT"
