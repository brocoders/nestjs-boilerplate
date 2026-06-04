import 'dotenv/config';
import { PrismaD1 } from '@prisma/adapter-d1';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: 'file:./d1-placeholder.sqlite',
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'npm run d1:seed:remote',
  },
  experimental: {
    adapter: true,
  },
  adapter: () =>
    new PrismaD1({
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
      CLOUDFLARE_D1_TOKEN: process.env.CLOUDFLARE_D1_TOKEN ?? '',
      CLOUDFLARE_DATABASE_ID: process.env.CLOUDFLARE_DATABASE_ID ?? '',
      CLOUDFLARE_SHADOW_DATABASE_ID: process.env.CLOUDFLARE_SHADOW_DATABASE_ID,
    }),
});
