INSERT INTO "role" ("id", "name")
VALUES (1, 'Admin'), (2, 'User')
ON CONFLICT("id") DO UPDATE SET "name" = excluded."name";

INSERT INTO "status" ("id", "name")
VALUES (1, 'Active'), (2, 'Inactive')
ON CONFLICT("id") DO UPDATE SET "name" = excluded."name";

INSERT INTO "user" (
  "email",
  "password",
  "provider",
  "firstName",
  "lastName",
  "roleId",
  "statusId"
)
VALUES (
  'admin@example.com',
  '$2b$10$KKFvX.unAeLTP9GnYgu2LOINta71s.09Be/JiQBlO8G3mtl4xz8fS',
  'email',
  'Super',
  'Admin',
  1,
  1
)
ON CONFLICT("email") DO UPDATE SET
  "password" = excluded."password",
  "roleId" = excluded."roleId",
  "statusId" = excluded."statusId",
  "deletedAt" = NULL;

INSERT INTO "user" (
  "email",
  "password",
  "provider",
  "firstName",
  "lastName",
  "roleId",
  "statusId"
)
VALUES (
  'john.doe@example.com',
  '$2b$10$KKFvX.unAeLTP9GnYgu2LOINta71s.09Be/JiQBlO8G3mtl4xz8fS',
  'email',
  'John',
  'Doe',
  2,
  1
)
ON CONFLICT("email") DO UPDATE SET
  "password" = excluded."password",
  "roleId" = excluded."roleId",
  "statusId" = excluded."statusId",
  "deletedAt" = NULL;
