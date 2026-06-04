INSERT INTO "user" (
  "email",
  "emailVerified",
  "password",
  "provider",
  "role",
  "firstName",
  "lastName"
)
VALUES (
  'admin@example.com',
  true,
  '$2b$10$KKFvX.unAeLTP9GnYgu2LOINta71s.09Be/JiQBlO8G3mtl4xz8fS',
  'email',
  'admin',
  'Super',
  'Admin'
)
ON CONFLICT("email") DO UPDATE SET
  "password" = excluded."password",
  "role" = excluded."role",
  "emailVerified" = excluded."emailVerified",
  "deletedAt" = NULL;

INSERT INTO "user" (
  "email",
  "emailVerified",
  "password",
  "provider",
  "role",
  "firstName",
  "lastName"
)
VALUES (
  'john.doe@example.com',
  true,
  '$2b$10$KKFvX.unAeLTP9GnYgu2LOINta71s.09Be/JiQBlO8G3mtl4xz8fS',
  'email',
  'user',
  'John',
  'Doe'
)
ON CONFLICT("email") DO UPDATE SET
  "password" = excluded."password",
  "role" = excluded."role",
  "emailVerified" = excluded."emailVerified",
  "deletedAt" = NULL;
