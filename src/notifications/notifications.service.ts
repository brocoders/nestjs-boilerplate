import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './infrastructure/persistence/notification.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Notification } from './domain/notification';

@Injectable()
export class NotificationsService {
  constructor(
    // Dependencies here
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createNotificationDto: CreateNotificationDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.notificationRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.notificationRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Notification['id']) {
    return this.notificationRepository.findById(id);
  }

  findByIds(ids: Notification['id'][]) {
    return this.notificationRepository.findByIds(ids);
  }

  async update(
    id: Notification['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateNotificationDto: UpdateNotificationDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.notificationRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Notification['id']) {
    return this.notificationRepository.remove(id);
  }
}
