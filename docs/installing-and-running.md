# Installation

This branch uses Cloudflare D1 with Prisma.

---

## Table of Contents <!-- omit in toc -->

- [Comfortable development](#comfortable-development)
- [Links](#links)

---

## Comfortable development

1. Clone repository.

   ```bash
   git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git my-app
   ```

1. Go to folder, and copy `env.example` as `.env`.

   ```bash
   cd my-app/
   cp env.example .env
   ```

1. Install dependencies.

   ```bash
   npm install
   ```

1. Create a D1 database in Cloudflare.

   ```bash
   CLOUDFLARE_DATABASE_NAME=nestjs-boilerplate-d1 npm run d1:create
   ```

1. Add `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_TOKEN`, `CLOUDFLARE_DATABASE_ID`, and `CLOUDFLARE_DATABASE_NAME` to `.env`.

1. Generate Prisma Client.

   ```bash
   npm run prisma:generate
   ```

1. Run remote D1 migrations.

   ```bash
   npm run migration:run
   ```

1. Seed remote D1.

   ```bash
   npm run d1:seed:remote
   ```

1. Run app in dev mode.

   ```bash
   npm run start:dev
   ```

1. Open <http://localhost:3000>

---

## Links

- Cloudflare D1 Prisma tutorial: <https://developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm/>

---

Previous: [Introduction](introduction.md)

Next: [Architecture](architecture.md)
