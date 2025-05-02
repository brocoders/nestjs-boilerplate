import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { DeviceEntity } from '../entities/device.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Device } from '../../../../domain/device';
import { DeviceRepository } from '../../device.repository';
import { DeviceMapper } from '../mappers/device.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { User } from '../../../../../users/domain/user';
import { OrderType } from '../../../../../utils/types/order-type';
import {
  FilterDeviceDto,
  SortDeviceDto,
} from '../../../../dto/query-device.dto';

@Injectable()
export class DeviceRelationalRepository implements DeviceRepository {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  async create(data: Device): Promise<Device> {
    const persistenceModel = DeviceMapper.toPersistence(data);
    const newEntity = await this.deviceRepository.save(
      this.deviceRepository.create(persistenceModel),
    );
    return DeviceMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Device[]> {
    const entities = await this.deviceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => DeviceMapper.toDomain(entity));
  }

  async findById(id: Device['id']): Promise<NullableType<Device>> {
    const entity = await this.deviceRepository.findOne({
      where: { id },
    });

    return entity ? DeviceMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Device['id'][]): Promise<Device[]> {
    const entities = await this.deviceRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => DeviceMapper.toDomain(entity));
  }

  async update(id: Device['id'], payload: Partial<Device>): Promise<Device> {
    const entity = await this.deviceRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.deviceRepository.save(
      this.deviceRepository.create(
        DeviceMapper.toPersistence({
          ...DeviceMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return DeviceMapper.toDomain(updatedEntity);
  }

  async remove(id: Device['id']): Promise<void> {
    await this.deviceRepository.delete(id);
  }
  async findByUserId(userId: User['id']): Promise<Device[]> {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const entities = await this.deviceRepository.find({
      where: {
        user: {
          id: id,
        },
      },
      relations: ['user'],
    });
    return entities.map((entity) => DeviceMapper.toDomain(entity));
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterDeviceDto | null;
    sortOptions?: SortDeviceDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Device[]> {
    const where: FindOptionsWhere<DeviceEntity> = {};

    if (filterOptions?.isActive !== undefined) {
      where.isActive = filterOptions.isActive;
    }
    if (filterOptions?.platform) {
      where.platform = filterOptions.platform;
    }
    if (filterOptions?.appVersion) {
      where.appVersion = filterOptions.appVersion;
    }

    const entities = await this.deviceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      order: sortOptions?.reduce(
        (acc, item) => {
          acc[item.orderBy] = item.order as OrderType;
          return acc;
        },
        {} as Record<string, OrderType>,
      ),
    });

    return entities.map(DeviceMapper.toDomain);
  }
}
