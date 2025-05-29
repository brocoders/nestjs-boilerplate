import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentAggregatorEntity } from '../../../../payment-aggregators/infrastructure/persistence/relational/entities/payment-aggregator.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Injectable()
export class PaymentAggregatorSeedService {
  private readonly logger = new Logger(PaymentAggregatorSeedService.name);

  constructor(
    @InjectRepository(PaymentAggregatorEntity)
    private readonly repository: Repository<PaymentAggregatorEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn(
        'No tenants found. Skipping payment aggregator seeding.',
      );
      return;
    }

    for (const tenant of tenants) {
      await this.seedAggregatorsForTenant(tenant);
    }
  }

  private async seedAggregatorsForTenant(tenant: TenantEntity) {
    const existingAggregatorCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingAggregatorCount > 0) {
      this.logger.log(
        `Payment aggregators already exist for tenant: ${tenant.name}`,
      );
      return;
    }

    const aggregators = this.getAggregatorConfigurations(tenant);

    for (const aggregator of aggregators) {
      const createdAggregator = await this.repository.save(
        this.repository.create(aggregator),
      );
      this.logger.log(
        `Created payment aggregator '${createdAggregator.name}' for tenant: ${tenant.name}`,
      );
    }
  }

  private getAggregatorConfigurations(
    tenant: TenantEntity,
  ): Partial<PaymentAggregatorEntity>[] {
    return [
      // M-Pesa (Most popular in Kenya and East Africa)
      {
        tenant,
        name: 'M-Pesa Integration',
        isActive: true,
        logo: 'https://example.com/logos/mpesa.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/mpesa`,
          authToken: 'mpesa_sandbox_token_placeholder',
          reconciliationWindow: 24,
        },
      },

      // Flutterwave (Pan-African)
      {
        tenant,
        name: 'Flutterwave Gateway',
        isActive: true,
        logo: 'https://example.com/logos/flutterwave.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/flutterwave`,
          authToken: 'flw_sandbox_key_placeholder',
          reconciliationWindow: 48,
        },
      },

      // Paystack (West Africa focus, expanding)
      {
        tenant,
        name: 'Paystack Payments',
        isActive: true,
        logo: 'https://example.com/logos/paystack.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/paystack`,
          authToken: 'pk_test_paystack_placeholder',
          reconciliationWindow: 24,
        },
      },

      // Cellulant (Pan-African)
      {
        tenant,
        name: 'Cellulant Tingg',
        isActive: true,
        logo: 'https://example.com/logos/cellulant.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/cellulant`,
          authToken: 'cellulant_sandbox_token',
          reconciliationWindow: 72,
        },
      },

      // Airtel Money (Pan-African)
      {
        tenant,
        name: 'Airtel Money API',
        isActive: true,
        logo: 'https://example.com/logos/airtel.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/airtel`,
          authToken: 'airtel_sandbox_key',
          reconciliationWindow: 24,
        },
      },

      // PalmPay (West and East Africa)
      {
        tenant,
        name: 'PalmPay Gateway',
        isActive: false,
        logo: 'https://example.com/logos/palmpay.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/palmpay`,
          authToken: 'palmpay_test_token',
          reconciliationWindow: 36,
        },
      },

      // Equitel (Kenya)
      {
        tenant,
        name: 'Equitel Payment System',
        isActive: true,
        logo: 'https://example.com/logos/equitel.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/equitel`,
          authToken: 'equitel_test_cred',
          reconciliationWindow: 24,
        },
      },

      // Pesapal (East Africa)
      {
        tenant,
        name: 'Pesapal Integration',
        isActive: true,
        logo: 'https://example.com/logos/pesapal.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/pesapal`,
          authToken: 'pesapal_sandbox_key',
          reconciliationWindow: 48,
        },
      },
      // ======== LOCAL BANKS ========
      // Equity Bank (Kenya)
      {
        tenant,
        name: 'Equity Bank Kenya',
        isActive: true,
        logo: 'https://example.com/logos/equity.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/equity`,
          authToken: 'equity_sandbox_token',
          reconciliationWindow: 48,
        },
      },

      // KCB Bank (Kenya)
      {
        tenant,
        name: 'KCB Bank Kenya',
        isActive: true,
        logo: 'https://example.com/logos/kcb.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/kcb`,
          authToken: 'kcb_sandbox_key',
          reconciliationWindow: 24,
        },
      },

      // Co-operative Bank (Kenya)
      {
        tenant,
        name: 'Co-operative Bank Kenya',
        isActive: true,
        logo: 'https://example.com/logos/coop.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/coop`,
          authToken: 'coop_sandbox_token',
          reconciliationWindow: 36,
        },
      },

      // Absa Bank (Pan-African)
      {
        tenant,
        name: 'Absa Bank Africa',
        isActive: true,
        logo: 'https://example.com/logos/absa.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/absa`,
          authToken: 'absa_sandbox_cred',
          reconciliationWindow: 48,
        },
      },

      // Standard Chartered (Pan-African)
      {
        tenant,
        name: 'Standard Chartered Bank',
        isActive: true,
        logo: 'https://example.com/logos/standard_chartered.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/standardchartered`,
          authToken: 'sc_sandbox_key',
          reconciliationWindow: 24,
        },
      },

      // GTBank (Nigeria)
      {
        tenant,
        name: 'GTBank Nigeria',
        isActive: true,
        logo: 'https://example.com/logos/gtbank.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/gtbank`,
          authToken: 'gtb_sandbox_token',
          reconciliationWindow: 24,
        },
      },

      // Access Bank (Pan-African)
      {
        tenant,
        name: 'Access Bank Africa',
        isActive: true,
        logo: 'https://example.com/logos/access_bank.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/access`,
          authToken: 'access_sandbox_key',
          reconciliationWindow: 36,
        },
      },

      // Ecobank (Pan-African)
      {
        tenant,
        name: 'Ecobank Transnational',
        isActive: true,
        logo: 'https://example.com/logos/ecobank.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/ecobank`,
          authToken: 'ecobank_sandbox_token',
          reconciliationWindow: 48,
        },
      },

      // UBA (Pan-African)
      {
        tenant,
        name: 'United Bank for Africa',
        isActive: true,
        logo: 'https://example.com/logos/uba.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/uba`,
          authToken: 'uba_sandbox_key',
          reconciliationWindow: 24,
        },
      },

      // DTB (Kenya & East Africa)
      {
        tenant,
        name: 'Diamond Trust Bank',
        isActive: true,
        logo: 'https://example.com/logos/dtb.png',
        config: {
          webhookUrl: `https://api.${tenant.domain}/webhooks/dtb`,
          authToken: 'dtb_sandbox_token',
          reconciliationWindow: 24,
        },
      },
    ];
  }
}
