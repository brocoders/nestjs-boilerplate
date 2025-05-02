import { FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Notification } from '../../../../domain/notification';
import { NotificationRepository } from '../../notification.repository';
import { NotificationMapper } from '../mappers/notification.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { OrderType } from '../../../../../utils/types/order-type';
import {
  FilterNotificationDto,
  SortNotificationDto,
} from '../../../../dto/query-notification.dto';

@Injectable()
export class NotificationRelationalRepository
  implements NotificationRepository
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async create(data: Notification): Promise<Notification> {
    const persistenceModel = NotificationMapper.toPersistence(data);
    const newEntity = await this.notificationRepository.save(
      this.notificationRepository.create(persistenceModel),
    );
    return NotificationMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Notification[]> {
    const entities = await this.notificationRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => NotificationMapper.toDomain(entity));
  }

  async findById(id: Notification['id']): Promise<NullableType<Notification>> {
    const entity = await this.notificationRepository.findOne({
      where: { id },
    });

    return entity ? NotificationMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Notification['id'][]): Promise<Notification[]> {
    const entities = await this.notificationRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => NotificationMapper.toDomain(entity));
  }

  async update(
    id: Notification['id'],
    payload: Partial<Notification>,
  ): Promise<Notification> {
    const entity = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.notificationRepository.save(
      this.notificationRepository.create(
        NotificationMapper.toPersistence({
          ...NotificationMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return NotificationMapper.toDomain(updatedEntity);
  }

  async remove(id: Notification['id']): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  async findManyWithPagination(options: {
    filterOptions?: FilterNotificationDto | null;
    sortOptions?: SortNotificationDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Notification[]> {
    const { filterOptions, sortOptions, paginationOptions } = options;

    const where: FindOptionsWhere<NotificationEntity> = {};

    if (filterOptions?.isRead !== undefined) {
      where.isRead = filterOptions.isRead;
    }

    if (filterOptions?.isDelivered !== undefined) {
      where.isDelivered = filterOptions.isDelivered;
    }

    if (filterOptions?.category) {
      where.category = filterOptions.category;
    }

    if (filterOptions?.topic) {
      where.topic = filterOptions.topic;
    }

    const order = sortOptions?.reduce(
      (acc, sort) => {
        acc[sort.orderBy] = sort.order as OrderType;
        return acc;
      },
      {} as Record<string, OrderType>,
    );

    const entities = await this.notificationRepository.find({
      where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order,
    });

    return entities.map(NotificationMapper.toDomain);
  }

  async findByDeviceIdWithPagination(options: {
    deviceId: string;
    filterOptions?: FilterNotificationDto | null;
    sortOptions?: SortNotificationDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Notification[]> {
    const { deviceId, filterOptions, sortOptions, paginationOptions } = options;

    const where: FindOptionsWhere<NotificationEntity> = {
      device: { id: deviceId },
    };

    if (filterOptions?.isRead !== undefined) {
      where.isRead = filterOptions.isRead;
    }

    if (filterOptions?.isDelivered !== undefined) {
      where.isDelivered = filterOptions.isDelivered;
    }

    if (filterOptions?.category) {
      where.category = filterOptions.category;
    }

    if (filterOptions?.topic) {
      where.topic = filterOptions.topic;
    }

    const order = sortOptions?.reduce(
      (acc, sort) => {
        acc[sort.orderBy] = sort.order as OrderType;
        return acc;
      },
      {} as Record<string, OrderType>,
    );

    const entities = await this.notificationRepository.find({
      where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order,
    });

    return entities.map(NotificationMapper.toDomain);
  }
  async findAllByDeviceId(
    deviceId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Notification[]> {
    const entities = await this.notificationRepository.find({
      where: { device: { id: deviceId } },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });

    return entities.map(NotificationMapper.toDomain);
  }

  async findUnreadByDeviceId(
    deviceId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Notification[]> {
    const entities = await this.notificationRepository.find({
      where: {
        device: { id: deviceId },
        isRead: false,
      },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });

    return entities.map(NotificationMapper.toDomain);
  }
}
