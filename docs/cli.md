# Command Line Interface (CLI)

---

## Table of Contents <!-- omit in toc -->

- [Generate resource](#generate-resource)
  - [For document oriented database (MongoDB + Mongoose)](#for-document-oriented-database-mongodb--mongoose)
  - [For relational database (PostgreSQL + TypeORM)](#for-relational-database-postgresql--typeorm)
  - [For both databases](#for-both-databases)

---

## Generate resource

Generate resource with the following commands:

### For document oriented database (MongoDB + Mongoose)
  
```bash
npm run generate:resource:document -- --name=ResourceName
```

Example:

```bash
npm run generate:resource:document -- --name=Category
```

### For relational database (PostgreSQL + TypeORM)

```bash
npm run generate:resource:relational -- --name=ResourceName
```

Example:

```bash
npm run generate:resource:relational -- --name=Category
```

### For both databases

```bash
npm run generate:resource:all-db -- --name=ResourceName
```

Example:

```bash
npm run generate:resource:all-db -- --name=Category
```

---

Previous: [Architecture](architecture.md)

Next: [Working with database](database.md)
