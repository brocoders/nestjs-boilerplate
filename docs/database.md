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

1. Go to `src/database/seeds` and create directory for your seed. For example `post`
1. Create 2 files: module and service. For example: `post-seed.module.ts` and `post-seed.service.ts`:

    ```ts
    // /src/database/seeds/post/post-seed.module.ts

    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { Post } from 'src/posts/entities/post.entity';
    import { PostSeedService } from './post-seed.service';

    @Module({
      imports: [TypeOrmModule.forFeature([Post])],
      providers: [PostSeedService],
      exports: [PostSeedService],
    })
    export class PostSeedModule {}
    ```

    ```ts
    // /src/database/seeds/post/post-seed.service.ts

    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Post } from 'src/posts/entities/post.entity';
    import { Repository } from 'typeorm';

    @Injectable()
    export class PostSeedService {
      constructor(
        @InjectRepository(Post)
        private repository: Repository<Post>,
      ) {}

      async run() {
        const count = await this.repository.count();

        if (count === 0) {
          await this.repository.save(
            this.repository.create({
              title: 'Hello',
              body: 'World',
            }),
          );
        }
      }
    }
    ```

1. Go to `src/database/seeds/seed.module.ts` and add your module to `imports`. For example:

    ```ts
    // /src/database/seeds/seed.module.ts

    // Some code here...
    import { PostSeedModule } from './post/post-seed.module';

    @Module({
      imports: [
        // Some code here...
        PostSeedModule,
      ],
    })
    export class SeedModule {}
    ```

1. Go to `src/database/seeds/run-seed.ts` and invoke method `run` from your service in `runSeed` function. For example:

    ```ts
    // /src/database/seeds/run-seed.ts

    // Some code here...
    import { PostSeedService } from './post/post-seed.service';

    const runSeed = async () => {
      // Some code here...
      await app.get(PostSeedService).run();
      // Some code here...
    };
    // Some code here...
    ```

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

Next: [Auth](auth.md)

GitHub: https://github.com/brocoders/nestjs-boilerplate