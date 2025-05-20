import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HybridReviewService } from './hybrid-review.service';
import { HybridReviewController } from './hybrid-review.controller';

@Module({
  imports: [ConfigModule],
  providers: [HybridReviewService],
  controllers: [HybridReviewController],
  exports: [HybridReviewService],
})
export class HybridReviewModule {}
