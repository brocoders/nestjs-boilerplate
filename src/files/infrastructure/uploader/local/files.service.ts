import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import { FileRepository } from '../../persistence/file.repository';
import { AllConfigType } from '../../../../config/config.type';
import { FileType } from '../../../domain/file';
import { FileScanService } from '../scan/file-scan.service';

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
    private readonly fileScanService: FileScanService,
  ) {}

  async create(file: Express.Multer.File): Promise<{ file: FileType }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    // 1. Scan buffer BEFORE touching disk
    await this.fileScanService.scanBuffer(file.buffer);

    // 2. Only write to disk if scan passes
    const filename = `${randomStringGenerator()}.${file.originalname
      .split('.')
      .pop()
      ?.toLowerCase()}`;

    await fs.mkdir('./files', { recursive: true });
    await fs.writeFile(path.join('./files', filename), file.buffer);

    // 3. Save record to DB
    return {
      file: await this.fileRepository.create({
        path: `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/files/${filename}`,
      }),
    };
  }
}
