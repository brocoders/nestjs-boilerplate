import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FxRateAbstractRepository } from '../fx-rate.abstract.repository';
import { FxRateEntity } from './entities/fx-rate.entity';
import { FxRateRelationalRepository } from './repositories/fx-rate.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FxRateEntity])],
  providers: [
    { provide: FxRateAbstractRepository, useClass: FxRateRelationalRepository },
  ],
  exports: [FxRateAbstractRepository],
})
export class RelationalFxRatePersistenceModule {}
