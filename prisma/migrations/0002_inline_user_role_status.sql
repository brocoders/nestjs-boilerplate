PRAGMA foreign_keys=off;

CREATE TABLE "user_new" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'email',
    "role" TEXT NOT NULL DEFAULT 'user',
    "socialId" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "photoId" TEXT,
    CONSTRAINT "user_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "file" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "user_new" (
    "id",
    "email",
    "emailVerified",
    "password",
    "provider",
    "role",
    "socialId",
    "firstName",
    "lastName",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "photoId"
)
SELECT
    "id",
    "email",
    CASE WHEN "statusId" = 1 THEN true ELSE false END,
    "password",
    "provider",
    CASE WHEN "roleId" = 1 THEN 'admin' ELSE 'user' END,
    "socialId",
    "firstName",
    "lastName",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "photoId"
FROM "user";

DROP TABLE "user";
ALTER TABLE "user_new" RENAME TO "user";

CREATE UNIQUE INDEX "UQ_e12875dfb3b1d92d7d7c5377e22" ON "user"("email");
CREATE UNIQUE INDEX "REL_75e2be4ce11d447ef43be0e374" ON "user"("photoId");
CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user"("socialId");
CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user"("firstName");
CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user"("lastName");

DROP TABLE IF EXISTS "role";
DROP TABLE IF EXISTS "status";

PRAGMA foreign_keys=on;
