import { Module } from '@nestjs/common';
import { PaymentMethodRepository } from '../payment-method.repository';
import { PaymentMethodRelationalRepository } from './repositories/payment-method.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodEntity } from './entities/payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodEntity])],
  providers: [
    {
      provide: PaymentMethodRepository,
      useClass: PaymentMethodRelationalRepository,
    },
  ],
  exports: [PaymentMethodRepository],
})
export class RelationalPaymentMethodPersistenceModule {}
