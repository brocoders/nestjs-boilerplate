import { Module } from '@nestjs/common';
import { ResidenceRepository } from '../residence.repository';
import { ResidenceRelationalRepository } from './repositories/residence.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidenceEntity } from './entities/residence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResidenceEntity])],
  providers: [
    {
      provide: ResidenceRepository,
      useClass: ResidenceRelationalRepository,
    },
  ],
  exports: [ResidenceRepository],
})
export class RelationalResidencePersistenceModule {}
