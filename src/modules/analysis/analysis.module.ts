import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { AiService } from './ai.service';
import { Contract } from './entities/contract.entity';
import { Clause } from './entities/clause.entity';
import { RiskFlag } from './entities/risk-flag.entity';
import { Summary } from './entities/summary.entity';
import { QnA } from './entities/qna.entity';
import { HumanReview } from './entities/human-review.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Contract,
      Clause,
      RiskFlag,
      Summary,
      QnA,
      HumanReview,
    ]),
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService, AiService],
  exports: [AnalysisService],
})
export class AnalysisModule {} 