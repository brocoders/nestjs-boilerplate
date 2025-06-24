import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import facebookConfig from './auth-facebook/config/facebook.config';
import googleConfig from './auth-google/config/google.config';
import appleConfig from './auth-apple/config/apple.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAppleModule } from './auth-apple/auth-apple.module';
import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './session/session.module';
import { MailerModule } from './mailer/mailer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { DatabaseConfig } from './database/config/database-config.type';

// <database-block>
const infrastructureDatabaseModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    })
  : TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    });
// </database-block>

import { TenantsModule } from './tenants/tenants.module';

import { KycDetailsModule } from './kyc-details/kyc-details.module';

import { TenantTypesModule } from './tenant-types/tenant-types.module';

import { SettingsModule } from './settings/settings.module';

import { RegionsModule } from './regions/regions.module';

import { TenantConfigsModule } from './tenant-configs/tenant-configs.module';
import { TenantDataSourceProvider } from './database/providers/tenant-data-source.provider';
import { TenantMiddleware } from './middleware/tenant.middleware';

import { PaymentNotificationsModule } from './payment-notifications/payment-notifications.module';
import { ResidencesModule } from './residences/residences.module';
import { AccountsModule } from './accounts/accounts.module';

import { AccountsPayablesModule } from './accounts-payables/accounts-payables.module';

import { AccountsReceivablesModule } from './accounts-receivables/accounts-receivables.module';

import { TransactionsModule } from './transactions/transactions.module';

import { InvoicesModule } from './invoices/invoices.module';

import { PaymentPlansModule } from './payment-plans/payment-plans.module';

import { CustomerPlansModule } from './customer-plans/customer-plans.module';

import { VendorsModule } from './vendors/vendors.module';

import { VendorBillsModule } from './vendor-bills/vendor-bills.module';

import { PaymentsModule } from './payments/payments.module';

import { InventoriesModule } from './inventories/inventories.module';

import { DiscountsModule } from './discounts/discounts.module';

import { ExemptionsModule } from './exemptions/exemptions.module';

import { RemindersModule } from './reminders/reminders.module';

import { PaymentMethodsModule } from './payment-methods/payment-methods.module';

import { PaymentAggregatorsModule } from './payment-aggregators/payment-aggregators.module';

import { CreditBalancesModule } from './credit-balances/credit-balances.module';

import { OnboardingsModule } from './onboardings/onboardings.module';

import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { TenantDataSource } from './database/tenant-data-source';

@Module({
  imports: [
    AuditLogsModule,
    OnboardingsModule,
    PaymentNotificationsModule,
    CreditBalancesModule,
    PaymentAggregatorsModule,
    PaymentMethodsModule,
    RemindersModule,
    ExemptionsModule,
    DiscountsModule,
    InventoriesModule,
    PaymentsModule,
    VendorBillsModule,
    VendorsModule,
    CustomerPlansModule,
    PaymentPlansModule,
    InvoicesModule,
    TransactionsModule,
    AccountsReceivablesModule,
    AccountsPayablesModule,
    AccountsModule,
    ResidencesModule,
    TenantConfigsModule,
    RegionsModule,
    SettingsModule,
    TenantTypesModule,
    KycDetailsModule,
    TenantsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        appleConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    AuthFacebookModule,
    AuthGoogleModule,
    AuthAppleModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
  ],
  providers: [TenantDataSourceProvider],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(private configService: ConfigService<AllConfigType>) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'admin/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
  async onApplicationBootstrap() {
    // Initialize core database
    const coreDbConfig = this.configService.getOrThrow('database.core', {
      infer: true,
    });
    if (!coreDbConfig) {
      throw new Error('Core database configuration is missing');
    }
    await TenantDataSource.initializeCore(this.configService);
  }
}
