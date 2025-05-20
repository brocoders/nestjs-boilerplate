import {
  FilterNotificationDto,
  SortNotificationDto,
} from './dto/query-notification.dto';
import { DevicesService } from '../devices/devices.service';
import { Device } from '../devices/domain/device';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './infrastructure/persistence/notification.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Notification } from './domain/notification';
import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NotificationCategory } from './types/notification-enum.type';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(forwardRef(() => DevicesService))
    private readonly deviceService: DevicesService,

    // Dependencies here
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    // Do not remove comment below.
    // <creating-property />

    const deviceObject = await this.deviceService.findById(
      createNotificationDto.device.id,
    );
    if (!deviceObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          device: 'notExists',
        },
      });
    }
    const device = deviceObject;

    return this.notificationRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      category: createNotificationDto.category || NotificationCategory.GENERAL,

      isRead: createNotificationDto.isRead,

      isDelivered: createNotificationDto.isDelivered,

      data: createNotificationDto.data,

      topic: createNotificationDto.topic,

      message: createNotificationDto.message,

      title: createNotificationDto.title,

      device,
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

    updateNotificationDto: UpdateNotificationDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let device: Device | undefined = undefined;

    if (updateNotificationDto.device) {
      const deviceObject = await this.deviceService.findById(
        updateNotificationDto.device.id,
      );
      if (!deviceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            device: 'notExists',
          },
        });
      }
      device = deviceObject;
    }

    return this.notificationRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      category: updateNotificationDto.category,

      isRead: updateNotificationDto.isRead,

      isDelivered: updateNotificationDto.isDelivered,

      data: updateNotificationDto.data,

      topic: updateNotificationDto.topic,

      message: updateNotificationDto.message,

      title: updateNotificationDto.title,

      device,
    });
  }

  remove(id: Notification['id']) {
    return this.notificationRepository.remove(id);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterNotificationDto | null;
    sortOptions?: SortNotificationDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Notification[]> {
    return this.notificationRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findByDeviceIdWithPagination({
    deviceId,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    deviceId: string;
    filterOptions?: FilterNotificationDto | null;
    sortOptions?: SortNotificationDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Notification[]> {
    return this.notificationRepository.findByDeviceIdWithPagination({
      deviceId,
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }
  findAllByDeviceId(
    deviceId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Notification[]> {
    return this.notificationRepository.findAllByDeviceId(
      deviceId,
      paginationOptions,
    );
  }

  findUnreadByDeviceId(
    deviceId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Notification[]> {
    return this.notificationRepository.findUnreadByDeviceId(
      deviceId,
      paginationOptions,
    );
  }
}
