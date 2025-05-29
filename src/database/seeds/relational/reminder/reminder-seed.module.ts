import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderEntity } from '../../../../reminders/infrastructure/persistence/relational/entities/reminder.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { ReminderSeedService } from './reminder-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReminderEntity,
      TenantEntity,
      UserEntity,
      InvoiceEntity,
      RoleEntity,
    ]),
  ],
  providers: [ReminderSeedService],
  exports: [ReminderSeedService],
})
export class ReminderSeedModule {}
