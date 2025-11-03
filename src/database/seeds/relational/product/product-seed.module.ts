import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductSeedService } from './product-seed.service';
import { Product } from '../../../../products/domain/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductSeedService],
  exports: [ProductSeedService],
})
export class ProductSeedModule {}
