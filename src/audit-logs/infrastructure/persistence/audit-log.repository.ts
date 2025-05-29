import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { AuditLog } from '../../domain/audit-log';

export abstract class AuditLogRepository {
  abstract create(
    data: Omit<AuditLog, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AuditLog>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AuditLog[]>;

  abstract findById(id: AuditLog['id']): Promise<NullableType<AuditLog>>;

  abstract findByIds(ids: AuditLog['id'][]): Promise<AuditLog[]>;

  abstract update(
    id: AuditLog['id'],
    payload: DeepPartial<AuditLog>,
  ): Promise<AuditLog | null>;

  abstract remove(id: AuditLog['id']): Promise<void>;
}
