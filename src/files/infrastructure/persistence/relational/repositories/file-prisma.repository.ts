import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../database/prisma.service';
import { FileRepository } from '../../file.repository';
import { FilePrismaMapper } from '../mappers/file-prisma.mapper';
import { FileType } from '../../../../domain/file';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class FilePrismaRepository implements FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<FileType, 'id'>): Promise<FileType> {
    const entity = await this.prisma.file.create({
      data: {
        path: data.path,
      },
    });

    return FilePrismaMapper.toDomain(entity);
  }

  async findById(id: FileType['id']): Promise<NullableType<FileType>> {
    const entity = await this.prisma.file.findUnique({
      where: {
        id: id,
      },
    });

    return entity ? FilePrismaMapper.toDomain(entity) : null;
  }

  async findByIds(ids: FileType['id'][]): Promise<FileType[]> {
    const entities = await this.prisma.file.findMany({
      where: {
        id: { in: ids },
      },
    });

    return entities.map((entity) => FilePrismaMapper.toDomain(entity));
  }
}
