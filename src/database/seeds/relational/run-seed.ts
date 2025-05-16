import { NestFactory } from '@nestjs/core';
import { ResidenceSeedService } from './residence/residence-seed.service';
import { TenantTypesSeedService } from './tenant-types/tenant-types-seed.service';
// import { SettingsSeedService } from './settings/settings-seed.service';
// import { KycDetailSeedService } from './kyc-detail/kyc-detail-seed.service';
import { TenantSeedService } from './tenant/tenant-seed.service';
import { RegionSeedService } from './region/region-seed.service';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(TenantTypesSeedService).run();
  await app.get(TenantSeedService).run();
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(RegionSeedService).run();
  await app.get(UserSeedService).run();
  // await app.get(KycDetailSeedService).run();

  // await app.get(SettingsSeedService).run();

  await app.get(ResidenceSeedService).run();

  await app.close();
};

void runSeed();
