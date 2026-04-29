import { Module } from '@nestjs/common';
import { RelationalProductPersistenceModule } from '../products/infrastructure/persistence/relational/relational-persistence.module';
import { RegionsModule } from '../regions/regions.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { RelationalCartPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RelationalCartPersistenceModule,
    RelationalProductPersistenceModule,
    RegionsModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
