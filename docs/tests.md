# Tests

## Table of Contents <!-- omit in toc -->

- [Unit Tests](#unit-tests)
- [E2E Tests](#e2e-tests)
- [Tests in Docker](#tests-in-docker)
  - [For relational database](#for-relational-database)
  - [For document database](#for-document-database)

## Unit Tests

```bash
npm run test
```

## E2E Tests

```bash
npm run test:e2e
```

## Tests in Docker

### For relational database

```bash
docker compose -f docker-compose.relational.ci.yaml --env-file env-example-relational -p ci up --build --exit-code-from api && docker compose -p ci rm -svf
```

### For document database

```bash
docker compose -f docker-compose.document.ci.yaml --env-file env-example-document -p ci up --build --exit-code-from api && docker compose -p ci rm -svf
```

---

Previous: [File uploading](file-uploading.md)

Next: [Benchmarking](benchmarking.md)
