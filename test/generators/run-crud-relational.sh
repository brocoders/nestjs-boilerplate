#!/usr/bin/env bash
#
# Full e2e orchestrator for the relational generator suite (Phase 2).
#
# Runs the generator matrix on the host, brings up the relational Docker
# stack (volume-mounting the freshly-generated source), then runs the
# CRUD jest spec inside the API container against the live HTTP API.
#
# Cleanup tears down Docker, removes generated source dirs, and reverts
# tracked changes — bounded to src/ and migration files we created.
#
# Usage: bash test/generators/run-crud-relational.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "✗ Working tree is dirty. Commit or stash your changes first." >&2
  exit 1
fi

COMPOSE_FILE="docker-compose.generators-relational.test.yaml"
COMPOSE_PROJECT="tests-gen"

cleanup() {
  local exit_code=$?
  echo ""
  echo "▶ Cleanup: tearing down Docker stack and reverting generated source…"
  docker compose -f "$COMPOSE_FILE" -p "$COMPOSE_PROJECT" down 2>/dev/null || true
  docker compose -p "$COMPOSE_PROJECT" rm -svf 2>/dev/null || true
  rm -rf src/articles src/tags src/comments 2>/dev/null || true
  find src/database/migrations -name "*-GeneratorE2E.ts" -delete 2>/dev/null || true
  git checkout -- src 2>/dev/null || true
  exit "$exit_code"
}
trap cleanup EXIT

# shellcheck source=_matrix.sh
source "$(dirname "$0")/_matrix.sh"
run_matrix relational

# Sanity: make sure the freshly-generated code compiles before bothering
# with Docker, so we fail fast on local template regressions.
npm run lint
npm run build

docker compose -f "$COMPOSE_FILE" --env-file env-example-relational -p "$COMPOSE_PROJECT" up -d --build

# Wait for the API container's port 3001 (mirrors the existing test:e2e:*:docker pattern).
docker compose -f "$COMPOSE_FILE" -p "$COMPOSE_PROJECT" exec api /opt/wait-for-it.sh -t 0 localhost:3001 -- \
  npx jest --config test/jest-e2e.json --testPathIgnorePatterns=/node_modules/ --testPathPatterns=generators-relational --runInBand
