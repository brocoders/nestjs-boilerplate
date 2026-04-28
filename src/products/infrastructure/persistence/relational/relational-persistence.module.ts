import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAbstractRepository } from '../product.abstract.repository';
import { ProductVariantAbstractRepository } from '../product-variant.abstract.repository';
import { ProductEntity } from './entities/product.entity';
import { ProductOptionTypeEntity } from './entities/product-option-type.entity';
import { ProductOptionValueEntity } from './entities/product-option-value.entity';
import { ProductVariantEntity } from './entities/product-variant.entity';
import { ProductVariantOptionValueEntity } from './entities/product-variant-option-value.entity';
import { VariantPriceEntity } from './entities/variant-price.entity';
import { VariantStockEntity } from './entities/variant-stock.entity';
import { ProductRelationalRepository } from './repositories/product.repository';
import { ProductVariantRelationalRepository } from './repositories/product-variant.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductOptionTypeEntity,
      ProductOptionValueEntity,
      ProductVariantEntity,
      ProductVariantOptionValueEntity,
      VariantPriceEntity,
      VariantStockEntity,
    ]),
  ],
  providers: [
    {
      provide: ProductAbstractRepository,
      useClass: ProductRelationalRepository,
    },
    {
      provide: ProductVariantAbstractRepository,
      useClass: ProductVariantRelationalRepository,
    },
  ],
  exports: [ProductAbstractRepository, ProductVariantAbstractRepository],
})
export class RelationalProductPersistenceModule {}
