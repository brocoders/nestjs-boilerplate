import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { FileRepository } from './infrastructure/persistence/file.repository';
import { FileType } from './domain/file';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {}

  async create(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileType> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = {
      local: `/${this.configService.get('app.apiPrefix', { infer: true })}/v1/${
        file.path
      }`,
      s3: (file as Express.MulterS3.File).location,
    };

    return this.fileRepository.create({
      path: path[this.configService.getOrThrow('file.driver', { infer: true })],
    });
  }

  findOne(fields: EntityCondition<FileType>): Promise<NullableType<FileType>> {
    return this.fileRepository.findOne(fields);
  }
}
