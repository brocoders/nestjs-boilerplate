import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FileType } from '../../domain/file';
import { NullableType } from 'src/utils/types/nullable.type';

export abstract class FileRepository {
  abstract create(data: Omit<FileType, 'id'>): Promise<FileType>;

  abstract findOne(
    fields: EntityCondition<FileType>,
  ): Promise<NullableType<FileType>>;
}
