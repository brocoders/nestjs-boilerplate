# Development Guidelines

This repository uses the NestJS framework with a hexagonal architecture. Follow these conventions when contributing.

## Code Style
- Use Node `22.14.0` as defined in `.nvmrc`.
- Run `npm install` to install dependencies.
- Format and lint code with `npm run lint -- --fix`. Prettier uses single quotes and trailing commas.
- Commit messages must follow the Conventional Commits specification.

## Testing
- Run unit tests with `npm test`.
- Run e2e tests with `npm run test:e2e`.
- Docker based tests are available via:
  - `npm run test:e2e:relational:docker`
  - `npm run test:e2e:document:docker`

## Best Practices
### NestJS
- Use Modules, Controllers and Services to keep code modular.
- Follow dependency injection patterns and avoid global state.
- Use `ClassSerializerInterceptor` for serialization as shown in `docs/serialization.md`.
- Organise code according to the hexagonal architecture described in `docs/architecture.md`.

### TypeORM
- Create migrations with `npm run migration:generate` and run them with `npm run migration:run`.
- Keep repository methods single–purpose as recommended in `docs/architecture.md`.
- Add indexes on foreign keys and adjust `DATABASE_MAX_CONNECTIONS` according to `docs/database.md`.
- Seed data using the scripts from `docs/database.md` (`npm run seed:create:relational` and `npm run seed:run:relational`).

### Mongoose
- Design schemas carefully and review the referenced MongoDB best practice links in `docs/database.md`.
- Seeds can be created with `npm run seed:create:document` and executed via `npm run seed:run:document`.

### Configuration
- Access configuration values via `configService.get('key', { infer: true })` for type safety.

### Mailing
- `nodemailer` is used for sending emails. Keep templates in a dedicated folder and avoid sending emails inside controllers.

### Authentication & Roles
- Support email and social providers (Apple, Facebook, Google). Refer to `docs/auth.md` for flow details.
- Use JWT strategy with refresh tokens and guard protected routes with the appropriate guards.
- Keep admin and user role logic in dedicated modules.

### Internationalization
- Use `nestjs-i18n` and keep translation files under `src/i18n`.

### File Uploads
- Local and Amazon S3 drivers are supported. Configuration examples are available in `docs/file-uploading.md`.
- Avoid storing large files in the repository; use S3 or another external storage in production.

### API Documentation
- Expose Swagger at `/docs` as configured in `main.ts`.

### Continuous Integration
- This project uses GitHub Actions. Ensure lint and tests pass before pushing.

