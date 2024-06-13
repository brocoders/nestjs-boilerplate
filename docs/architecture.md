# Architecture

---

## Table of Contents <!-- omit in toc -->

- [Hexagonal Architecture](#hexagonal-architecture)
- [Motivation](#motivation)
- [Recommendations](#recommendations)
  - [Repository](#repository)
- [Pitfalls](#pitfalls)
- [FAQ](#faq)
  - [Is there a way to generate a new resource (controller, service, DTOs, etc) with Hexagonal Architecture?](#is-there-a-way-to-generate-a-new-resource-controller-service-dtos-etc-with-hexagonal-architecture)
  - [I don't want to use Hexagonal Architecture. How can I use a traditional (three-tier) architecture for NestJS?](#i-dont-want-to-use-hexagonal-architecture-how-can-i-use-a-traditional-three-tier-architecture-for-nestjs)

---

## Hexagonal Architecture

NestJS Boilerplate is based on [Hexagonal Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)). This architecture is also known as Ports and Adapters.

![Hexagonal Architecture Diagram](https://github.com/brocoders/nestjs-boilerplate/assets/6001723/6a6a763e-d1c9-43cc-910a-617cda3a71db)

## Motivation

The main reason for using Hexagonal Architecture is to separate the business logic from the infrastructure. This separation allows us to easily change the database, the way of uploading files, or any other infrastructure without changing the business logic.

## Recommendations

### Repository

Don't try to create universal methods in the repository because they are difficult to extend during the project's life. Instead of this create methods with a single responsibility.

```typescript
// ❌
export class UsersRelationalRepository implements UserRepository {
  async find(condition: UniversalConditionInterface): Promise<User> {
    // ...
  }
}

// ✅
export class UsersRelationalRepository implements UserRepository {
  async findByEmail(email: string): Promise<User> {
    // ...
  }
  
  async findByRoles(roles: string[]): Promise<User> {
    // ...
  }
  
  async findByIds(ids: string[]): Promise<User> {
    // ...
  }
}
```

## Pitfalls

Hexagonal Architecture can take more effort to implement, but it gives more flexibility and scalability. [You still can use Three-tier architecture](#i-dont-want-to-use-hexagonal-architecture-how-can-i-use-a-traditional-three-tier-architecture-for-nestjs), but we recommend using Hexagonal Architecture. Try to create resources via our [CLI](cli.md), you will be sure that makes the same time (maybe even less 🤔) as Three-tier architecture.

---

## FAQ

### Is there a way to generate a new resource (controller, service, DTOs, etc) with Hexagonal Architecture?

Yes, you can use the [CLI](cli.md) to generate a new resource with Hexagonal Architecture.

### I don't want to use Hexagonal Architecture. How can I use a traditional (three-tier) architecture for NestJS?

You still can use [Three-tier Architecture](https://en.wikipedia.org/wiki/Multitier_architecture#Three-tier_architecture) `[controllers] -> [services] -> [data access]` near [Hexagonal Architecture](#hexagonal-architecture).

Database example: Just keep the existing approach of getting data from the database for auth, files, etc, as is (with Hexagonal Architecture), but for new modules use repositories from TypeORM or models from Mongoose directly in [services](https://docs.nestjs.com/providers#services). Entities and Schemas are ready for this.

---

Previous: [Installing and Running](installing-and-running.md)

Next: [Command Line Interface](cli.md)
