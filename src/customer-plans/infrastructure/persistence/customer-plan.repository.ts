import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { CustomerPlan } from '../../domain/customer-plan';

export abstract class CustomerPlanRepository {
  abstract create(
    data: Omit<CustomerPlan, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CustomerPlan>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CustomerPlan[]>;

  abstract findById(
    id: CustomerPlan['id'],
  ): Promise<NullableType<CustomerPlan>>;

  abstract findByIds(ids: CustomerPlan['id'][]): Promise<CustomerPlan[]>;

  abstract update(
    id: CustomerPlan['id'],
    payload: DeepPartial<CustomerPlan>,
  ): Promise<CustomerPlan | null>;

  abstract remove(id: CustomerPlan['id']): Promise<void>;
}
