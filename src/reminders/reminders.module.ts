import { UsersModule } from '../users/users.module';
import { InvoicesModule } from '../invoices/invoices.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { RelationalReminderPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    InvoicesModule,

    // import modules, etc.
    RelationalReminderPersistenceModule,
  ],
  controllers: [RemindersController],
  providers: [RemindersService],
  exports: [RemindersService, RelationalReminderPersistenceModule],
})
export class RemindersModule {}
