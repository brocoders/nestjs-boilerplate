import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { ReminderEntity } from '../entities/reminder.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Reminder } from '../../../../domain/reminder';
import { ReminderRepository } from '../../reminder.repository';
import { ReminderMapper } from '../mappers/reminder.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class ReminderRelationalRepository implements ReminderRepository {
  private reminderRepository: Repository<ReminderEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.reminderRepository = dataSource.getRepository(ReminderEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<ReminderEntity> = {},
  ): FindOptionsWhere<ReminderEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Reminder): Promise<Reminder> {
    const persistenceModel = ReminderMapper.toPersistence(data);
    const newEntity = await this.reminderRepository.save(
      this.reminderRepository.create(persistenceModel),
    );
    return ReminderMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Reminder[]> {
    const entities = await this.reminderRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => ReminderMapper.toDomain(entity));
  }

  async findById(id: Reminder['id']): Promise<NullableType<Reminder>> {
    const entity = await this.reminderRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? ReminderMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Reminder['id'][]): Promise<Reminder[]> {
    const entities = await this.reminderRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => ReminderMapper.toDomain(entity));
  }

  async update(
    id: Reminder['id'],
    payload: Partial<Reminder>,
  ): Promise<Reminder> {
    const entity = await this.reminderRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.reminderRepository.save(
      this.reminderRepository.create(
        ReminderMapper.toPersistence({
          ...ReminderMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ReminderMapper.toDomain(updatedEntity);
  }

  async remove(id: Reminder['id']): Promise<void> {
    const entity = await this.reminderRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.reminderRepository.softDelete(entity.id);
  }
}
