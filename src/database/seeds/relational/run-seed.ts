import { NestFactory } from '@nestjs/core';
import { TenantTypesSeedService } from './tenant-types/tenant-types-seed.service';
import { SeedModule } from './seed.module';
import { TenantSeedService } from './tenant/tenant-seed.service';
import { RoleSeedService } from './role/role-seed.service';
import { StatusSeedService } from './status/status-seed.service';
import { RegionSeedService } from './region/region-seed.service';
import { KycDetailSeedService } from './kyc-detail/kyc-detail-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { SettingsSeedService } from './settings/settings-seed.service';
import { ResidenceSeedService } from './residence/residence-seed.service';
import { AccountSeedService } from './account/account-seed.service';
import { SubscriptionSeedService } from './subscription/subscription-seed.service';
import { DiscountSeedService } from './discount/discount-seed.service';
import { InventorySeedService } from './inventory/inventory-seed.service';
import { PaymentAggregatorSeedService } from './payment-aggregator/payment-aggregator-seed.service';
import { PaymentMethodSeedService } from './payment-method/payment-method-seed.service';
import { PaymentNotificationSeedService } from './payment-notification/payment-notification-seed.service';
import { PaymentPlanSeedService } from './payment-plan/payment-plan-seed.service';
import { VendorSeedService } from './vendor/vendor-seed.service';
import { AccountsPayableSeedService } from './accounts-payable/accounts-payable-seed.service';
import { AccountsReceivableSeedService } from './accounts-receivable/accounts-receivable-seed.service';
import { CreditBalanceSeedService } from './credit-balance/credit-balance-seed.service';
import { ExemptionSeedService } from './exemption/exemption-seed.service';
import { InvoiceSeedService } from './invoice/invoice-seed.service';
import { PaymentSeedService } from './payment/payment-seed.service';
import { ReminderSeedService } from './reminder/reminder-seed.service';
import { TenantConfigSeedService } from './tenant-config/tenant-config-seed.service';
import { TransactionSeedService } from './transaction/transaction-seed.service';
import { VendorBillSeedService } from './vendor-bill/vendor-bill-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(TenantTypesSeedService).run();
  await app.get(TenantSeedService).run();
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(RegionSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(KycDetailSeedService).run();

  await app.get(SettingsSeedService).run();

  await app.get(ResidenceSeedService).run();

  await app.get(AccountSeedService).run();
  await app.get(PaymentAggregatorSeedService).run();
  await app.get(PaymentNotificationSeedService).run();

  await app.get(AccountsReceivableSeedService).run();

  await app.get(SubscriptionSeedService).run();

  await app.get(DiscountSeedService).run();

  await app.get(ExemptionSeedService).run();

  await app.get(InventorySeedService).run();

  await app.get(InvoiceSeedService).run();

  await app.get(PaymentMethodSeedService).run();

  await app.get(PaymentPlanSeedService).run();

  await app.get(ReminderSeedService).run();

  await app.get(TenantConfigSeedService).run();

  await app.get(TransactionSeedService).run();

  await app.get(VendorSeedService).run();
  await app.get(AccountsPayableSeedService).run();
  await app.get(CreditBalanceSeedService).run(); //TODO: Implement credit balance seeding logic
  await app.get(PaymentSeedService).run(); //TODO: Implement payment seeding logic
  await app.get(VendorBillSeedService).run();

  await app.close();
};

void runSeed();
