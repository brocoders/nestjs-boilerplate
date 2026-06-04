import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      adapter: new PrismaD1({
        CLOUDFLARE_ACCOUNT_ID: PrismaService.getRequiredEnv(
          'CLOUDFLARE_ACCOUNT_ID',
        ),
        CLOUDFLARE_D1_TOKEN: PrismaService.getRequiredEnv(
          'CLOUDFLARE_D1_TOKEN',
        ),
        CLOUDFLARE_DATABASE_ID: PrismaService.getRequiredEnv(
          'CLOUDFLARE_DATABASE_ID',
        ),
        CLOUDFLARE_SHADOW_DATABASE_ID:
          process.env.CLOUDFLARE_SHADOW_DATABASE_ID,
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private static getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
      throw new Error(`${name} is required for Cloudflare D1 Prisma access`);
    }

    return value;
  }
}
