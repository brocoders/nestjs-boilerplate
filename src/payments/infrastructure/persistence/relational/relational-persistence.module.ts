import { Module } from '@nestjs/common';
import { PaymentRepository } from '../payment.repository';
import { PaymentRelationalRepository } from './repositories/payment.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [
    {
      provide: PaymentRepository,
      useClass: PaymentRelationalRepository,
    },
  ],
  exports: [PaymentRepository],
})
export class RelationalPaymentPersistenceModule {}
