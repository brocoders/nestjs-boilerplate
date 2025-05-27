import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { VendorBill } from '../../domain/vendor-bill';

export abstract class VendorBillRepository {
  abstract create(
    data: Omit<VendorBill, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<VendorBill>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<VendorBill[]>;

  abstract findById(id: VendorBill['id']): Promise<NullableType<VendorBill>>;

  abstract findByIds(ids: VendorBill['id'][]): Promise<VendorBill[]>;

  abstract update(
    id: VendorBill['id'],
    payload: DeepPartial<VendorBill>,
  ): Promise<VendorBill | null>;

  abstract remove(id: VendorBill['id']): Promise<void>;
}
