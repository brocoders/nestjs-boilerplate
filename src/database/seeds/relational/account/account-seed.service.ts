import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../../../../accounts/infrastructure/persistence/relational/entities/account.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { AccountTypeEnum } from '../../../../utils/enum/account-type.enum';
import {
  NotificationChannelEnum,
  NotificationTypeEnum,
} from '../../../../utils/enum/account-type.enum';

@Injectable()
export class AccountSeedService {
  private readonly logger = new Logger(AccountSeedService.name);

  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    for (const tenant of tenants) {
      const accountsCount = await this.accountRepository.count({
        where: { tenant: { id: tenant.id } },
      });

      if (accountsCount > 0) {
        this.logger.log(`Accounts already exist for tenant: ${tenant.name}`);
        continue;
      }

      const financeRole = await this.roleRepository.findOne({
        where: {
          name: 'Finance',
          tenant: { id: tenant.id },
        },
      });

      let owners: any = [];
      if (financeRole) {
        owners = await this.userRepository.find({
          where: {
            role: { id: financeRole.id },
            tenant: { id: tenant.id },
          },
        });
      }

      const wasteManagementAccounts: Partial<AccountEntity>[] = [
        // Asset Accounts

        {
          name: 'Waste Collection Vehicles',
          description: 'Trucks and specialized vehicles for waste collection',
          type: AccountTypeEnum.asset,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-ASSET-001',
          tenant,
          owner: owners,
        },
        {
          name: 'Recycling Equipment',
          description: 'Sorting lines, balers, and processing machinery',
          type: AccountTypeEnum.asset,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-ASSET-002',
          tenant,
          owner: owners,
        },
        {
          name: 'Accounts Receivable',
          description: 'Customer payments for waste management services',
          type: AccountTypeEnum.asset,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-ASSET-003',
          tenant,
          owner: owners,
        },
        {
          name: 'Mobile Money Wallet',
          description: 'Tracks all mobile money funds',
          type: AccountTypeEnum.asset,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-ASSET-004',
          tenant,
          owner: owners,
        },
        {
          name: 'Bank Account',
          description: 'Main business bank account',
          type: AccountTypeEnum.asset,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-ASSET-005',
          tenant,
          owner: owners,
        },
        {
          name: 'Petty Cash',
          description: 'Cash on hand for small expenses',
          type: AccountTypeEnum.asset,
          number: 'WM-ASSET-006',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },
        {
          name: 'Vendor Advances',
          description: 'Prepayments to vendors/suppliers',
          type: AccountTypeEnum.asset,
          number: 'WM-ASSET-007',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },
        {
          name: 'Inventory',
          description: 'Value of inventory in stock',
          type: AccountTypeEnum.asset,
          number: 'WM-ASSET-008',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },

        // Liability Accounts
        {
          name: 'Equipment Financing',
          description: 'Loans for waste processing equipment purchases',
          type: AccountTypeEnum.liability,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-LIAB-001',
          tenant,
          owner: owners,
        },
        {
          name: 'Landfill Fees Payable',
          description: 'Outstanding payments to landfill operators',
          type: AccountTypeEnum.liability,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-LIAB-002',
          tenant,
          owner: owners,
        },
        {
          name: 'Accounts Payable',
          description: 'Outstanding amounts owed to vendors',
          type: AccountTypeEnum.liability,
          number: 'WM-LIAB-003',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },
        {
          name: 'Advance Customer Payments',
          description: 'Prepayments from customers before delivery',
          type: AccountTypeEnum.liability,
          number: 'WM-LIAB-004',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },
        {
          name: 'Tax Payable',
          description: 'Taxes owed to government',
          type: AccountTypeEnum.liability,
          number: 'WM-LIAB-005',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },
        // Revenue Accounts
        {
          name: 'Residential Collection Fees',
          description: 'Income from household waste collection services',
          type: AccountTypeEnum.revenue,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-REV-001',
          tenant,
          owner: owners,
        },
        {
          name: 'Commercial Recycling Contracts',
          description: 'Revenue from business recycling agreements',
          type: AccountTypeEnum.revenue,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-REV-002',
          tenant,
          owner: owners,
        },
        {
          name: 'Recycled Materials Sales',
          description: 'Income from sales of sorted recyclables',
          type: AccountTypeEnum.revenue,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-REV-003',
          tenant,
          owner: owners,
        },
        {
          name: 'Product Sales',
          description: 'Revenue from sales of goods or produce',
          type: AccountTypeEnum.revenue,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-REV-004',
          tenant,
          owner: owners,
        },
        {
          name: 'Service Income',
          description: 'Revenue from services or subscriptions',
          type: AccountTypeEnum.revenue,
          number: 'WM-REV-005',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },

        // Expense Accounts
        {
          name: 'Vehicle Maintenance',
          description: 'Fuel, repairs, and maintenance for collection trucks',
          type: AccountTypeEnum.expense,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-EXP-001',
          tenant,
          owner: owners,
        },
        {
          name: 'Waste Processing Costs',
          description: 'Costs associated with recycling operations',
          type: AccountTypeEnum.expense,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-EXP-002',
          tenant,
          owner: owners,
        },
        {
          name: 'Environmental Compliance',
          description: 'Costs for permits and regulatory compliance',
          type: AccountTypeEnum.expense,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-EXP-003',
          tenant,
          owner: owners,
        },
        {
          name: 'Safety Equipment',
          description: 'Protective gear for waste handlers',
          type: AccountTypeEnum.expense,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-EXP-004',
          tenant,
          owner: owners,
        },
        {
          name: 'Cost of Goods Sold (COGS)',
          description: 'Cost of inventory items sold',
          type: AccountTypeEnum.expense,
          balance: 0,
          number: 'WM-EXP-005',
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },
        {
          name: 'Inventory Shrinkage',
          description: 'Loss due to spoilage, theft, or errors',
          type: AccountTypeEnum.expense,
          number: 'WM-EXP-006',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },
        {
          name: 'Salaries & Wages',
          description: 'Employee payroll and wages',
          type: AccountTypeEnum.expense,
          number: 'WM-EXP-007',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },
        {
          name: 'Utilities & Internet',
          description: 'Monthly utility bills and internet costs',
          type: AccountTypeEnum.expense,
          number: 'WM-EXP-008',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },
        {
          name: 'Marketing & Advertising',
          description: 'Costs for ads, campaigns, and promotions',
          type: AccountTypeEnum.expense,
          number: 'WM-EXP-009',
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          tenant,
          owner: owners,
        },

        // Equity Accounts
        {
          name: 'Environmental Grants',
          description: 'Funding received for green initiatives',
          type: AccountTypeEnum.equity,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-EQUITY-001',
          tenant,
          owner: owners,
        },
        {
          name: 'Retained Earnings',
          description: 'Reinvested profits from operations',
          type: AccountTypeEnum.equity,
          balance: 0,
          active: true,
          receiveNotification: true,
          notificationChannel: NotificationChannelEnum.EMAIL,
          notificationType: NotificationTypeEnum.ALERT,
          number: 'WM-EQUITY-002',
          tenant,
          owner: owners,
        },
      ];

      await this.accountRepository.save(
        this.accountRepository.create(wasteManagementAccounts),
      );
      this.logger.log(
        `Seeded ${wasteManagementAccounts.length} waste management accounts for tenant ${tenant.name}`,
      );
    }
  }
}
