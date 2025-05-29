import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderEntity } from '../../../../reminders/infrastructure/persistence/relational/entities/reminder.entity';
import { ReminderSeedService } from './reminder-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReminderEntity])],
  providers: [ReminderSeedService],
  exports: [ReminderSeedService],
})
export class ReminderSeedModule {}
