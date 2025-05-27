import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PaymentPlan } from '../../domain/payment-plan';

export abstract class PaymentPlanRepository {
  abstract create(
    data: Omit<PaymentPlan, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PaymentPlan>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PaymentPlan[]>;

  abstract findById(id: PaymentPlan['id']): Promise<NullableType<PaymentPlan>>;

  abstract findByIds(ids: PaymentPlan['id'][]): Promise<PaymentPlan[]>;

  abstract update(
    id: PaymentPlan['id'],
    payload: DeepPartial<PaymentPlan>,
  ): Promise<PaymentPlan | null>;

  abstract remove(id: PaymentPlan['id']): Promise<void>;
}
