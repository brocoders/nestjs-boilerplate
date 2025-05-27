import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Payment } from '../../domain/payment';

export abstract class PaymentRepository {
  abstract create(
    data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Payment>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Payment[]>;

  abstract findById(id: Payment['id']): Promise<NullableType<Payment>>;

  abstract findByIds(ids: Payment['id'][]): Promise<Payment[]>;

  abstract update(
    id: Payment['id'],
    payload: DeepPartial<Payment>,
  ): Promise<Payment | null>;

  abstract remove(id: Payment['id']): Promise<void>;
}
