#!/usr/bin/env bash
#
# Static-checks orchestrator for the generator e2e suite (Phase 1).
#
# Runs the full matrix of generator commands for one DB variant, then
# `npm run lint`, `npm run build`, and the file-assertion jest spec.
# Bounded cleanup restores the source tree on exit, success or fail.
#
# Usage: bash test/generators/run-static.sh <relational|document>

set -euo pipefail

VARIANT="${1:-}"
if [[ "$VARIANT" != "relational" && "$VARIANT" != "document" ]]; then
  echo "✗ Usage: $0 <relational|document>" >&2
  exit 2
fi

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "✗ Working tree is dirty. Commit or stash your changes before running generator tests." >&2
  echo "  (The tests modify src/ then reset via git — uncommitted work would be lost.)" >&2
  exit 1
fi

cleanup() {
  local exit_code=$?
  echo ""
  echo "▶ Cleanup: removing generated resource directories and reverting tracked src/ changes…"
  rm -rf src/articles src/tags src/comments 2>/dev/null || true
  git checkout -- src 2>/dev/null || true
  exit "$exit_code"
}
trap cleanup EXIT

# shellcheck source=_matrix.sh
source "$(dirname "$0")/_matrix.sh"
run_matrix "$VARIANT"

npm run lint
npm run build

npx jest --config test/jest-e2e.json --testPathIgnorePatterns=/node_modules/ --testPathPatterns=generators-file-assertions --runInBand
