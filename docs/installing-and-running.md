# Installation

---

## Table of Contents

- [Comfortable development](#comfortable-development)
- [Quick run](#quick-run)
- [Links](#links)

---

## Comfortable development

1. Clone repository

    ```bash
    git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git my-app
    ```

1. Go to folder, and copy `env-example` as `.env`.

    ```bash
    cd my-app/
    cp env-example .env
    ```

1. Change `DATABASE_HOST=postgres` to `DATABASE_HOST=localhost`
   Change `MAIL_HOST=maildev` to `MAIL_HOST=localhost`

1. Run additional container:

    ```bash
    docker compose up -d postgres adminer maildev redis
    ```

1. Install dependency

    ```bash
    npm install
    ```

1. Run migrations

    ```bash
    npm run migration:run
    ```

1. Run seeds

    ```bash
    npm run seed:run
    ```

1. Run app in dev mode

    ```bash
    npm run start:dev
    ```

1. Open http://localhost:3000

---

## Quick run

If you want quick run your app, you can use following commands:

1. Clone repository

    ```bash
    git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git my-app
    ```

1. Go to folder, and copy `env-example` as `.env`.

    ```bash
    cd my-app/
    cp env-example .env
    ```

1. Run containers

    ```bash
    docker compose up -d
    ```

1. For check status run

    ```bash
    docker compose logs
    ```

1. Open http://localhost:3000

---

## Links

- Swagger (API docs): http://localhost:3000/docs
- Adminer (client for DB): http://localhost:8080
- Maildev: http://localhost:1080

---

Next: [Working with database](database.md)

GitHub: https://github.com/brocoders/nestjs-boilerplate
