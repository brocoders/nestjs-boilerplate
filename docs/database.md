# Database

## Table of Contents <!-- omit in toc -->

- [About databases](#about-databases)
- [Working with database schema (TypeORM)](#working-with-database-schema-typeorm)
  - [Generate migration](#generate-migration)
  - [Run migration](#run-migration)
  - [Revert migration](#revert-migration)
  - [Drop all tables in database](#drop-all-tables-in-database)
- [Working with database schema (Mongoose)](#working-with-database-schema-mongoose)
  - [Create schema](#create-schema)
- [Seeding (TypeORM)](#seeding-typeorm)
  - [Creating seeds (TypeORM)](#creating-seeds-typeorm)
  - [Run seed (TypeORM)](#run-seed-typeorm)
  - [Factory and Faker (TypeORM)](#factory-and-faker-typeorm)
- [Seeding (Mongoose)](#seeding-mongoose)
  - [Creating seeds (Mongoose)](#creating-seeds-mongoose)
  - [Run seed (Mongoose)](#run-seed-mongoose)
- [Performance optimization (PostgreSQL + TypeORM)](#performance-optimization-postgresql--typeorm)
  - [Indexes and Foreign Keys](#indexes-and-foreign-keys)
  - [Max connections](#max-connections)
- [Performance optimization (MongoDB + Mongoose)](#performance-optimization-mongodb--mongoose)
  - [Design schema](#design-schema)
- [Switch PostgreSQL to MySQL](#switch-postgresql-to-mysql)

---

## About databases

Boilerplate supports two types of databases: PostgreSQL with TypeORM and MongoDB with Mongoose. You can choose one of them or use both in your project. The choice of database depends on the requirements of your project.

For support of both databases used [Hexagonal Architecture](architecture.md#hexagonal-architecture).

## Working with database schema (TypeORM)

### Generate migration

1. Create entity file with extension `.entity.ts`. For example `post.entity.ts`:

   ```ts
   // /src/posts/infrastructure/persistence/relational/entities/post.entity.ts

   import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
   import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

   @Entity()
   export class Post extends EntityRelationalHelper {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     title: string;

     @Column()
     body: string;

     // Here any fields that you need
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

## Working with database schema (Mongoose)

### Create schema

1. Create entity file with extension `.schema.ts`. For example `post.schema.ts`:

   ```ts
   // /src/posts/infrastructure/persistence/document/entities/post.schema.ts

   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
   import { HydratedDocument } from 'mongoose';

   export type PostSchemaDocument = HydratedDocument<PostSchemaClass>;

   @Schema({
     timestamps: true,
     toJSON: {
       virtuals: true,
       getters: true,
     },
   })
   export class PostSchemaClass extends EntityDocumentHelper {
     @Prop()
     title: string;

     @Prop()
     body: string;

     // Here any fields that you need
   }

   export const PostSchema = SchemaFactory.createForClass(PostSchemaClass);
   ```

---

## Seeding (TypeORM)

### Creating seeds (TypeORM)

1. Create seed file with `npm run seed:create:relational -- --name Post`. Where `Post` is name of entity.
1. Go to `src/database/seeds/relational/post/post-seed.service.ts`.
1. In `run` method extend your logic.
1. Run [npm run seed:run:relational](#run-seed-typeorm)

### Run seed (TypeORM)

```bash
npm run seed:run:relational
```

### Factory and Faker (TypeORM)

1. Install faker:

    ```bash
    npm i --save-dev @faker-js/faker
    ```

1. Create `src/database/seeds/relational/user/user.factory.ts`:

    ```ts
    import { faker } from '@faker-js/faker';
    import { RoleEnum } from '../../../../roles/roles.enum';
    import { StatusEnum } from '../../../../statuses/statuses.enum';
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
    import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
    import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

    @Injectable()
    export class UserFactory {
      constructor(
        @InjectRepository(UserEntity)
        private repositoryUser: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private repositoryRole: Repository<RoleEntity>,
        @InjectRepository(StatusEntity)
        private repositoryStatus: Repository<StatusEntity>,
      ) {}

      createRandomUser() {
        // Need for saving "this" context
        return () => {
          return this.repositoryUser.create({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: this.repositoryRole.create({
              id: RoleEnum.user,
              name: 'User',
            }),
            status: this.repositoryStatus.create({
              id: StatusEnum.active,
              name: 'Active',
            }),
          });
        };
      }
    }
    ```

1. Make changes in `src/database/seeds/relational/user/user-seed.service.ts`:

    ```ts
    // Some code here...
    import { UserFactory } from './user.factory';
    import { faker } from '@faker-js/faker';

    @Injectable()
    export class UserSeedService {
      constructor(
        // Some code here...
        private userFactory: UserFactory,
      ) {}

      async run() {
        // Some code here...

        await this.repository.save(
          faker.helpers.multiple(this.userFactory.createRandomUser(), {
            count: 5,
          }),
        );
      }
    }
    ```

1. Make changes in `src/database/seeds/relational/user/user-seed.module.ts`:

    ```ts
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    
    import { UserSeedService } from './user-seed.service';
    import { UserFactory } from './user.factory';

    import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
    import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
    import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([UserEntity, Role, Status])],
      providers: [UserSeedService, UserFactory],
      exports: [UserSeedService, UserFactory],
    })
    export class UserSeedModule {}

    ```

1. Run seed:

    ```bash
    npm run seed:run
    ```

---

## Seeding (Mongoose)

### Creating seeds (Mongoose)

1. Create seed file with `npm run seed:create:document -- --name Post`. Where `Post` is name of entity.
1. Go to `src/database/seeds/document/post/post-seed.service.ts`.
1. In `run` method extend your logic.
1. Run [npm run seed:run:document](#run-seed-mongoose)

### Run seed (Mongoose)

```bash
npm run seed:run:document
```

---

## Performance optimization (PostgreSQL + TypeORM)

### Indexes and Foreign Keys

Don't forget to create `indexes` on the Foreign Keys (FK) columns (if needed), because by default PostgreSQL [does not automatically add indexes to FK](https://stackoverflow.com/a/970605/18140714).

### Max connections

Set the optimal number of [max connections](https://node-postgres.com/apis/pool) to database for your application in `/.env`:

```txt
DATABASE_MAX_CONNECTIONS=100
```

You can think of this parameter as how many concurrent database connections your application can handle.

## Performance optimization (MongoDB + Mongoose)

### Design schema

Designing schema for MongoDB is completely different from designing schema for relational databases. For best performance, you should design your schema according to:

1. [MongoDB Schema Design Anti-Patterns](https://www.mongodb.com/developer/products/mongodb/schema-design-anti-pattern-massive-arrays)
1. [MongoDB Schema Design Best Practices](https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/)

## Switch PostgreSQL to MySQL

If you want to use `MySQL` instead of `PostgreSQL`, you can make the changes after following the complete guide given [here](installing-and-running.md).

Once you have completed all the steps, you should have a running app.
![image](https://github.com/user-attachments/assets/ec60b61a-65e6-43e2-9bcf-72dad4c8a9fa)

If you've made it this far, it only requires a few changes to switch from `PostgreSQL` to `MySQL`.

**Change the `.env` file to the following:**

```env
DATABASE_TYPE=mysql
# set "localhost" if you are running app on local machine
# set "mysql" if you are running app on docker
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=secret
DATABASE_NAME=app
```

**Change the `docker-compose.yml` to the following:**

```yml
services:
  mysql:
    image: mysql:9.2.0
    ports:
      - ${DATABASE_PORT}:3306
    volumes:
      - mysql-boilerplate-db:/var/lib/mysql
    environment:
      MYSQL_USER: ${DATABASE_USERNAME}
      MYSQL_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_DATABASE: ${DATABASE_NAME}

  # other services here...

volumes:
  # other volumes here...
  mysql-boilerplate-db:
```

After completing the above setup, run Docker with the following command:

```bash
docker compose up -d mysql adminer maildev
```

All three services should be running as shown below:

![image](https://github.com/user-attachments/assets/73e10325-66ed-46ca-a0c5-45791ef0750f)

Once your services are up and running, you're almost halfway through.

Now install the MySQL client:

```bash
npm i mysql2 --save
```

**Delete the existing migration file and generate a new one with the following script:**

```bash
npm run migration:generate -- src/database/migrations/newMigration --pretty=true
```

Run migrations:

```bash
npm run migration:run
```

Run seeds:

```bash
npm run seed:run:relational
```

Run the app in dev mode:

```bash
npm run start:dev
```

Open <http://localhost:3000>

To set up Adminer:

Open the running port in your browser.
Open <http://localhost:8080>

![image](https://github.com/user-attachments/assets/f4b86daa-d93f-4ae9-a9e3-3c29bb3bba9d)

Running App:
![image](https://github.com/user-attachments/assets/5dc0609d-5f6d-4176-918d-1744906f4f88)
![image](https://github.com/user-attachments/assets/ff2201a6-d834-4c8b-9ab7-b9413a0a95c1)

---

Previous: [Command Line Interface](cli.md)

Next: [Auth](auth.md)
