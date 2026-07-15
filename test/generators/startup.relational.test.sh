#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:5432
/opt/wait-for-it.sh maildev:1080
npm install
# Apply existing migrations against an empty DB so migration:generate has
# a stable baseline to diff against.
npm run migration:run
# Capture the freshly-generated entities (Article, Tag, Comment) as a migration.
npm run migration:generate -- src/database/migrations/GeneratorE2E
npm run migration:run
npm run seed:run:relational
npm run start:dev
