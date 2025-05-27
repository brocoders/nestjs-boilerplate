import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PaymentAggregator } from '../../domain/payment-aggregator';

export abstract class PaymentAggregatorRepository {
  abstract create(
    data: Omit<PaymentAggregator, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PaymentAggregator>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PaymentAggregator[]>;

  abstract findById(
    id: PaymentAggregator['id'],
  ): Promise<NullableType<PaymentAggregator>>;

  abstract findByIds(
    ids: PaymentAggregator['id'][],
  ): Promise<PaymentAggregator[]>;

  abstract update(
    id: PaymentAggregator['id'],
    payload: DeepPartial<PaymentAggregator>,
  ): Promise<PaymentAggregator | null>;

  abstract remove(id: PaymentAggregator['id']): Promise<void>;
}
