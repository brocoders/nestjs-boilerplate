import { Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import { MinioService } from './minio.service';
import { EnableGuard } from 'src/common/guards/service-enabled.guard';

@Module({
  providers: [MinioService, EnableGuard],
  controllers: [MinioController],
  exports: [MinioService],
})
export class MinioModule {}
