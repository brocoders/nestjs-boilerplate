import { TenantsModule } from '../tenants/tenants.module';
import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { OnboardingsService } from './onboardings.service';
import { OnboardingsController } from './onboardings.controller';
import { RelationalOnboardingPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    forwardRef(() => TenantsModule),

    forwardRef(() => UsersModule),

    forwardRef(() => AuditLogsModule),

    // import modules, etc.
    RelationalOnboardingPersistenceModule,
  ],
  controllers: [OnboardingsController],
  providers: [OnboardingsService],
  exports: [OnboardingsService, RelationalOnboardingPersistenceModule],
})
export class OnboardingsModule {}
