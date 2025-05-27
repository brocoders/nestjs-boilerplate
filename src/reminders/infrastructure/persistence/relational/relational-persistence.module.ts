import { Module } from '@nestjs/common';
import { ReminderRepository } from '../reminder.repository';
import { ReminderRelationalRepository } from './repositories/reminder.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderEntity } from './entities/reminder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReminderEntity])],
  providers: [
    {
      provide: ReminderRepository,
      useClass: ReminderRelationalRepository,
    },
  ],
  exports: [ReminderRepository],
})
export class RelationalReminderPersistenceModule {}
