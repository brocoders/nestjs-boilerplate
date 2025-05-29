import { TenantsModule } from '../tenants/tenants.module';
import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { OnboardingsService } from './onboardings.service';
import { OnboardingsController } from './onboardings.controller';
import { RelationalOnboardingPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TenantsModule,

    UsersModule,

    // import modules, etc.
    RelationalOnboardingPersistenceModule,
  ],
  controllers: [OnboardingsController],
  providers: [OnboardingsService],
  exports: [OnboardingsService, RelationalOnboardingPersistenceModule],
})
export class OnboardingsModule {}
