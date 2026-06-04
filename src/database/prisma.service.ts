import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { AllConfigType } from '../config/config.type';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      adapter: new PrismaPg({
        connectionString: PrismaService.getDatabaseUrl(configService),
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private static getDatabaseUrl(
    configService: ConfigService<AllConfigType>,
  ): string {
    const configuredUrl = configService.get('database.url', { infer: true });

    if (configuredUrl) {
      return configuredUrl;
    }

    const url = new URL(
      `postgresql://${configService.getOrThrow('database.host', {
        infer: true,
      })}:${configService.get('database.port', { infer: true }) ?? 5432}/${configService.getOrThrow('database.name', { infer: true })}`,
    );

    url.username = configService.getOrThrow('database.username', {
      infer: true,
    });
    url.password =
      configService.get('database.password', { infer: true }) ?? '';

    return url.toString();
  }
}
