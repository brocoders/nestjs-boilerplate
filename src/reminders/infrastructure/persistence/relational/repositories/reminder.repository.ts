import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ReminderEntity } from '../entities/reminder.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Reminder } from '../../../../domain/reminder';
import { ReminderRepository } from '../../reminder.repository';
import { ReminderMapper } from '../mappers/reminder.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ReminderRelationalRepository implements ReminderRepository {
  constructor(
    @InjectRepository(ReminderEntity)
    private readonly reminderRepository: Repository<ReminderEntity>,
  ) {}

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
    });

    return entities.map((entity) => ReminderMapper.toDomain(entity));
  }

  async findById(id: Reminder['id']): Promise<NullableType<Reminder>> {
    const entity = await this.reminderRepository.findOne({
      where: { id },
    });

    return entity ? ReminderMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Reminder['id'][]): Promise<Reminder[]> {
    const entities = await this.reminderRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ReminderMapper.toDomain(entity));
  }

  async update(
    id: Reminder['id'],
    payload: Partial<Reminder>,
  ): Promise<Reminder> {
    const entity = await this.reminderRepository.findOne({
      where: { id },
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
    await this.reminderRepository.delete(id);
  }
}
