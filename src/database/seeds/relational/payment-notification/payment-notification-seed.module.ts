import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentNotificationEntity } from '../../../../payment-notifications/infrastructure/persistence/relational/entities/payment-notification.entity';
import { PaymentAggregatorEntity } from '../../../../payment-aggregators/infrastructure/persistence/relational/entities/payment-aggregator.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { PaymentNotificationSeedService } from './payment-notification-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentNotificationEntity,
      PaymentAggregatorEntity,
      TenantEntity,
    ]),
  ],
  providers: [PaymentNotificationSeedService],
  exports: [PaymentNotificationSeedService],
})
export class PaymentNotificationSeedModule {}
