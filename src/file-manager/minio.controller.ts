import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Delete,
  Param,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as fs from 'fs-extra';
import { getUploadsPath } from './utils/file-paths.util';
import { MinioService } from './minio.service';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload/:bucketName')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = getUploadsPath();
          try {
            fs.ensureDirSync(uploadPath);
            cb(null, uploadPath);
          } catch (err) {
            cb(err, '');
          }
        },
        filename: (req, file, cb) => cb(null, file.originalname),
      }),
    }),
  )
  async uploadFile(
    @Param('bucketName') bucketName: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.minioService.uploadFile(bucketName, file);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('download/:bucketName/:filename')
  async downloadFile(
    @Param('bucketName') bucketName: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      return await this.minioService.downloadFile(bucketName, filename, res);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete('delete/:bucketName/:filename')
  async deleteFile(
    @Param('bucketName') bucketName: string,
    @Param('filename') filename: string,
  ) {
    try {
      return await this.minioService.deleteFile(bucketName, filename);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('list/files/:bucketName')
  async listFiles(@Param('bucketName') bucketName: string) {
    try {
      return await this.minioService.listFiles(bucketName);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('list/buckets')
  async listBuckets() {
    try {
      return await this.minioService.listBuckets();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
