import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { KycDetails } from '../../domain/kyc-details';

export abstract class KycDetailsRepository {
  abstract create(
    data: Omit<KycDetails, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<KycDetails>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<KycDetails[]>;

  abstract findById(id: KycDetails['id']): Promise<NullableType<KycDetails>>;

  abstract findByIds(ids: KycDetails['id'][]): Promise<KycDetails[]>;

  abstract update(
    id: KycDetails['id'],
    payload: DeepPartial<KycDetails>,
  ): Promise<KycDetails | null>;

  abstract remove(id: KycDetails['id']): Promise<void>;
}
