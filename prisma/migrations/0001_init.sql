-- CreateTable
CREATE TABLE "file" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user" (
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

-- CreateTable
CREATE TABLE "session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "hash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_e12875dfb3b1d92d7d7c5377e22" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "REL_75e2be4ce11d447ef43be0e374" ON "user"("photoId");

-- CreateIndex
CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user"("socialId");

-- CreateIndex
CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user"("firstName");

-- CreateIndex
CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user"("lastName");

-- CreateIndex
CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session"("userId");
