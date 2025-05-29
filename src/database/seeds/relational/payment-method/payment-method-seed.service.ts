import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PaymentMethodEntity,
  PaymentMethodConfig,
} from '../../../../payment-methods/infrastructure/persistence/relational/entities/payment-method.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Injectable()
export class PaymentMethodSeedService {
  private readonly logger = new Logger(PaymentMethodSeedService.name);

  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly repository: Repository<PaymentMethodEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping payment method seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedPaymentMethodsForTenant(tenant);
    }
  }

  private async seedPaymentMethodsForTenant(tenant: TenantEntity) {
    const existingMethodCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingMethodCount > 0) {
      this.logger.log(
        `Payment methods already exist for tenant: ${tenant.name}`,
      );
      return;
    }

    const paymentMethods = this.getPaymentMethodConfigurations(tenant);

    for (const method of paymentMethods) {
      const createdMethod = await this.repository.save(
        this.repository.create(method),
      );
      this.logger.log(
        `Created payment method '${createdMethod.name}' for tenant: ${tenant.name}`,
      );
    }
  }

  private getPaymentMethodConfigurations(
    tenant: TenantEntity,
  ): Partial<PaymentMethodEntity>[] {
    return [
      // Stripe integration
      {
        tenant,
        name: 'Stripe Credit Cards',
        processorType: 'stripe',
        config: {
          provider: 'Stripe',
          apiKey: 'sk_test_placeholder12345',
          sandboxMode: true,
        } as PaymentMethodConfig,
      },
      // PayPal integration
      {
        tenant,
        name: 'PayPal Express',
        processorType: 'paypal',
        config: {
          provider: 'PayPal',
          apiKey: 'paypal_sandbox_api_key',
          sandboxMode: true,
        } as PaymentMethodConfig,
      },
      // Bank transfer
      {
        tenant,
        name: 'Bank Transfer',
        processorType: 'bank',
        config: null, // No config needed for bank transfers
      },
      // Cash payment
      {
        tenant,
        name: 'Cash Payments',
        processorType: 'cash',
        config: null, // No config needed for cash
      },
      // Mobile money
      {
        tenant,
        name: 'Mobile Money',
        processorType: 'mobile',
        config: {
          provider: 'MTN Mobile Money',
          apiKey: 'momo_sandbox_key',
          sandboxMode: true,
        } as PaymentMethodConfig,
      },
      // Check payments
      {
        tenant,
        name: 'Check Payments',
        processorType: 'check',
        config: null,
      },
      // Crypto payments
      {
        tenant,
        name: 'Crypto Payments',
        processorType: 'crypto',
        config: {
          provider: 'Coinbase Commerce',
          apiKey: 'crypto_sandbox_key',
          sandboxMode: true,
        } as PaymentMethodConfig,
      },
    ];
  }
}
