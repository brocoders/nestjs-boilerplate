#!/usr/bin/env bash
set -e

echo "Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
  if pg_isready -h 157.230.103.101 -p 5432 -U postgres; then
    echo "PostgreSQL is ready!"
    break
  fi
  echo "Database not ready yet... retrying in 1 second"
  sleep 1
done

echo "Proceeding with migrations (even if the database is not ready)..."
npm run migration:run || echo "Migration failed, continuing..."
npm run seed:run:relational || echo "Seeding failed, continuing..."

echo "Starting application..."
npm run start:prod
