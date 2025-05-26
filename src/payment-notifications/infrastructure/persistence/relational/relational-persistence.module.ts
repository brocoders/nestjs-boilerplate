import { Module } from '@nestjs/common';
import { PaymentNotificationRepository } from '../payment-notification.repository';
import { PaymentNotificationRelationalRepository } from './repositories/payment-notification.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentNotificationEntity } from './entities/payment-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentNotificationEntity])],
  providers: [
    {
      provide: PaymentNotificationRepository,
      useClass: PaymentNotificationRelationalRepository,
    },
  ],
  exports: [PaymentNotificationRepository],
})
export class RelationalPaymentNotificationPersistenceModule {}
