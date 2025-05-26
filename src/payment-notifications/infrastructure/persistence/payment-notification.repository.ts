import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PaymentNotification } from '../../domain/payment-notification';

export abstract class PaymentNotificationRepository {
  abstract create(
    data: Omit<PaymentNotification, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PaymentNotification>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PaymentNotification[]>;

  abstract findById(
    id: PaymentNotification['id'],
  ): Promise<NullableType<PaymentNotification>>;

  abstract findByIds(
    ids: PaymentNotification['id'][],
  ): Promise<PaymentNotification[]>;

  abstract update(
    id: PaymentNotification['id'],
    payload: DeepPartial<PaymentNotification>,
  ): Promise<PaymentNotification | null>;

  abstract remove(id: PaymentNotification['id']): Promise<void>;
}
