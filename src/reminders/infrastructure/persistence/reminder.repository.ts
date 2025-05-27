import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Reminder } from '../../domain/reminder';

export abstract class ReminderRepository {
  abstract create(
    data: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Reminder>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Reminder[]>;

  abstract findById(id: Reminder['id']): Promise<NullableType<Reminder>>;

  abstract findByIds(ids: Reminder['id'][]): Promise<Reminder[]>;

  abstract update(
    id: Reminder['id'],
    payload: DeepPartial<Reminder>,
  ): Promise<Reminder | null>;

  abstract remove(id: Reminder['id']): Promise<void>;
}
