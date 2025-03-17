#!/bin/sh

if [ ! -f "/app/.migrated" ]; then
  echo "Running database migration..."
  bun run db:migrate
  touch /app/.migrated
else
  echo "Migration already applied, skipping..."
fi

exec bun run dev