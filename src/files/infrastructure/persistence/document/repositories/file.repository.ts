import { Injectable } from '@nestjs/common';

import { FileRepository } from '../../file.repository';
import { FileSchemaClass } from '../entities/file.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileType } from '../../../../domain/file';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { FileMapper } from '../mappers/file.mapper';

@Injectable()
export class FileDocumentRepository implements FileRepository {
  constructor(
    @InjectModel(FileSchemaClass.name)
    private fileModel: Model<FileSchemaClass>,
  ) {}

  async create(data: Omit<FileType, 'id'>): Promise<FileType> {
    const createdFile = new this.fileModel(data);
    const fileObject = await createdFile.save();
    return FileMapper.toDomain(fileObject);
  }

  async findOne(
    fields: EntityCondition<FileType>,
  ): Promise<NullableType<FileType>> {
    if (fields.id) {
      const fileObject = await this.fileModel.findById(fields.id);
      return fileObject ? FileMapper.toDomain(fileObject) : null;
    }

    const fileObject = await this.fileModel.findOne(fields);
    return fileObject ? FileMapper.toDomain(fileObject) : null;
  }
}
