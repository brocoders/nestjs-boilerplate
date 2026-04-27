import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAbstractRepository } from '../product.abstract.repository';
import { ProductEntity } from './entities/product.entity';
import { ProductRelationalRepository } from './repositories/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [
    {
      provide: ProductAbstractRepository,
      useClass: ProductRelationalRepository,
    },
  ],
  exports: [ProductAbstractRepository],
})
export class RelationalProductPersistenceModule {}
