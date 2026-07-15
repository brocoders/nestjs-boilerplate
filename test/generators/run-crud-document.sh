#!/usr/bin/env bash
#
# Full e2e orchestrator for the document generator suite (Phase 3).
#
# Same shape as run-crud-relational.sh but for MongoDB. No migration
# step — Mongoose creates collections lazily on first write.
#
# Usage: bash test/generators/run-crud-document.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "✗ Working tree is dirty. Commit or stash your changes first." >&2
  exit 1
fi

COMPOSE_FILE="docker-compose.document.test.yaml"
COMPOSE_PROJECT="tests-gen-doc"

cleanup() {
  local exit_code=$?
  echo ""
  echo "▶ Cleanup: tearing down Docker stack and reverting generated source…"
  docker compose -f "$COMPOSE_FILE" -p "$COMPOSE_PROJECT" down -v 2>/dev/null || true
  docker compose -p "$COMPOSE_PROJECT" rm -svf 2>/dev/null || true
  rm -rf src/articles src/tags src/comments 2>/dev/null || true
  git checkout -- src 2>/dev/null || true
  exit "$exit_code"
}
trap cleanup EXIT

# shellcheck source=_matrix.sh
source "$(dirname "$0")/_matrix.sh"
run_matrix document

npm run lint
npm run build

docker compose -f "$COMPOSE_FILE" --env-file env-example-document -p "$COMPOSE_PROJECT" up -d --build

docker compose -f "$COMPOSE_FILE" -p "$COMPOSE_PROJECT" exec api /opt/wait-for-it.sh -t 0 localhost:3001 -- \
  npx jest --config test/jest-e2e.json --testPathIgnorePatterns=/node_modules/ --testPathPatterns=generators-document --runInBand
