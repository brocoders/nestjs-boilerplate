# NestJS REST API boilerplate

## Description

NestJS REST API boilerplate for typical project

## Features

- Database ([typeorm](https://www.npmjs.com/package/typeorm)). :white_check_mark:
- Seeding ([typeorm-seeding](https://www.npmjs.com/package/typeorm-seeding)). :white_check_mark:
- Config Service ([@nestjs/config](https://www.npmjs.com/package/@nestjs/config)). :white_check_mark:
- Mailing ([nodemailer](https://www.npmjs.com/package/nodemailer), [@nestjs-modules/mailer](https://www.npmjs.com/package/@nestjs-modules/mailer)). :white_check_mark:
- Sign in and sign up via email. :white_check_mark:
- Social sign in (Apple, Facebook, Google, Twitter). :white_check_mark:
- Admin and User roles. :white_check_mark:
- Nest CRUD ([@nestjsx/crud](https://www.npmjs.com/package/@nestjsx/crud)). :white_check_mark:
- I18N ([nestjs-i18n](https://www.npmjs.com/package/nestjs-i18n)). :white_check_mark:
- File uploads. Support local and Amazon S3 drivers. :white_check_mark:
- Swagger. :white_check_mark:
- E2E and units tests. :white_check_mark:
- Docker. :white_check_mark:
- CI (Github Actions). :white_check_mark:

## Quick run

```bash
cp env-example .env

docker-compose up -d
```

For check status run

```bash
docker-compose logs
```

## Links

- Swagger: http://localhost:3000/docs
- Adminer (client for DB): http://localhost:8080
- Maildev: http://localhost:1080

## Comfortable development

```bash
cp env-example .env
```

Change `DATABASE_HOST=postgres` to `DATABASE_HOST=localhost`

Change `MAIL_HOST=maildev` to `MAIL_HOST=localhost`

Run additional container:

```bash
docker-compose up -d postgres adminer maildev redis
```

```bash
npm install

npm run migration:run

npm run seed:run

npm run start:dev
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Test in Docker

```bash
docker-compose -f docker-compose.ci.yaml --env-file env-example -p ci up --build --exit-code-from api && docker-compose -p ci rm -svf
```

## Test benchmarking

```bash
docker run --rm jordi/ab -n 100 -c 100 -T application/json -H "Authorization: Bearer USER_TOKEN" -v 2 http://<server_ip>:3000/api/v1/users
```
