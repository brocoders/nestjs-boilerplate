# Command Line Interface (CLI)

---

## Table of Contents <!-- omit in toc -->

- [Database commands](#database-commands)

---

## Database commands

Generate Prisma Client:

```bash
npm run prisma:generate
```

Create a D1 migration file:

```bash
npm run migration:create -- create_table_name
```

Regenerate the initial D1 migration SQL from `prisma/schema.prisma`:

```bash
npm run migration:generate
```

Apply committed migrations to the remote D1 database:

```bash
npm run migration:run
```

Recommended update flow when the schema changes:

1. Edit `prisma/schema.prisma`.
2. Run `npm run prisma:generate`.
3. Run `npm run migration:generate`.
4. Review `prisma/migrations/0001_init.sql`.
5. Run `npm run migration:run`.
6. Run `npm run d1:seed:remote` only if the seed data also needs to change.

Seed remote D1:

```bash
npm run d1:seed:remote
```

---

Previous: [Architecture](architecture.md)

Next: [Database](database.md)
