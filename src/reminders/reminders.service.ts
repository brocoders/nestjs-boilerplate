import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import { InvoicesService } from '../invoices/invoices.service';
import { Invoice } from '../invoices/domain/invoice';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ReminderRepository } from './infrastructure/persistence/reminder.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Reminder } from './domain/reminder';

@Injectable()
export class RemindersService {
  constructor(
    private readonly userService: UsersService,

    private readonly invoiceService: InvoicesService,

    // Dependencies here
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async create(createReminderDto: CreateReminderDto) {
    // Do not remove comment below.
    // <creating-property />
    let user: User | null | undefined = undefined;

    if (createReminderDto.user) {
      const userObject = await this.userService.findById(
        createReminderDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    } else if (createReminderDto.user === null) {
      user = null;
    }

    let invoice: Invoice | null | undefined = undefined;

    if (createReminderDto.invoice) {
      const invoiceObject = await this.invoiceService.findById(
        createReminderDto.invoice.id,
      );
      if (!invoiceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            invoice: 'notExists',
          },
        });
      }
      invoice = invoiceObject;
    } else if (createReminderDto.invoice === null) {
      invoice = null;
    }

    return this.reminderRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      user,

      invoice,

      channel: createReminderDto.channel,

      status: createReminderDto.status,

      scheduledAt: createReminderDto.scheduledAt,

      sentAt: createReminderDto.sentAt,
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

    updateReminderDto: UpdateReminderDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let user: User | null | undefined = undefined;

    if (updateReminderDto.user) {
      const userObject = await this.userService.findById(
        updateReminderDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    } else if (updateReminderDto.user === null) {
      user = null;
    }

    let invoice: Invoice | null | undefined = undefined;

    if (updateReminderDto.invoice) {
      const invoiceObject = await this.invoiceService.findById(
        updateReminderDto.invoice.id,
      );
      if (!invoiceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            invoice: 'notExists',
          },
        });
      }
      invoice = invoiceObject;
    } else if (updateReminderDto.invoice === null) {
      invoice = null;
    }

    return this.reminderRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      user,

      invoice,

      channel: updateReminderDto.channel,

      status: updateReminderDto.status,

      scheduledAt: updateReminderDto.scheduledAt,

      sentAt: updateReminderDto.sentAt,
    });
  }

  remove(id: Reminder['id']) {
    return this.reminderRepository.remove(id);
  }
}
