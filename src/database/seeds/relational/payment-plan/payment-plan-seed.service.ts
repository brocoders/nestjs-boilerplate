import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import {
  PaymentPlanEntity,
  PlanType,
  RateStructure,
  Tier,
} from '../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';

@Injectable()
export class PaymentPlanSeedService {
  private readonly logger = new Logger(PaymentPlanSeedService.name);

  constructor(
    @InjectRepository(PaymentPlanEntity)
    private readonly repository: Repository<PaymentPlanEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping payment plan seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedPlansForTenant(tenant);
    }
  }

  private async seedPlansForTenant(tenant: TenantEntity) {
    const existingPlanCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingPlanCount > 0) {
      this.logger.log(`Payment plans already exist for tenant: ${tenant.name}`);
      return;
    }

    const plans = this.getPlanConfigurations(tenant);

    for (const plan of plans) {
      await this.repository.save(this.repository.create(plan));
      this.logger.log(
        `Created ${plan.type} payment plan for tenant: ${tenant.name}`,
      );
    }
  }

  private getPlanConfigurations(
    tenant: TenantEntity,
  ): Partial<PaymentPlanEntity>[] {
    const tieredTiers: Tier[] = [
      { from: 0, to: 100, rate: 0.4 },
      { from: 101, to: 500, rate: 0.35 },
      { from: 501, to: 1000000, rate: 0.3 }, // null represents no upper limit
    ];

    return [
      // Flat Monthly Plan
      {
        tenant,
        name: 'Basic Monthly',
        isActive: true,
        unit: 'flat',
        minimumCharge: 100,
        type: PlanType.FLAT_MONTHLY,
        rateStructure: { type: 'FLAT', amount: 100 } as RateStructure,
        description: 'Flat monthly fee regardless of usage',
      },

      // Per Weight Plan
      {
        tenant,
        name: 'Pay-as-you-throw',
        isActive: true,
        unit: 'kg',
        minimumCharge: 20,
        type: PlanType.PER_WEIGHT,
        rateStructure: { type: 'PER_UNIT', rate: 0.5 } as RateStructure,
        description: 'Pay per kilogram of waste collected',
      },

      // Tiered Pricing Plan
      {
        tenant,
        name: 'Volume Discount',
        isActive: true,
        unit: 'kg',
        minimumCharge: 30,
        type: PlanType.TIERED,
        rateStructure: {
          type: 'TIERED',
          tiers: tieredTiers,
        } as RateStructure,
        description: 'Volume-based discounts for high usage',
      },

      // Prepaid Credits Plan
      {
        tenant,
        name: 'Prepaid Credits',
        isActive: true,
        unit: 'credit',
        minimumCharge: 0,
        type: PlanType.PREPAID,
        rateStructure: { type: 'PREPAID', creditRate: 0.9 } as RateStructure,
        description: 'Pre-purchase credits at a discounted rate',
      },

      // Credit-Based Plan
      {
        tenant,
        name: 'Credit System',
        isActive: false, // Inactive plan example
        unit: 'credit',
        minimumCharge: 5,
        type: PlanType.CREDIT,
        rateStructure: { type: 'CREDIT_RATE', rate: 1.0 } as RateStructure,
        description: 'Standard credit-based billing',
      },

      // Additional Tiered Plan
      {
        tenant,
        name: 'Premium Tiered',
        isActive: true,
        unit: 'kg',
        minimumCharge: 50,
        type: PlanType.TIERED,
        rateStructure: {
          type: 'TIERED',
          tiers: [
            { from: 0, to: 50, rate: 0.6 },
            { from: 51, to: 200, rate: 0.45 },
            { from: 201, to: null, rate: 0.35 },
          ],
        } as RateStructure,
        description: 'Premium volume pricing',
      },

      // Low-Cost Monthly Plan
      {
        tenant,
        name: 'Economy Monthly',
        isActive: true,
        unit: 'flat',
        minimumCharge: 75,
        type: PlanType.FLAT_MONTHLY,
        rateStructure: { type: 'FLAT', amount: 75 } as RateStructure,
        description: 'Basic service with limited features',
      },
    ];
  }
}
