import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditBalanceEntity } from '../../../../credit-balances/infrastructure/persistence/relational/entities/credit-balance.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';

@Injectable()
export class CreditBalanceSeedService {
  private readonly logger = new Logger(CreditBalanceSeedService.name);

  constructor(
    @InjectRepository(CreditBalanceEntity)
    private readonly repository: Repository<CreditBalanceEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping credit balance seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedCreditBalancesForTenant(tenant);
    }
  }

  private async seedCreditBalancesForTenant(tenant: TenantEntity) {
    const existingCreditCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingCreditCount > 0) {
      this.logger.log(
        `Credit balances already exist for tenant: ${tenant.name}`,
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

    if (!customers.length) {
      this.logger.warn(
        `Skipping credit balance seeding for tenant ${tenant.name} - no customers found`,
      );
      return;
    }

    const creditBalances = this.getCreditBalanceConfigurations(
      tenant,
      customers,
    );

    for (const cb of creditBalances) {
      await this.repository.save(this.repository.create(cb));
      this.logger.log(
        `Created credit balance of KES ${cb.amount} for ${cb?.customer?.firstName} in tenant: ${tenant.name}`,
      );
    }
  }

  private getCreditBalanceConfigurations(
    tenant: TenantEntity,
    customers: UserEntity[],
  ): Partial<CreditBalanceEntity>[] {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    return [
      // Standard credit balance
      {
        tenant,
        customer: customers[0],
        amount: 5000,
        auditLog: [
          {
            date: today,
            amount: 5000,
            type: 'ADD',
            reference: 'WELCOME_CREDIT_12345',
          },
          {
            date: yesterday,
            amount: 1000,
            type: 'ADD',
            reference: 'TOPUP_67890',
          },
        ],
      },

      // Large credit balance
      {
        tenant,
        customer: customers[1],
        amount: 15000,
        auditLog: [
          {
            date: lastWeek,
            amount: 15000,
            type: 'ADD',
            reference: 'BULK_PURCHASE_ABCDE',
          },
        ],
      },

      // Small credit balance
      {
        tenant,
        customer: customers[2],
        amount: 1000,
        auditLog: [
          {
            date: today,
            amount: 1000,
            type: 'ADD',
            reference: 'REFERRAL_BONUS_FGHIJ',
          },
        ],
      },

      // Zero credit balance
      {
        tenant,
        customer: customers[3],
        amount: 0,
        auditLog: [
          {
            date: yesterday,
            amount: 500,
            type: 'ADD',
            reference: 'INITIAL_CREDIT_KL123',
          },
          {
            date: today,
            amount: 500,
            type: 'DEDUCT',
            reference: 'PAYMENT_MN456',
          },
        ],
      },

      // Negative credit balance (overdraft)
      {
        tenant,
        customer: customers[4],
        amount: -2500,
        auditLog: [
          {
            date: lastWeek,
            amount: 2000,
            type: 'ADD',
            reference: 'CREDIT_LINE_OP789',
          },
          {
            date: today,
            amount: 4500,
            type: 'DEDUCT',
            reference: 'OVERDRAFT_QR012',
          },
        ],
      },

      // Complex balance history
      {
        tenant,
        customer: customers[0],
        amount: 3200,
        auditLog: [
          {
            date: lastWeek,
            amount: 1000,
            type: 'ADD',
            reference: 'INITIAL_DEPOSIT_ST135',
          },
          {
            date: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days later
            amount: 500,
            type: 'DEDUCT',
            reference: 'PAYMENT_UV246',
          },
          {
            date: new Date(lastWeek.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days later
            amount: 3000,
            type: 'ADD',
            reference: 'TOPUP_WX357',
          },
          {
            date: yesterday,
            amount: 1300,
            type: 'DEDUCT',
            reference: 'SERVICE_FEE_YZ468',
          },
        ],
      },
    ];
  }
}
