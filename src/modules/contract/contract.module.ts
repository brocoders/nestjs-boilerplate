import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../../entities/contract.entity';
import { Clause } from '../../entities/clause.entity';
import { RiskFlag } from '../../entities/risk-flag.entity';
import { Summary } from '../../entities/summary.entity';
import { QnA } from '../../entities/qna.entity';
import { HumanReview } from '../../entities/human-review.entity';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contract,
      Clause,
      RiskFlag,
      Summary,
      QnA,
      HumanReview,
    ]),
    AiModule,
  ],
  providers: [ContractService],
  controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule {}
