# Ecommerce Backend

NestJS API for the multi-vendor e-commerce platform. Forked from
`brocoders/nestjs-boilerplate`, Postgres-only (Mongoose flavor stripped).

## Quick start

```bash
cp env-example-relational .env

# Generate fresh AUTH_*_SECRET values:
for v in JWT REFRESH FORGOT CONFIRM_EMAIL; do
  echo "AUTH_${v}_SECRET=$(openssl rand -hex 32)"
done
# (paste into .env, replacing the placeholder values)

docker compose up -d --build
docker compose exec api npm run migration:run
docker compose exec api npm run seed:run:relational
```

- API: http://localhost:3000/api/v1
- Swagger UI: http://localhost:3000/docs
- MailHog UI: http://localhost:1081
- Adminer: http://localhost:8081

## Architecture

Modular monolith following the boilerplate's hexagonal style:

```
src/<module>/
  domain/<entity>.ts                              # pure domain types
  dto/                                            # request/response DTOs
  infrastructure/persistence/
    <entity>.abstract.repository.ts               # port (abstract class)
    relational/
      entities/<entity>.entity.ts                 # TypeORM entity
      mappers/<entity>.mapper.ts                  # entity <-> domain
      repositories/<entity>.repository.ts         # adapter
      relational-persistence.module.ts            # DI wiring
  <module>.controller.ts
  <module>.service.ts
  <module>.service.spec.ts
  <module>.module.ts
```

## Modules added in this fork

- **redis** — `ioredis` client + BullMQ root configuration
- **utils/uuid** — UUID v7 generator (`uuidv7Generate()`)
- **locales** — supported UI locales (en, ar). `GET /api/v1/locales`
- **currencies** — ISO 4217 currencies (USD/EUR/SAR/AED/EGP). `GET /api/v1/currencies`
- **regions** — supported countries with default currency + locale (SA default, AE, EG). `GET /api/v1/regions`
- **settings** — single-row platform config singleton. `GET /api/v1/settings/public`
- **request-context** — AsyncLocalStorage holds region+locale resolved from `X-Region` + `Accept-Language` headers, honoring the `multi_region_enabled` flag
- **fx-rates** — daily FX rates from `fawazahmed0/currency-api`, scheduled by BullMQ at 02:00 UTC

## Conventions

- All new entity IDs use UUID v7 (time-ordered, sortable, not enumerable). Inherited boilerplate entities (User, Role, Status, Session) keep their numeric serial IDs.
- All money is integer minor units paired with a 3-letter ISO currency code. Floats are forbidden.
- Translatable fields use JSONB columns named `<field>_translations`, e.g. `name_translations: { en: '...', ar: '...' }`.
- Abstract repository ports are named `<entity>.abstract.repository.ts` (explicit naming — different from the boilerplate's ambiguous `user.repository.ts`).
- Tests use `it('should ...', ...)` per ESLint rule.

## Local dev gotchas

- The `Dockerfile` bakes `src/` and `.env` into the image. After editing source or env, rebuild with `docker compose up -d --build api` (a plain `restart` won't pick up the changes).
- `MAIL_HOST_PORT` (host-side mapping) is split from `MAIL_CLIENT_PORT` (in-network port tests use). Override `MAIL_HOST_PORT=1081` in `.env` if your machine already has port 1080 in use.
- Pre-commit husky runs lint + jest on the host (outside Docker). Run `npm install` on the host once after pulling so deps are in sync.

## Useful commands

```bash
# Test
docker compose exec api npm run test
docker compose exec api npm run test:e2e

# DB
docker compose exec api npm run migration:run
docker compose exec api npm run migration:revert
docker compose exec api npm run migration:generate -- src/database/migrations/<MigrationName>
docker compose exec api npm run seed:run:relational

# Manual FX fetch (don't wait for the 02:00 UTC cron)
docker compose exec api node -e "
  const { Queue } = require('bullmq');
  const q = new Queue('fx-rates', { connection: { host: 'redis', port: 6379 } });
  q.add('manual', {}, { removeOnComplete: 1 }).then(j => { console.log('Enqueued', j.id); q.close(); });
"
```
