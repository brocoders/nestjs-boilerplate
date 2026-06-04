# Database

## Table of Contents <!-- omit in toc -->

- [About database](#about-database)
- [Working with database schema](#working-with-database-schema)
  - [Generate Prisma Client](#generate-prisma-client)
  - [Create migration](#create-migration)
  - [Run migrations](#run-migrations)
- [Seeding](#seeding)
- [Cloudflare configuration](#cloudflare-configuration)

---

## About database

This branch uses Cloudflare D1 with Prisma.

The Prisma schema lives in `prisma/schema.prisma`, D1 migrations live in `prisma/migrations`, and seed SQL lives in `prisma/seed.sql`.

D1 is SQLite-backed. Prisma uses `@prisma/adapter-d1` with Cloudflare D1 credentials from `.env`; no `wrangler.toml` is required.

## Working with database schema

### Migration flow when the database changes

When you update the data model, use this flow:

1. Edit `prisma/schema.prisma`.
2. Regenerate Prisma Client:

   ```bash
   npm run prisma:generate
   ```

3. Regenerate the SQL migration from the current schema:

   ```bash
   npm run migration:generate
   ```

4. Review the generated SQL in `prisma/migrations/0001_init.sql`.
5. Apply the migration to remote D1:

   ```bash
   npm run migration:run
   ```

6. If the schema change affects initial data, refresh the seed:

   ```bash
   npm run d1:seed:remote
   ```

This branch currently keeps a single committed migration file, so `migration:generate` rewrites the current baseline SQL instead of creating incremental `0002`, `0003`, ... files.

### Generate Prisma Client

```bash
npm run prisma:generate
```

Run this after changing `prisma/schema.prisma` or after installing dependencies.

### Create migration

Create an empty D1 migration file:

```bash
npm run migration:create -- create_table_name
```

Regenerate the initial migration SQL from the Prisma schema:

```bash
npm run migration:generate
```

### Run migrations

Apply committed migrations remotely:

```bash
npm run migration:run
```

## Seeding

Seed remote D1:

```bash
npm run d1:seed:remote
```

Current seeds create default roles, statuses, and example admin/user accounts.

## Cloudflare configuration

Create the database:

```bash
CLOUDFLARE_DATABASE_NAME=nestjs-boilerplate-d1 npm run d1:create
```

Copy the returned database ID into `.env` as `CLOUDFLARE_DATABASE_ID`.

Set these variables in `.env`:

```txt
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_D1_TOKEN=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_SHADOW_DATABASE_ID=
CLOUDFLARE_DATABASE_NAME=nestjs-boilerplate-d1
```

---

Previous: [Command Line Interface](cli.md)

Next: [Auth](auth.md)
