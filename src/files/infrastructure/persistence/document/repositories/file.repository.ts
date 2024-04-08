import { Injectable } from '@nestjs/common';

import { FileRepository } from '../../file.repository';
import { FileSchemaClass } from '../entities/file.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileType } from '../../../../domain/file';

import { FileMapper } from '../mappers/file.mapper';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import domainToDocumentCondition from '../../../../../utils/domain-to-document-condition';

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
    const fileObject = await this.fileModel.findOne(
      domainToDocumentCondition(fields),
    );
    return fileObject ? FileMapper.toDomain(fileObject) : null;
  }
}
