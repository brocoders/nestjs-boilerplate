import {
  // common
  Module,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { RelationalReminderPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalReminderPersistenceModule,
  ],
  controllers: [RemindersController],
  providers: [RemindersService],
  exports: [RemindersService, RelationalReminderPersistenceModule],
})
export class RemindersModule {}
