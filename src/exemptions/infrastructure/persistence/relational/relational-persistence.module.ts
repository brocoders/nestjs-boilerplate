import { Module } from '@nestjs/common';
import { ExemptionRepository } from '../exemption.repository';
import { ExemptionRelationalRepository } from './repositories/exemption.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExemptionEntity } from './entities/exemption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExemptionEntity])],
  providers: [
    {
      provide: ExemptionRepository,
      useClass: ExemptionRelationalRepository,
    },
  ],
  exports: [ExemptionRepository],
})
export class RelationalExemptionPersistenceModule {}
