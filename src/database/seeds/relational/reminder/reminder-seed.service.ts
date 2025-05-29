import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReminderEntity } from '../../../../reminders/infrastructure/persistence/relational/entities/reminder.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReminderSeedService {
  constructor(
    @InjectRepository(ReminderEntity)
    private repository: Repository<ReminderEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
