import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerPlanEntity } from '../../../../customer-plans/infrastructure/persistence/relational/entities/customer-plan.entity';
import { PaymentPlanEntity } from '../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { PlanStatusEnum } from '../../../../utils/enum/plan-type.enum';

@Injectable()
export class CustomerPlanSeedService {
  private readonly logger = new Logger(CustomerPlanSeedService.name);

  constructor(
    @InjectRepository(CustomerPlanEntity)
    private readonly repository: Repository<CustomerPlanEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
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
      this.logger.warn('No tenants found. Skipping customer plan seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedCustomerPlansForTenant(tenant);
    }
  }

  private async seedCustomerPlansForTenant(tenant: TenantEntity) {
    const existingPlanCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingPlanCount > 0) {
      this.logger.log(
        `Customer plans already exist for tenant: ${tenant.name}`,
      );
      return;
    }

    // Fetch related entities
    const customerRole = await this.roleRepository.findOne({
      where: { name: 'Customer', tenant: { id: tenant.id } },
    });

    const customers = customerRole
      ? await this.userRepository.find({
          where: { tenant: { id: tenant.id }, role: { id: customerRole.id } },
          take: 5,
        })
      : [];

    const paymentPlans = await this.paymentPlanRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 3,
    });

    const adminUsers = await this.userRepository.find({
      where: { tenant: { id: tenant.id }, role: { name: 'Admin' } },
      take: 1,
    });

    if (!customers.length || !paymentPlans.length || !adminUsers.length) {
      this.logger.warn(
        `Skipping customer plan seeding for tenant ${tenant.name} - missing required entities`,
      );
      return;
    }

    const customerPlans = this.getCustomerPlanConfigurations(
      tenant,
      customers,
      paymentPlans,
      adminUsers,
    );

    for (const plan of customerPlans) {
      await this.repository.save(this.repository.create(plan));
      this.logger.log(
        `Created customer plan for ${plan?.customer?.[0]?.firstName ?? ''} ${plan?.customer?.[0]?.lastName ?? ''} in tenant: ${tenant.name}`,
      );
    }
  }

  private getCustomerPlanConfigurations(
    tenant: TenantEntity,
    customers: UserEntity[],
    paymentPlans: PaymentPlanEntity[],
    adminUsers: UserEntity[],
  ): Partial<CustomerPlanEntity>[] {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);

    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    return [
      // Standard active plan
      {
        tenant,
        customer: [customers[0]],
        plan: [paymentPlans[0]],
        startDate: today,
        endDate: oneYearLater,
        status: PlanStatusEnum.ACTIVE,
        assignedBy: adminUsers[0],
        customSchedule: {
          lastPaymentDate: today,
          paymentCount: 0,
        },
        nextPaymentDate: nextMonth,
      },

      // Tiered pricing plan
      {
        tenant,
        customer: [customers[1]],
        plan: [paymentPlans[1]],
        startDate: today,
        endDate: sixMonthsLater,
        status: PlanStatusEnum.ACTIVE,
        assignedBy: adminUsers[0],
        customRates: {
          baseRate: 500,
          tier1: { min: 0, max: 100, rate: 5 },
          tier2: { min: 101, max: 500, rate: 4.5 },
          tier3: { min: 501, rate: 4 },
        },
        nextPaymentDate: nextMonth,
      },

      // Prepaid credit plan
      {
        tenant,
        customer: [customers[2]],
        plan: [paymentPlans[2]],
        startDate: today,
        endDate: null,
        status: PlanStatusEnum.ACTIVE,
        assignedBy: adminUsers[0],
        customRates: {
          creditBalance: 2500,
          creditRate: 0.9,
        },
      },

      // Trial plan
      {
        tenant,
        customer: [customers[3]],
        plan: [paymentPlans[0]],
        startDate: today,
        endDate: nextMonth,
        status: PlanStatusEnum.TRIAL,
        assignedBy: adminUsers[0],
        customRates: {
          discount: 100,
        },
        nextPaymentDate: nextMonth,
      },

      // Suspended plan
      {
        tenant,
        customer: [customers[4]],
        plan: [paymentPlans[1]],
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 1),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 31),
        status: PlanStatusEnum.SUSPENDED,
        assignedBy: adminUsers[0],
        nextPaymentDate: null,
      },

      // Custom schedule plan
      {
        tenant,
        customer: [customers[0]],
        plan: [paymentPlans[2]],
        startDate: today,
        endDate: oneYearLater,
        status: PlanStatusEnum.ACTIVE,
        assignedBy: adminUsers[0],
        customSchedule: {
          lastPaymentDate: today,
          paymentCount: 3,
          nextPaymentDates: [
            new Date(today.getFullYear(), today.getMonth() + 1, 15),
            new Date(today.getFullYear(), today.getMonth() + 2, 15),
            new Date(today.getFullYear(), today.getMonth() + 3, 15),
          ],
        },
        nextPaymentDate: new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          15,
        ),
      },

      // Multi-plan customer
      {
        tenant,
        customer: [customers[1]],
        plan: [paymentPlans[0], paymentPlans[1]],
        startDate: today,
        endDate: oneYearLater,
        status: PlanStatusEnum.ACTIVE,
        assignedBy: adminUsers[0],
        customRates: {
          primaryDiscount: 10,
          secondaryFee: 50,
        },
        nextPaymentDate: nextMonth,
      },
    ];
  }
}
