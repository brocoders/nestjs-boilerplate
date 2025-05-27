import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ReminderRepository } from './infrastructure/persistence/reminder.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Reminder } from './domain/reminder';

@Injectable()
export class RemindersService {
  constructor(
    // Dependencies here
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createReminderDto: CreateReminderDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.reminderRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.reminderRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Reminder['id']) {
    return this.reminderRepository.findById(id);
  }

  findByIds(ids: Reminder['id'][]) {
    return this.reminderRepository.findByIds(ids);
  }

  async update(
    id: Reminder['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateReminderDto: UpdateReminderDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.reminderRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Reminder['id']) {
    return this.reminderRepository.remove(id);
  }
}
