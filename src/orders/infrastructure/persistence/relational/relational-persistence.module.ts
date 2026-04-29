import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from '../../../../cart/infrastructure/persistence/relational/entities/cart-item.entity';
import { OrderAbstractRepository } from '../order.abstract.repository';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { SubOrderEntity } from './entities/sub-order.entity';
import { OrderRelationalRepository } from './repositories/order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      SubOrderEntity,
      OrderItemEntity,
      CartItemEntity,
    ]),
  ],
  providers: [
    {
      provide: OrderAbstractRepository,
      useClass: OrderRelationalRepository,
    },
  ],
  exports: [OrderAbstractRepository],
})
export class RelationalOrderPersistenceModule {}
