import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { ProductSeedService } from './product/product-seed.service';
import { OrganizationMemberSeedService } from './organization-member/organization-member-seed.service';
import { FeatureSeedService } from './feature/feature-seed.service';
import { PricingSeedService } from './pricing/pricing-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(ProductSeedService).run();
  await app.get(OrganizationMemberSeedService).run();
  await app.get(FeatureSeedService).run();
  await app.get(PricingSeedService).run();

  await app.close();
};

void runSeed();
