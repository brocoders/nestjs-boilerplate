#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:5432
pnpm run migration:run
pnpm run seed:run:relational
pnpm run start:prod > prod.log 2>&1 &
/opt/wait-for-it.sh maildev:1080
/opt/wait-for-it.sh localhost:3000
pnpm run lint
pnpm run test:e2e --runInBand
