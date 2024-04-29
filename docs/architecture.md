# Architecture

---

## Table of Contents <!-- omit in toc -->

- [Hexagonal Architecture](#hexagonal-architecture)
- [Motivation](#motivation)
- [Pitfalls](#pitfalls)
- [FAQ](#faq)
  - [I don't want to use Hexagonal Architecture. How can I use a traditional (three-tier) architecture for NestJS?](#i-dont-want-to-use-hexagonal-architecture-how-can-i-use-a-traditional-three-tier-architecture-for-nestjs)

---

## Hexagonal Architecture

NestJS Boilerplate is based on [Hexagonal Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)). This architecture is also known as Ports and Adapters.

![Hexagonal Architecture Diagram](https://github.com/brocoders/nestjs-boilerplate/assets/6001723/6a6a763e-d1c9-43cc-910a-617cda3a71db)

## Motivation

The main reason for using Hexagonal Architecture is to separate the business logic from the infrastructure. This separation allows us to easily change the database, the way of uploading files, or any other infrastructure without changing the business logic.

## Pitfalls

Hexagonal Architecture takes more effort to implement, but it gives more flexibility and scalability. [If the time for your project is critical, you can use Three-tier architecture.](#i-dont-want-to-use-hexagonal-architecture-how-can-i-use-a-traditional-three-tier-architecture-for-nestjs)

---

## FAQ

### I don't want to use Hexagonal Architecture. How can I use a traditional (three-tier) architecture for NestJS?

You still can use [Three-tier Architecture](https://en.wikipedia.org/wiki/Multitier_architecture#Three-tier_architecture) `[controllers] -> [services] -> [data access]` near [Hexagonal Architecture](#hexagonal-architecture).

Database example: Just keep the existing approach of getting data from the database for auth, files, etc, as is (with Hexagonal Architecture), but for new modules use repositories from TypeORM or models from Mongoose directly in [services](https://docs.nestjs.com/providers#services). Entities and Schemas are ready for this.

---

Previous: [Installing and Running](installing-and-running.md)

Next: [Working with database](database.md)
