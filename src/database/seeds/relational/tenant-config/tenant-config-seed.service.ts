import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantConfigEntity } from '../../../../tenant-configs/infrastructure/persistence/relational/entities/tenant-config.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Injectable()
export class TenantConfigSeedService {
  private readonly logger = new Logger(TenantConfigSeedService.name);

  constructor(
    @InjectRepository(TenantConfigEntity)
    private readonly repository: Repository<TenantConfigEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping tenant config seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedConfigsForTenant(tenant);
    }
  }

  private async seedConfigsForTenant(tenant: TenantEntity) {
    const existingConfigCount = await this.repository.count({
      where: { tenantId: tenant.id },
    });

    if (existingConfigCount > 0) {
      this.logger.log(`Configs already exist for tenant: ${tenant.name}`);
      return;
    }

    const configs = this.getConfigConfigurations(tenant);

    for (const config of configs) {
      await this.repository.save(this.repository.create(config));
      this.logger.log(
        `Created config '${config.key}' for tenant: ${tenant.name}`,
      );
    }
  }

  private getConfigConfigurations(
    tenant: TenantEntity,
  ): Partial<TenantConfigEntity>[] {
    return [
      // Billing configuration
      {
        tenantId: tenant.id,
        key: 'billing',
        value: {
          currency: 'KES',
          taxRate: 0.16,
          lateFeePercent: 0.05,
          invoiceDueDays: 14,
          paymentMethods: ['mpesa', 'bank', 'card'],
        },
      },

      // Waste management settings
      {
        tenantId: tenant.id,
        key: 'wasteSettings',
        value: {
          defaultUnit: 'kg',
          recyclingRates: {
            plastic: 0.5,
            metal: 0.8,
            paper: 0.3,
            glass: 0.4,
          },
          hazardousWasteFee: 500,
          collectionSchedule: {
            residential: 'weekly',
            commercial: 'daily',
          },
        },
      },

      // Notification preferences
      {
        tenantId: tenant.id,
        key: 'notifications',
        value: {
          invoiceEmail: true,
          paymentSMS: true,
          collectionReminder: true,
          channels: ['email', 'sms', 'push', 'whatsapp'],
          notificationFrequency: 'daily',
        },
      },

      // API integrations
      {
        tenantId: tenant.id,
        key: 'integrations',
        value: {
          mpesaSandbox: true,
          flutterwaveApiKey: 'flw_test_placeholder',
          googleMapsApiKey: 'gmaps_placeholder',
          weatherApiKey: 'weather_placeholder',
          thirdPartyServices: ['mpesa', 'flutterwave', 'googleMaps', 'weather'],
        },
      },

      // System preferences
      {
        tenantId: tenant.id,
        key: 'preferences',
        value: {
          timezone: 'Africa/Nairobi',
          dateFormat: 'dd/MM/yyyy',
          defaultLanguage: 'en',
          autoApprovePayments: false,
          enableAnalytics: true,
          maintenanceMode: false,
          maxLoginAttempts: 5,
          sessionTimeoutMinutes: 30,
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireNumber: true,
            requireSpecialChar: true,
          },
        },
      },

      // Credit system settings
      {
        tenantId: tenant.id,
        key: 'creditSettings',
        value: {
          minTopup: 100,
          maxCredit: 5000,
          referralBonus: 500,
          overdraftLimit: 2000,
          creditExpiryMonths: 12,
          creditNotificationThreshold: 1000,
          creditAuditLog: true,
          creditAuditLogEntries: [
            {
              date: new Date(),
              action: 'Initial credit allocation',
              userId: 'system',
              amount: 5000,
              notes: 'New customer welcome credit',
            },
          ],
        },
      },
    ];
  }
}
