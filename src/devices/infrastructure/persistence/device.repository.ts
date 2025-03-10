import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Device } from '../../domain/device';

export abstract class DeviceRepository {
  abstract create(
    data: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Device>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Device[]>;

  abstract findById(id: Device['id']): Promise<NullableType<Device>>;

  abstract findByIds(ids: Device['id'][]): Promise<Device[]>;

  abstract update(
    id: Device['id'],
    payload: DeepPartial<Device>,
  ): Promise<Device | null>;

  abstract remove(id: Device['id']): Promise<void>;
}
