# Database

## Table of Contents <!-- omit in toc -->

- [About database](#about-database)
- [Working with database schema](#working-with-database-schema)
  - [Generate Prisma Client](#generate-prisma-client)
  - [Create migration](#create-migration)
  - [Run migration](#run-migration)
  - [Reset schema](#reset-schema)
- [Seeding](#seeding)
- [Performance optimization](#performance-optimization)
  - [Indexes and Foreign Keys](#indexes-and-foreign-keys)
  - [Max connections](#max-connections)

---

## About database

This project uses PostgreSQL with Prisma.

The Prisma schema lives in `prisma/schema.prisma`, migrations live in `prisma/migrations`, and application database access goes through repository interfaces in each module.

## Working with database schema

### Generate Prisma Client

```bash
npm run prisma:generate
```

Run this after changing `prisma/schema.prisma` or after installing dependencies.

### Create migration

Create a migration without applying it:

```bash
npm run migration:create
```

Create and apply a migration in development:

```bash
npm run migration:generate
```

### Run migration

Apply committed migrations:

```bash
npm run migration:run
```

### Reset schema

Drop and recreate the local database schema:

```bash
npm run migration:reset
```

## Seeding

Seeds are defined in `src/database/seeds/relational/run-seed.ts`.

Run seeds:

```bash
npm run seed:run:relational
```

Current seeds create default roles, statuses, and example admin/user accounts.

## Performance optimization

### Indexes and Foreign Keys

Keep indexes on frequently filtered columns and foreign keys. PostgreSQL does not automatically add indexes to foreign key columns.

### Max connections

Set the optimal number of database connections in `.env`:

```txt
DATABASE_MAX_CONNECTIONS=100
```

---

Previous: [Command Line Interface](cli.md)

Next: [Auth](auth.md)
