#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:5432
pnpm run migration:run
pnpm run seed:run:relational
pnpm run start:prod
