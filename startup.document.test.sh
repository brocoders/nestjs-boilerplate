#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh mongo:27017
/opt/wait-for-it.sh maildev:1080
pnpm install
pnpm run seed:run:document
pnpm run start:dev
