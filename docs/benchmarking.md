# Test benchmarking

## Table of Contents <!-- omit in toc -->

- [Apache Benchmark](#apache-benchmark)

## Apache Benchmark

```bash
docker run --rm jordi/ab -n 100 -c 100 -T application/json -H "Authorization: Bearer USER_TOKEN" -v 2 http://<server_ip>:3000/api/v1/users
```

---

Previous: [Tests](tests.md)

Next: [Automatic update of dependencies](automatic-update-dependencies.md)
