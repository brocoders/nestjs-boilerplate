import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartAbstractRepository } from '../cart.abstract.repository';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartRelationalRepository } from './repositories/cart.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity])],
  providers: [
    {
      provide: CartAbstractRepository,
      useClass: CartRelationalRepository,
    },
  ],
  exports: [CartAbstractRepository],
})
export class RelationalCartPersistenceModule {}
