import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryAbstractRepository } from '../category.abstract.repository';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRelationalRepository } from './repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    {
      provide: CategoryAbstractRepository,
      useClass: CategoryRelationalRepository,
    },
  ],
  exports: [CategoryAbstractRepository],
})
export class RelationalCategoryPersistenceModule {}
