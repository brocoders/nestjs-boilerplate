import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HybridReviewService } from './hybrid-review.service';
import { HybridReviewController } from './hybrid-review.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [ConfigModule, AiModule],
  providers: [HybridReviewService],
  controllers: [HybridReviewController],
  exports: [HybridReviewService],
})
export class HybridReviewModule {}
