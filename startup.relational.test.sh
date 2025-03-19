#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:5432
/opt/wait-for-it.sh maildev:1080
pnpm install
pnpm run migration:run
pnpm run seed:run:relational
pnpm run start:dev
