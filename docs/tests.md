# Tests

## Table of Contents <!-- omit in toc -->

- [Unit Tests](#unit-tests)
- [E2E Tests](#e2e-tests)
- [Tests in Docker](#tests-in-docker)

## Unit Tests

```bash
npm run test
```

## E2E Tests

```bash
npm run test:e2e
```

## Tests in Docker

```bash
docker compose -f docker-compose.relational.ci.yaml --env-file env-example-relational -p ci up --build --exit-code-from api && docker compose -p ci rm -svf
```

---

Previous: [File uploading](file-uploading.md)

Next: [Benchmarking](benchmarking.md)
