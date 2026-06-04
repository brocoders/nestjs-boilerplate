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

Create a Prisma migration without applying it:

```bash
npm run migration:create
```

Create and apply a Prisma migration:

```bash
npm run migration:generate
```

Apply committed migrations:

```bash
npm run migration:run
```

Reset the local schema:

```bash
npm run migration:reset
```

Run relational seeds:

```bash
npm run seed:run:relational
```

---

Previous: [Architecture](architecture.md)

Next: [Database](database.md)
