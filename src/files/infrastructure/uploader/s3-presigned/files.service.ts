import {
  HttpStatus,
  Injectable,
  PayloadTooLargeException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileRepository } from '../../persistence/file.repository';

import { FileUploadDto } from './dto/file.dto';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { FileType } from '../../../domain/file';
import { AllConfigType } from '../../../../config/config.type';
import { FileScanService } from '../scan/file-scan.service';

@Injectable()
export class FilesS3PresignedService {
  private s3: S3Client;

  constructor(
    private readonly fileRepository: FileRepository,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileScanService: FileScanService,
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
  ): Promise<{ key: string; uploadSignedUrl: string }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    if (!file.fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: `cantUploadFileType`,
        },
      });
    }

    if (
      file.fileSize >
      (this.configService.get('file.maxFileSize', { infer: true }) || 0)
    ) {
      throw new PayloadTooLargeException({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        error: 'Payload Too Large',
        message: 'File too large',
      });
    }

    const key = `${randomStringGenerator()}.${file.fileName
      .split('.')
      .pop()
      ?.toLowerCase()}`;

    // Presigned URL points to quarantine bucket, NOT production
    const quarantineBucket = process.env.AWS_DEFAULT_S3_BUCKET_QUARANTINE ?? '';

    const command = new PutObjectCommand({
      Bucket: quarantineBucket,
      Key: key,
      ContentLength: file.fileSize,
    });

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    // DB record NOT saved yet — happens only after scan passes in confirmUpload()
    return {
      key,
      uploadSignedUrl: signedUrl,
    };
  }

  async confirmUpload(key: string): Promise<{ file: FileType }> {
    const quarantineBucket = process.env.AWS_DEFAULT_S3_BUCKET_QUARANTINE ?? '';
    const productionBucket = this.configService.getOrThrow(
      'file.awsDefaultS3Bucket',
      { infer: true },
    ) as string;

    // 1. Download from quarantine bucket into memory buffer
    const s3Object = await this.s3.send(
      new GetObjectCommand({ Bucket: quarantineBucket, Key: key }),
    );

    const chunks: Uint8Array[] = [];
    for await (const chunk of s3Object.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // 2. Scan the buffer — throws 422 if malicious or scan error
    try {
      await this.fileScanService.scanBuffer(buffer);
    } catch (error) {
      // Delete from quarantine so bad files don't linger
      await this.s3.send(
        new DeleteObjectCommand({ Bucket: quarantineBucket, Key: key }),
      );
      throw error;
    }

    // 3. Promote clean file from quarantine to production bucket
    await this.s3.send(
      new CopyObjectCommand({
        Bucket: productionBucket,
        CopySource: `${quarantineBucket}/${key}`,
        Key: key,
        ACL: 'public-read',
      }),
    );

    // 4. Delete from quarantine
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: quarantineBucket, Key: key }),
    );

    // 5. Now safe to save DB record
    const data = await this.fileRepository.create({ path: key });

    return { file: data };
  }
}
