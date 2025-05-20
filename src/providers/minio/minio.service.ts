import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  UploadFileResponseDto,
  DeleteFileResponseDto,
  ListFilesResponseDto,
  ListBucketsResponseDto,
} from './dto/response.dto';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { Response } from 'express';
import { pathExists, readFile, remove } from 'fs-extra';
import * as stream from 'stream';
import { AllConfigType } from '../../config/config.type';
import { BaseToggleableService } from 'src/common/base/base-toggleable.service';
import { MinioResponseMapper } from './infrastructure/persistence/relational/mappers/minio.mapper';

@Injectable()
export class MinioService
  extends BaseToggleableService
  implements OnModuleInit
{
  private minioClient: Client;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    super(
      MinioService.name,
      configService.get('minIO.enable', { infer: true }) ?? false,
    );
  }

  onModuleInit() {
    if (!this.isEnabled) {
      this.logger.warn('MinIO Service is DISABLED. Skipping initialization.');
      return;
    }

    this.logger.log(
      'MinIO service is ENABLED. Proceeding with initialization.',
    );

    try {
      const minioHost = this.configService.get('minIO.host', {
        infer: true,
      });
      const minioPort = this.configService.get('minIO.port', {
        infer: true,
      });
      const accessKey = this.configService.get('minIO.accessKey', {
        infer: true,
      });
      const secretKey = this.configService.get('minIO.secretKey', {
        infer: true,
      });
      const useSSL = this.configService.get('minIO.useSSL', {
        infer: true,
      });

      if (!minioHost || !accessKey || !secretKey) {
        throw new Error('MinIO configuration is missing.');
      }

      this.minioClient = new Client({
        endPoint: new URL(minioHost).hostname,
        port: minioPort,
        useSSL,
        accessKey,
        secretKey,
      });

      this.logger.log(`Connected to MinIO server at ${minioHost}:${minioPort}`);
    } catch (error) {
      this.logger.error(
        `Failed to initialize MinIO Client: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'MinIO client initialization failed.',
      );
    }
  }

  private validateBucketName(bucketName: string) {
    const regex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
    if (!regex.test(bucketName)) {
      this.logger.warn(`Invalid bucket name attempted: ${bucketName}`);
      throw new InternalServerErrorException(
        `Invalid bucket name: ${bucketName}`,
      );
    }
  }

  async uploadFile(
    bucketName: string,
    file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    this.checkIfEnabled();
    try {
      this.validateBucketName(bucketName);

      if (!file || !file.path) {
        this.logger.warn('Upload failed due to invalid file data.');
        throw new InternalServerErrorException('Invalid file data.');
      }

      const objectName = file.originalname;
      const filePath = file.path;

      if (!(await pathExists(filePath))) {
        this.logger.warn(`Uploaded file not found at path: ${filePath}`);
        throw new NotFoundException(
          `Uploaded file not found at path: ${filePath}`,
        );
      }

      const bufferStream = new stream.PassThrough();
      bufferStream.end(await readFile(filePath));

      await this.minioClient.putObject(
        bucketName,
        objectName,
        bufferStream,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      this.logger.log(
        `File uploaded: '${objectName}' to bucket '${bucketName}'`,
      );
      await remove(filePath);

      return MinioResponseMapper.toUploadFileResponse(objectName);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Upload failed for bucket '${bucketName}': ${message}`);
      throw new InternalServerErrorException(`Upload failed: ${message}`);
    }
  }

  async downloadFile(
    bucketName: string,
    objectName: string,
    res: Response,
  ): Promise<void> {
    this.checkIfEnabled();
    try {
      this.validateBucketName(bucketName);

      const fileStream = await this.minioClient.getObject(
        bucketName,
        objectName,
      );
      if (!fileStream) {
        this.logger.warn(
          `File '${objectName}' not found in bucket '${bucketName}'`,
        );
        throw new NotFoundException(`File '${objectName}' not found`);
      }

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${objectName}"`,
      );
      res.setHeader('Content-Type', 'application/octet-stream');
      fileStream.pipe(res);

      this.logger.verbose(
        `File '${objectName}' streaming started from bucket '${bucketName}'`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Download failed for file '${objectName}' in bucket '${bucketName}': ${message}`,
      );
      throw new InternalServerErrorException(`Download failed: ${message}`);
    }
  }

  async deleteFile(
    bucketName: string,
    objectName: string,
  ): Promise<DeleteFileResponseDto> {
    this.checkIfEnabled();
    try {
      this.validateBucketName(bucketName);
      await this.minioClient.removeObject(
        bucketName,
        objectName.replace(/\s/g, ''),
      );

      this.logger.log(
        `File deleted: '${objectName}' from bucket '${bucketName}'`,
      );
      return MinioResponseMapper.toDeleteFileResponse(objectName);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Delete failed for file '${objectName}' in bucket '${bucketName}': ${message}`,
      );
      throw new InternalServerErrorException(`Delete failed: ${message}`);
    }
  }

  async listFiles(bucketName: string): Promise<ListFilesResponseDto> {
    this.checkIfEnabled();
    try {
      this.validateBucketName(bucketName);
      const objectsStream = this.minioClient.listObjectsV2(
        bucketName,
        '',
        true,
      );
      const fileNames: string[] = [];

      for await (const obj of objectsStream) {
        fileNames.push(obj.name);
      }

      this.logger.debug(
        `Listed ${fileNames.length} files from bucket '${bucketName}'`,
      );
      return MinioResponseMapper.toListFilesResponse(fileNames);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to list files in bucket '${bucketName}': ${message}`,
      );
      throw new InternalServerErrorException('Failed to list files');
    }
  }

  async listBuckets(): Promise<ListBucketsResponseDto> {
    this.checkIfEnabled();
    try {
      const buckets = await this.minioClient.listBuckets();
      this.logger.debug(`Listed ${buckets.length} buckets`);
      return MinioResponseMapper.toListBucketsResponse(
        buckets.map((b) => b.name),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to list buckets: ${message}`);
      throw new InternalServerErrorException('Failed to list buckets');
    }
  }
}
