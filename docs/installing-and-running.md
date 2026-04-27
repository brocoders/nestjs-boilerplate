# Installation

This project uses [TypeORM](https://www.npmjs.com/package/typeorm) with [PostgreSQL](https://www.postgresql.org/) as the database.

---

## Table of Contents <!-- omit in toc -->

- [Comfortable development (PostgreSQL + TypeORM)](#comfortable-development-postgresql--typeorm)
- [Quick run (PostgreSQL + TypeORM)](#quick-run-postgresql--typeorm)
- [Links](#links)

---

## Comfortable development (PostgreSQL + TypeORM)

1. Copy `env-example-relational` as `.env`.

   ```bash
   cp env-example-relational .env
   ```

1. Change `DATABASE_HOST=postgres` to `DATABASE_HOST=localhost`

   Change `MAIL_HOST=maildev` to `MAIL_HOST=localhost`

1. Run additional container:

   ```bash
   docker compose up -d postgres adminer maildev redis
   ```

1. Install dependency

   ```bash
   npm install
   ```

1. Run migrations

   ```bash
   npm run migration:run
   ```

1. Run seeds

   ```bash
   npm run seed:run:relational
   ```

1. Run app in dev mode

   ```bash
   npm run start:dev
   ```

1. Open <http://localhost:3000>

---

## Quick run (PostgreSQL + TypeORM)

If you want quick run your app, you can use following commands:

1. Copy `env-example-relational` as `.env`.

   ```bash
   cp env-example-relational .env
   ```

1. Run containers

   ```bash
   docker compose up -d
   ```

1. For check status run

   ```bash
   docker compose logs
   ```

1. Open <http://localhost:3000>

---

## Links

- Swagger (API docs): <http://localhost:3000/docs>
- Adminer (client for DB): <http://localhost:8080>
- Maildev: <http://localhost:1080>

---

Previous: [Introduction](introduction.md)

Next: [Architecture](architecture.md)
