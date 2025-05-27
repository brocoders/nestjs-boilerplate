import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PaymentMethod } from '../../domain/payment-method';

export abstract class PaymentMethodRepository {
  abstract create(
    data: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PaymentMethod>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PaymentMethod[]>;

  abstract findById(
    id: PaymentMethod['id'],
  ): Promise<NullableType<PaymentMethod>>;

  abstract findByIds(ids: PaymentMethod['id'][]): Promise<PaymentMethod[]>;

  abstract update(
    id: PaymentMethod['id'],
    payload: DeepPartial<PaymentMethod>,
  ): Promise<PaymentMethod | null>;

  abstract remove(id: PaymentMethod['id']): Promise<void>;
}
