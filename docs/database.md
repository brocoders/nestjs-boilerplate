# Work with database

In NestJS Boilerplate uses [TypeORM](https://www.npmjs.com/package/typeorm) and [PostgreSQL](https://www.postgresql.org/) for working with database, and all examples will for [PostgreSQL](https://www.postgresql.org/), but you can use any database.

---

## Table of Contents

- [Working with database schema](#working-with-database-schema)
  - [Generate migration](#generate-migration)
  - [Run migration](#run-migration)
  - [Revert migration](#revert-migration)
  - [Drop all tables in database](#drop-all-tables-in-database)
- [Seeding](#seeding)
  - [Creating seeds](#creating-seeds)
  - [Run seed](#run-seed)
- [Performance optimization](#performance-optimization)
  - [Indexes and Foreign Keys](#indexes-and-foreign-keys)
  - [Max connections](#max-connections)

---

## Working with database schema

### Generate migration

1. Create entity file with extension `.entity.ts`. For example `post.entity.ts`:

    ```ts
    // /src/posts/entities/post.entity.ts

    import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
    import { EntityHelper } from 'src/utils/entity-helper';

    @Entity()
    export class Post extends EntityHelper {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      title: string;

      @Column()
      body: string;

      // Here any fields what you need
    }
    ```

1. Next, generate migration file:

    ```bash
    npm run migration:generate -- src/database/migrations/CreatePostTable
    ```

1. Apply this migration to database via [npm run migration:run](#run-migration).

### Run migration

```bash
npm run migration:run
```

### Revert migration

```bash
npm run migration:revert
```

### Drop all tables in database

```bash
npm run schema:drop
```

---

## Seeding

### Creating seeds

1. Create seed file with `npm run seed:create -- --name=Post`. Where `Post` is name of entity.
1. Go to `src/database/seeds/post/post-seed.service.ts`.
1. In `run` method extend your logic.
1. Run [npm run seed:run](#run-seed)

### Run seed

```bash
npm run seed:run
```

---

## Performance optimization

### Indexes and Foreign Keys

Don't forget to create `indexes` on the Foreign Keys (FK) columns (if needed), because by default PostgreSQL [does not automatically add indexes to FK](https://stackoverflow.com/a/970605/18140714).

### Max connections

Set the optimal number of [max connections](https://node-postgres.com/apis/pool) to database for your application in `/.env`:

```txt
DATABASE_MAX_CONNECTIONS=100
```

You can think of this parameter as how many concurrent database connections your application can handle.

---

Previous: [Installing and Running](installing-and-running.md)

Next: [Auth](auth.md)
