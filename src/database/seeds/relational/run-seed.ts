import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { LocaleSeedService } from './locale/locale-seed.service';
import { CurrencySeedService } from './currency/currency-seed.service';
import { RegionSeedService } from './region/region-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(LocaleSeedService).run();
  await app.get(CurrencySeedService).run();
  await app.get(RegionSeedService).run();

  await app.close();
};

void runSeed();
