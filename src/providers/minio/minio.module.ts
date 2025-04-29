import { Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import { MinioService } from './minio.service';

@Module({
  providers: [MinioService],
  controllers: [MinioController],
  exports: [MinioService],
})
export class MinioModule {}
