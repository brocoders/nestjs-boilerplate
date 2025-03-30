import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { Response } from 'express';
import { pathExists, readFile, remove } from 'fs-extra';
import * as stream from 'stream';
import { MinIOConfig } from './config/minio-config.type';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Client;

  constructor(private configService: ConfigService<{ minio: MinIOConfig }>) {}

  onModuleInit() {
    try {
      const minioHost = this.configService.get<string>('minio.minioHost', {
        infer: true,
      });
      const accessKey = this.configService.get<string>('minio.minioAccessKey', {
        infer: true,
      });
      const secretKey = this.configService.get<string>('minio.minioSecretKey', {
        infer: true,
      });
      const useSSL = this.configService.get<boolean>('minio.minioUseSSL', {
        infer: true,
      });

      if (!minioHost || !accessKey || !secretKey) {
        throw new Error('MinIO configuration is missing');
      }

      this.minioClient = new Client({
        endPoint: new URL(minioHost).hostname,
        useSSL,
        accessKey,
        secretKey,
      });

      this.logger.log(`Connected to MinIO at: ${minioHost}`);
    } catch (err) {
      this.logger.error('MinIO initialization failed', err);
      throw new InternalServerErrorException(
        'MinIO client initialization failed',
      );
    }
  }

  private validateBucketName(bucketName: string) {
    const regex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
    if (!regex.test(bucketName)) {
      throw new InternalServerErrorException(
        `Invalid bucket name: ${bucketName}`,
      );
    }
  }

  async uploadFile(bucketName: string, file: Express.Multer.File) {
    try {
      this.validateBucketName(bucketName);

      if (!file || !file.path) {
        throw new InternalServerErrorException('Invalid file data.');
      }

      const objectName = file.originalname;
      const filePath = file.path;

      if (!(await pathExists(filePath))) {
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

      this.logger.log(`Uploaded: '${objectName}' to '${bucketName}'`);
      await remove(filePath);

      return {
        message: `File '${objectName}' uploaded successfully`,
        fileName: objectName,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Upload failed: ${message}`);
      throw new InternalServerErrorException(`Upload failed: ${message}`);
    }
  }

  async downloadFile(bucketName: string, objectName: string, res: Response) {
    try {
      this.validateBucketName(bucketName);

      const fileStream = await this.minioClient.getObject(
        bucketName,
        objectName,
      );
      if (!fileStream) {
        throw new NotFoundException(`File '${objectName}' not found`);
      }

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${objectName}"`,
      );
      res.setHeader('Content-Type', 'application/octet-stream');
      fileStream.pipe(res);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Download failed: ${message}`);
      throw new InternalServerErrorException(`Download failed: ${message}`);
    }
  }

  async deleteFile(bucketName: string, objectName: string) {
    try {
      this.validateBucketName(bucketName);
      await this.minioClient.removeObject(
        bucketName,
        objectName.replace(/\s/g, ''),
      );

      this.logger.log(`Deleted '${objectName}' from '${bucketName}'`);
      return { message: `File '${objectName}' deleted successfully` };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Delete failed: ${message}`);
      throw new InternalServerErrorException(`Delete failed: ${message}`);
    }
  }

  async listFiles(bucketName: string): Promise<string[]> {
    try {
      const objectsStream = this.minioClient.listObjectsV2(
        bucketName,
        '',
        true,
      );
      const fileNames: string[] = [];

      for await (const obj of objectsStream) {
        fileNames.push(obj.name);
      }

      return fileNames;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to list files: ${message}`);
      throw new InternalServerErrorException('Failed to list files');
    }
  }

  async listBuckets(): Promise<string[]> {
    try {
      const buckets = await this.minioClient.listBuckets();
      return buckets.map((b) => b.name);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to list buckets: ${message}`);
      throw new InternalServerErrorException('Failed to list buckets');
    }
  }
}
