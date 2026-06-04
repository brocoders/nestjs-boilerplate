# Installation

This project uses PostgreSQL with Prisma.

---

## Table of Contents <!-- omit in toc -->

- [Comfortable development](#comfortable-development)
- [Links](#links)

---

## Comfortable development

1. Clone repository

   ```bash
   git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git my-app
   ```

1. Go to folder, and copy `env.example` as `.env`.

   ```bash
   cd my-app/
   cp env.example .env
   ```

1. Ensure PostgreSQL is running locally and `DATABASE_URL` points to it.

1. Install dependencies.

   ```bash
   npm install
   ```

1. Generate Prisma Client.

   ```bash
   npm run prisma:generate
   ```

1. Run migrations.

   ```bash
   npm run migration:run
   ```

1. Run seeds.

   ```bash
   npm run seed:run:relational
   ```

1. Run app in dev mode.

   ```bash
   npm run start:dev
   ```

1. Open <http://localhost:3000>

---

## Links

- Swagger: <http://localhost:3000/docs>

---

Previous: [Introduction](introduction.md)

Next: [Architecture](architecture.md)
