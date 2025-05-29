import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../../typeorm-config.service';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import databaseConfig from '../../config/database.config';
import appConfig from '../../../config/app.config';

import { RegionSeedModule } from './region/region-seed.module';

import { TenantSeedModule } from './tenant/tenant-seed.module';

import { KycDetailSeedModule } from './kyc-detail/kyc-detail-seed.module';

import { SettingsSeedModule } from './settings/settings-seed.module';

import { TenantTypesSeedModule } from './tenant-types/tenant-types-seed.module';

import { ResidenceSeedModule } from './residence/residence-seed.module';

import { AccountSeedModule } from './account/account-seed.module';

import { PaymentNotificationSeedModule } from './payment-notification/payment-notification-seed.module';

import { AccountsPayableSeedModule } from './accounts-payable/accounts-payable-seed.module';

import { AccountsReceivableSeedModule } from './accounts-receivable/accounts-receivable-seed.module';

import { CreditBalanceSeedModule } from './credit-balance/credit-balance-seed.module';

import { CustomerPlanSeedModule } from './customer-plan/customer-plan-seed.module';

import { DiscountSeedModule } from './discount/discount-seed.module';

import { ExemptionSeedModule } from './exemption/exemption-seed.module';

import { InventorySeedModule } from './inventory/inventory-seed.module';

import { InvoiceSeedModule } from './invoice/invoice-seed.module';

import { KycDetailsSeedModule } from './kyc-details/kyc-details-seed.module';

import { PaymentAggregatorSeedModule } from './payment-aggregator/payment-aggregator-seed.module';

import { PaymentMethodSeedModule } from './payment-method/payment-method-seed.module';

import { PaymentPlanSeedModule } from './payment-plan/payment-plan-seed.module';

import { PaymentSeedModule } from './payment/payment-seed.module';

import { ReminderSeedModule } from './reminder/reminder-seed.module';

import { TenantConfigSeedModule } from './tenant-config/tenant-config-seed.module';

import { TenantTypeSeedModule } from './tenant-type/tenant-type-seed.module';

import { TransactionSeedModule } from './transaction/transaction-seed.module';

import { VendorBillSeedModule } from './vendor-bill/vendor-bill-seed.module';

import { VendorSeedModule } from './vendor/vendor-seed.module';

@Module({
  imports: [
    VendorSeedModule,
    VendorBillSeedModule,
    TransactionSeedModule,
    TenantTypeSeedModule,
    TenantConfigSeedModule,
    ReminderSeedModule,
    PaymentSeedModule,
    PaymentPlanSeedModule,
    PaymentMethodSeedModule,
    PaymentAggregatorSeedModule,
    KycDetailsSeedModule,
    InvoiceSeedModule,
    InventorySeedModule,
    ExemptionSeedModule,
    DiscountSeedModule,
    CustomerPlanSeedModule,
    CreditBalanceSeedModule,
    AccountsReceivableSeedModule,
    AccountsPayableSeedModule,
    PaymentNotificationSeedModule,
    AccountSeedModule,
    ResidenceSeedModule,
    TenantTypesSeedModule,
    TenantSeedModule,
    RoleSeedModule,
    StatusSeedModule,
    RegionSeedModule,
    KycDetailSeedModule,
    SettingsSeedModule,
    //

    UserSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
