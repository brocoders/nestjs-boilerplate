# Command Line Interface (CLI)

---

## Table of Contents <!-- omit in toc -->

- [Generate resource](#generate-resource)
  - [For document oriented database (MongoDB + Mongoose)](#for-document-oriented-database-mongodb--mongoose)
  - [For relational database (PostgreSQL + TypeORM)](#for-relational-database-postgresql--typeorm)
  - [For both databases](#for-both-databases)
- [Add property to resource](#add-property-to-resource)
  - [Property for document oriented database (MongoDB + Mongoose)](#property-for-document-oriented-database-mongodb--mongoose)
  - [Property for relational database (PostgreSQL + TypeORM)](#property-for-relational-database-postgresql--typeorm)
  - [Property for both databases](#property-for-both-databases)

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

## Add property to resource

### Property for document oriented database (MongoDB + Mongoose)

```bash
npm run add:property:to-document
```

### Property for relational database (PostgreSQL + TypeORM)

```bash
npm run add:property:to-relational
```

### Property for both databases

```bash
npm run add:property:to-all-db
```

---

Previous: [Architecture](architecture.md)

Next: [Working with database](database.md)
