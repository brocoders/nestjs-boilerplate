import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodEntity } from '../../../../payment-methods/infrastructure/persistence/relational/entities/payment-method.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { PaymentMethodSeedService } from './payment-method-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodEntity, TenantEntity])],
  providers: [PaymentMethodSeedService],
  exports: [PaymentMethodSeedService],
})
export class PaymentMethodSeedModule {}
