import { Injectable } from '@nestjs/common';

import { FileRepository } from './infrastructure/persistence/file.repository';
import { FileType } from './domain/file';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  findOne(fields: EntityCondition<FileType>): Promise<NullableType<FileType>> {
    return this.fileRepository.findOne(fields);
  }
}
