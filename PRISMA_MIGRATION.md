# Prisma Migration Guide

This project has been migrated from TypeORM to Prisma. Follow these steps to complete the setup:

## 1. Install Dependencies

```bash
npm install @prisma/client@^5.22.0
npm install -D prisma@^5.22.0
```

## 2. Update Environment Variables

Make sure your `.env` file includes the `DATABASE_URL`:

```env
DATABASE_URL=postgresql://root:secret@localhost:5432/api?schema=public
```

If using Docker, the host should be `postgres` instead of `localhost`:

```env
DATABASE_URL=postgresql://root:secret@postgres:5432/api?schema=public
```

## 3. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

## 4. Sync Database Schema (for existing databases)

If you already have a database with tables (from TypeORM migrations):

```bash
npm run schema:push
```

This will sync the Prisma schema with your existing database without running migrations.

## 5. Start the Application

```bash
npm run start:dev
```

## Available Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations (dev)
- `npm run prisma:migrate:deploy` - Apply migrations (production)
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run schema:push` - Push schema changes to database without migrations
- `npm run schema:pull` - Pull database schema to Prisma schema

## Migration from TypeORM

### What Changed:

1. **Database Client**: TypeORM → Prisma
2. **Schema Definition**: `*.entity.ts` files → `prisma/schema.prisma`
3. **Repositories**: TypeORM repositories → Prisma Client queries
4. **Migrations**: TypeORM migrations → Prisma migrations
5. **Mappers**: Updated to work with Prisma types

### Migrated Modules:

- ✅ Users
- ✅ Sessions
- ✅ Roles
- ✅ Statuses
- ✅ Files

### Breaking Changes:

- TypeORM-specific decorators and features removed
- Migration scripts updated to use Prisma CLI
- Seed scripts need to be updated to use Prisma Client

## Troubleshooting

### "Module '@prisma/client' has no exported member"

Run `npm run prisma:generate` to generate the Prisma Client.

### Permission errors with PostgreSQL

Make sure the database user has CREATE privileges:

```sql
ALTER SCHEMA public OWNER TO root;
GRANT ALL ON SCHEMA public TO root;
```

### Schema out of sync

Run `npm run schema:push` to sync without creating a migration, or `npm run prisma:migrate` to create a new migration.
