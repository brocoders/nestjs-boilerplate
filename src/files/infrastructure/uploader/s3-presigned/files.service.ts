import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileRepository } from '../../persistence/file.repository';
import { FileType } from 'src/files/domain/file';
import { FileUploadDto } from './dto/file.dto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesS3PresignedService {
  private s3: S3Client;

  constructor(
    private readonly fileRepository: FileRepository,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: configService.get('file.awsS3Region', { infer: true }),
      credentials: {
        accessKeyId: configService.getOrThrow('file.accessKeyId', {
          infer: true,
        }),
        secretAccessKey: configService.getOrThrow('file.secretAccessKey', {
          infer: true,
        }),
      },
    });
  }

  async create(
    file: FileUploadDto,
  ): Promise<{ file: FileType; uploadSignedUrl: string }> {
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

    if (!file.fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: `cantUploadFileType`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (
      file.fileSize >
      (this.configService.get('file.maxFileSize', {
        infer: true,
      }) || 0)
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
          error: 'Payload Too Large',
          message: 'File too large',
        },
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    const key = `${randomStringGenerator()}.${file.fileName
      .split('.')
      .pop()
      ?.toLowerCase()}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.getOrThrow('file.awsDefaultS3Bucket', {
        infer: true,
      }),
      Key: key,
      ContentLength: file.fileSize,
    });
    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    const data = await this.fileRepository.create({
      path: key,
    });

    return {
      file: data,
      uploadSignedUrl: signedUrl,
    };
  }
}
