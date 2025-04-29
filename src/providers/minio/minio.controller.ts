import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Delete,
  Param,
  Get,
  UseGuards,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as fs from 'fs-extra';
import { getUploadsPath } from './utils/file-paths.util';
import { MinioService } from './minio.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';

import {
  UploadFileResponseDto,
  DeleteFileResponseDto,
  ListFilesResponseDto,
  ListBucketsResponseDto,
} from './dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { ServiceEnabledGuard } from 'src/common/guards/service-enabled.guard';
import { SetMetadata } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';
import { DeleteFileDto } from './dto/delete-file.dto';
import { ListFilesDto } from './dto/list-files.dto';

@UseGuards(AuthGuard('jwt'), ServiceEnabledGuard)
@SetMetadata('configPath', 'minIO.enable')
@ApiTags('MinIO')
@ApiBearerAuth()
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file to a MinIO bucket' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file payload',
    type: UploadFileDto,
  })
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
  @ApiCreatedResponse({
    description: 'File uploaded',
    type: UploadFileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file upload request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error during file upload',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'MinIO service not available',
  })
  async uploadFile(
    @Body() uploadFileDto: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    return this.minioService.uploadFile(uploadFileDto.bucketName, file);
  }

  @Get('download/:bucketName/:filename')
  @ApiOperation({ summary: 'Download a file from a MinIO bucket' })
  @ApiParam({ name: 'bucketName', description: 'Bucket name', type: String })
  @ApiParam({
    name: 'filename',
    description: 'Filename to download',
    type: String,
  })
  @ApiOkResponse({ description: 'File downloaded' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'File not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error during file download',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'MinIO service not available',
  })
  async downloadFile(
    @Param() downloadFileDto: DownloadFileDto,
    @Res() res: Response,
  ): Promise<void> {
    return await this.minioService.downloadFile(
      downloadFileDto.bucketName,
      downloadFileDto.filename,
      res,
    );
  }

  @Delete('delete/:bucketName/:filename')
  @ApiOperation({ summary: 'Delete a file from a MinIO bucket' })
  @ApiParam({ name: 'bucketName', description: 'Bucket name', type: String })
  @ApiParam({
    name: 'filename',
    description: 'Filename to delete',
    type: String,
  })
  @ApiOkResponse({ description: 'File deleted', type: DeleteFileResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'File not found for deletion',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error during file deletion',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'MinIO service not available',
  })
  async deleteFile(
    @Param() deleteFileDto: DeleteFileDto,
  ): Promise<DeleteFileResponseDto> {
    return await this.minioService.deleteFile(
      deleteFileDto.bucketName,
      deleteFileDto.filename,
    );
  }

  @Get('list/files/:bucketName')
  @ApiOperation({ summary: 'List files in a MinIO bucket' })
  @ApiParam({ name: 'bucketName', description: 'Bucket name', type: String })
  @ApiOkResponse({ description: 'List of files', type: ListFilesResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Bucket not found or no files',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error during listing files',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'MinIO service not available',
  })
  async listFiles(
    @Param() listFilesDto: ListFilesDto,
  ): Promise<ListFilesResponseDto> {
    return await this.minioService.listFiles(listFilesDto.bucketName);
  }

  @Get('list/buckets')
  @ApiOperation({ summary: 'List all MinIO buckets' })
  @ApiOkResponse({
    description: 'List of buckets',
    type: ListBucketsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error during listing buckets',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'MinIO service not available',
  })
  async listBuckets(): Promise<ListBucketsResponseDto> {
    return await this.minioService.listBuckets();
  }
}
