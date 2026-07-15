# Generator e2e tests

End-to-end tests for the hygen-based code generators (`npm run generate:resource:*`, `npm run add:property:to-*`).

## What's covered

- Every property `--kind` (primitive, reference, denormalized).
- Every primitive type (string, number, boolean, Date).
- Every reference `--referenceType` (oneToOne, oneToMany, manyToOne, manyToMany).
- `--isAddToDto true | false`, `--isOptional true | false`, `--isNullable true | false` permutations.

## Phases

1. **Phase 1 (static)** — runs generators, then `npm run lint`, `npm run build`, then [generators-file-assertions.e2e-spec.ts](generators-file-assertions.e2e-spec.ts). No database, no app boot. Catches compile/lint regressions and DTO-shape errors.
2. **Phase 2 (relational CRUD)** — boots Nest against PostgreSQL in Docker and exercises the generated REST endpoints. Uses [docker-compose.generators-relational.test.yaml](../../docker-compose.generators-relational.test.yaml) which mounts a custom [startup.relational.test.sh](startup.relational.test.sh) that includes the `migration:generate` step for the freshly-created entities.
3. **Phase 3 (document CRUD)** — same for MongoDB. Reuses the existing [docker-compose.document.test.yaml](../../docker-compose.document.test.yaml) (no migrations needed for Mongoose).

## Running locally

Phase 1 only requires Node, no DB:

```bash
npm run test:generators:relational
npm run test:generators:document
```

Phase 2 / 3 require Docker (Compose v2):

```bash
npm run test:e2e:generators:relational:docker
npm run test:e2e:generators:document:docker
```

**Precondition:** your tracked working tree must be clean. The dirty-tree guard checks `git diff` (tracked changes only); brand-new untracked files outside the cleanup paths are fine.

## Cleanup model

Each orchestrator installs an `EXIT` trap that:

- `rm -rf src/articles src/tags src/comments` — removes only the generated resource directories.
- `git checkout -- src` — reverts every tracked change inside `src/`, including the auto-patched `src/app.module.ts` and any lint-fix incidentals.
- Phase 2: `find src/database/migrations -name "*-GeneratorE2E.ts" -delete` then `docker compose down`.
- Phase 3: `docker compose down -v` (drops Mongo volumes).

Cleanup is **bounded by path** — it never touches the repo root, `node_modules`, or `test/`. New untracked files in `test/` survive the run.

## Layout

```
test/generators/
  fixtures/
    matrix.ts                          # canonical entities + properties (consumed by file-assertion spec)
  helpers/
    auth.ts                            # admin login helper
    exec.ts                            # child_process wrapper
    payloads-relational.ts             # CRUD payload builder for TypeORM variant
    payloads-document.ts               # CRUD payload builder for Mongoose variant
  _matrix.sh                           # generator command list (sourced by both orchestrators)
  run-static.sh                        # Phase 1 orchestrator
  run-crud-relational.sh               # Phase 2 orchestrator
  run-crud-document.sh                 # Phase 3 orchestrator
  startup.relational.test.sh           # Custom Docker startup with migration:generate
  generators-file-assertions.e2e-spec.ts
  generators-relational.e2e-spec.ts
  generators-document.e2e-spec.ts
  README.md
```
