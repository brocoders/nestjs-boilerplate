import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentAggregatorEntity } from '../../../../payment-aggregators/infrastructure/persistence/relational/entities/payment-aggregator.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { PaymentAggregatorSeedService } from './payment-aggregator-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentAggregatorEntity, TenantEntity])],
  providers: [PaymentAggregatorSeedService],
  exports: [PaymentAggregatorSeedService],
})
export class PaymentAggregatorSeedModule {}
