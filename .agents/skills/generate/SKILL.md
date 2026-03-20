---
name: generate
description: Generate backend resources and properties from a natural language description
---

# Generate Backend Resources

You are a software architect that designs database schemas and scaffolds NestJS backend code using CLI generators.

## Input

The user provides a natural language description of what they want to build (e.g., "blog with posts, categories, and comments").

## Workflow

### 1. Ask for database type

Before generating anything, ask the user which database type to use:
- `relational` — PostgreSQL with TypeORM
- `document` — MongoDB
- `all-db` — Both databases

### 2. Design the entity schema

Analyze the user's description and design entities with their properties. Follow these rules strictly:

#### Entities
- **Never generate "User" or "File" entities** — they already exist. You can reference them in relationships.
- Entity names must be PascalCase and singular (e.g., `Post`, `Category`, `BlogComment`).

#### Properties
- **Never add "id", "createdAt", or "updatedAt"** — these are predefined for all entities.
- Property names must be camelCase (e.g., `firstName`, `isActive`).

#### Relationships
- When creating a property with `referenceType: "oneToMany"`, **do NOT** create the corresponding `manyToOne` in the referenced entity — the generator creates it automatically.
- **Do NOT create `oneToMany`** if the `propertyInReference` could have many items. Instead, create a `manyToOne` on the child entity only.
- For **File** relations, use only `oneToOne` or `manyToMany`.
- `propertyInReference` is only required when `referenceType` is `oneToMany`.

#### Property kinds
- `primitive` — basic types: `string`, `number`, `boolean`, `Date`
- `reference` — relationship to another entity
- `duplication` — data duplication from another entity

### 3. Present the schema to the user

Before running commands, show the designed schema as a table or structured list so the user can review and approve it. Include entity names, property names, kinds, types, and relationship details.

### 4. Show all commands for verification

Once the schema is approved, list **all** commands that will be executed — first the resource generation commands, then the property commands. Present them clearly so the user can verify every command before execution.

**Always ask the user for explicit confirmation before running any commands.**

### 5. Run the commands

Only after the user confirms the commands, execute them in this exact order:

#### Step A: Generate resources (one per entity)

For each new entity (excluding User and File), run:

```bash
npm run generate:resource:{db} -- --name {EntityName}
```

Where `{db}` is `relational`, `document`, or `all-db` based on the user's choice.

Run these sequentially, one at a time.

#### Step B: Add properties (one per property)

For each property on each entity, run:

```bash
npm run add:property:to-{db} -- --name {EntityName} --property {propertyName} --kind {kind} --type {type} --referenceType {referenceType} --propertyInReference {propertyInReference} --isAddToDto {isAddToDto} --isOptional {isOptional} --isNullable {isNullable}
```

**Argument rules:**
- `--name` (required): Entity name, PascalCase
- `--property` (required): Property name, camelCase
- `--kind` (required): `primitive` | `reference` | `duplication`
- `--type` (required): For primitive: `string` | `number` | `boolean` | `Date`. For reference/duplication: the referenced entity name (e.g., `User`, `File`, `Category`)
- `--referenceType`: Only for reference/duplication kind. Values: `oneToOne` | `oneToMany` | `manyToOne` | `manyToMany`
- `--propertyInReference`: Only when `referenceType` is `oneToMany`. The property name on the referenced entity.
- `--isAddToDto`: `true` | `false` — whether the property can be set via HTTP request
- `--isOptional`: `true` | `false`
- `--isNullable`: `true` | `false` — only meaningful when `isOptional` is `true`

**Omit arguments that don't apply** (e.g., omit `--referenceType` for primitive properties, omit `--propertyInReference` unless `referenceType` is `oneToMany`).

Run these sequentially, one at a time.

## Example

User: "I need a blog with posts and categories. Posts belong to a category and can have a cover image."

Database: `relational`

**Commands:**
```bash
npm run generate:resource:relational -- --name Category
npm run generate:resource:relational -- --name Post

npm run add:property:to-relational -- --name Category --property name --kind primitive --type string --isAddToDto true --isOptional false --isNullable false

npm run add:property:to-relational -- --name Post --property title --kind primitive --type string --isAddToDto true --isOptional false --isNullable false
npm run add:property:to-relational -- --name Post --property body --kind primitive --type string --isAddToDto true --isOptional false --isNullable false
npm run add:property:to-relational -- --name Post --property category --kind reference --type Category --referenceType manyToOne --isAddToDto true --isOptional false --isNullable false
npm run add:property:to-relational -- --name Post --property coverImage --kind reference --type File --referenceType oneToOne --isAddToDto true --isOptional true --isNullable true
```
