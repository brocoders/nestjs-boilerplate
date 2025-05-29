import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountEntity } from '../../../../discounts/infrastructure/persistence/relational/entities/discount.entity';
import { PaymentPlanEntity } from '../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { DiscountTypeEnum } from '../../../../utils/enum/account-type.enum';

@Injectable()
export class DiscountSeedService {
  private readonly logger = new Logger(DiscountSeedService.name);

  constructor(
    @InjectRepository(DiscountEntity)
    private readonly repository: Repository<DiscountEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PaymentPlanEntity)
    private readonly paymentPlanRepository: Repository<PaymentPlanEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping discount seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedDiscountsForTenant(tenant);
    }
  }

  private async seedDiscountsForTenant(tenant: TenantEntity) {
    const existingDiscountCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingDiscountCount > 0) {
      this.logger.log(`Discounts already exist for tenant: ${tenant.name}`);
      return;
    }

    // Fetch related entities
    const regions = await this.regionRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 2,
    });

    const customerRole = await this.roleRepository.findOne({
      where: { name: 'Customer', tenant: { id: tenant.id } },
    });

    const customers = customerRole
      ? await this.userRepository.find({
          where: { tenant: { id: tenant.id }, role: { id: customerRole.id } },
          take: 2,
        })
      : [];

    const paymentPlans = await this.paymentPlanRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 2,
    });

    const discounts = this.getDiscountConfigurations(
      tenant,
      regions,
      customers,
      paymentPlans,
    );

    for (const discount of discounts) {
      await this.repository.save(this.repository.create(discount));
      this.logger.log(
        `Created ${discount.type} discount for tenant: ${tenant.name}`,
      );
    }
  }

  private getDiscountConfigurations(
    tenant: TenantEntity,
    regions: RegionEntity[],
    customers: UserEntity[],
    paymentPlans: PaymentPlanEntity[],
  ): Partial<DiscountEntity>[] {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);

    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    return [
      // General discount for all customers
      {
        tenant,
        isActive: true,
        validFrom: today,
        validTo: oneYearLater,
        value: 10,
        type: DiscountTypeEnum.PERCENTAGE,
        description: '10% off for all customers',
      },

      // Region-specific discount
      ...(regions.length > 0
        ? [
            {
              tenant,
              region: regions[0],
              isActive: true,
              validFrom: today,
              validTo: sixMonthsLater,
              value: 5,
              type: DiscountTypeEnum.PERCENTAGE,
              description: `5% discount for ${regions[0].name} residents`,
            },
          ]
        : []),

      // Customer loyalty discount
      ...(customers.length > 0
        ? [
            {
              tenant,
              customer: customers[0],
              isActive: true,
              validFrom: today,
              validTo: nextMonth,
              value: 500,
              type: DiscountTypeEnum.FIXED_AMOUNT,
              description: 'KES 500 off for loyal customer',
            },
          ]
        : []),

      // Payment plan discount
      ...(paymentPlans.length > 0
        ? [
            {
              tenant,
              plan: paymentPlans[0],
              isActive: true,
              validFrom: today,
              validTo: oneYearLater,
              value: 15,
              type: DiscountTypeEnum.PERCENTAGE,
              description: `15% off with ${paymentPlans[0].name} payment plan`,
            },
          ]
        : []),

      // High-volume discount
      {
        tenant,
        isActive: true,
        validFrom: today,
        validTo: oneYearLater,
        value: 7.5,
        type: DiscountTypeEnum.PERCENTAGE,
        description: '7.5% discount for waste volumes > 1000kg',
        minVolume: 1000,
      },

      // Seasonal discount
      {
        tenant,
        isActive: true,
        validFrom: new Date(new Date().getFullYear(), 11, 1), // December 1st
        validTo: new Date(new Date().getFullYear(), 11, 31), // December 31st
        value: 12.5,
        type: DiscountTypeEnum.PERCENTAGE,
        description: 'Holiday season special discount',
      },

      // Fixed amount discount for all
      {
        tenant,
        isActive: true,
        validFrom: today,
        validTo: sixMonthsLater,
        value: 200,
        type: DiscountTypeEnum.FIXED_AMOUNT,
        description: 'KES 200 off for all customers',
      },

      // Inactive discount (for testing)
      {
        tenant,
        isActive: false,
        validFrom: today,
        validTo: oneYearLater,
        value: 25,
        type: DiscountTypeEnum.PERCENTAGE,
        description: 'Disabled discount',
      },
    ];
  }
}
