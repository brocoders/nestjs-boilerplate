import { Module } from '@nestjs/common';
import { ProductsPublicController } from './products-public.controller';
import { ProductsVendorController } from './products-vendor.controller';
import { ProductsService } from './products.service';
import { RelationalProductPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { VendorsModule } from '../vendors/vendors.module';
import { CategoriesModule } from '../categories/categories.module';
import { RegionsModule } from '../regions/regions.module';

@Module({
  imports: [
    RelationalProductPersistenceModule,
    VendorsModule,
    CategoriesModule,
    RegionsModule,
  ],
  controllers: [ProductsPublicController, ProductsVendorController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
