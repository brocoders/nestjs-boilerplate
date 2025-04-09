#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh mongo:27017
cat .env
pnpm run seed:run:document
pnpm run start:prod
