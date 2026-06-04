import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

import { RoleEnum } from '../../../roles/roles.enum';
import { StatusEnum } from '../../../statuses/statuses.enum';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: getDatabaseUrl(),
  }),
});

async function runSeed() {
  await prisma.role.upsert({
    where: { id: RoleEnum.user },
    update: { name: 'User' },
    create: { id: RoleEnum.user, name: 'User' },
  });

  await prisma.role.upsert({
    where: { id: RoleEnum.admin },
    update: { name: 'Admin' },
    create: { id: RoleEnum.admin, name: 'Admin' },
  });

  await prisma.status.upsert({
    where: { id: StatusEnum.active },
    update: { name: 'Active' },
    create: { id: StatusEnum.active, name: 'Active' },
  });

  await prisma.status.upsert({
    where: { id: StatusEnum.inactive },
    update: { name: 'Inactive' },
    create: { id: StatusEnum.inactive, name: 'Inactive' },
  });

  const countAdmin = await prisma.user.count({
    where: {
      roleId: RoleEnum.admin,
      deletedAt: null,
    },
  });

  if (!countAdmin) {
    await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('secret', await bcrypt.genSalt()),
        role: { connect: { id: RoleEnum.admin } },
        status: { connect: { id: StatusEnum.active } },
      },
    });
  }

  const countUser = await prisma.user.count({
    where: {
      roleId: RoleEnum.user,
      deletedAt: null,
    },
  });

  if (!countUser) {
    await prisma.user.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('secret', await bcrypt.genSalt()),
        role: { connect: { id: RoleEnum.user } },
        status: { connect: { id: StatusEnum.active } },
      },
    });
  }
}

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const url = new URL(
    `postgresql://${process.env.DATABASE_HOST ?? 'localhost'}:${
      process.env.DATABASE_PORT ?? '5432'
    }/${process.env.DATABASE_NAME ?? 'api'}`,
  );

  url.username = process.env.DATABASE_USERNAME ?? 'root';
  url.password = process.env.DATABASE_PASSWORD ?? 'secret';

  return url.toString();
}

void runSeed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
