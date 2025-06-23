import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsPayableEntity } from '../../../../accounts-payables/infrastructure/persistence/relational/entities/accounts-payable.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { AccountEntity } from '../../../../accounts/infrastructure/persistence/relational/entities/account.entity';
import { VendorEntity } from '../../../../vendors/infrastructure/persistence/relational/entities/vendor.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import {
  AccountTypeEnum,
  TransactionTypeEnum,
} from '../../../../utils/enum/account-type.enum';

@Injectable()
export class AccountsPayableSeedService {
  private readonly logger = new Logger(AccountsPayableSeedService.name);

  constructor(
    @InjectRepository(AccountsPayableEntity)
    private readonly repository: Repository<AccountsPayableEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping accounts payable seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedAccountsPayableForTenant(tenant);
    }
  }

  private async seedAccountsPayableForTenant(tenant: TenantEntity) {
    const existingAPCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingAPCount > 0) {
      this.logger.log(
        `Accounts payable already exist for tenant: ${tenant.name}`,
      );
      return;
    }

    // Fetch related entities
    const accounts = await this.accountRepository.find({
      where: { tenant: { id: tenant.id }, type: AccountTypeEnum.liability },
      take: 2,
    });

    const adminRole = await this.roleRepository.findOne({
      where: { name: 'Admin', tenant: { id: tenant.id } },
    });

    const owners = adminRole
      ? await this.userRepository.find({
          where: { tenant: { id: tenant.id }, role: { id: adminRole.id } },
          take: 1,
        })
      : [];

    const vendors = await this.vendorRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 3,
    });

    if (!accounts.length || !owners.length || !vendors.length) {
      this.logger.warn(
        `Skipping AP seeding for tenant ${tenant.name} - missing required entities`,
      );
      return;
    }

    const accountsPayable = this.getAccountsPayableConfigurations(
      tenant,
      accounts,
      owners,
      vendors,
    );

    for (const ap of accountsPayable) {
      await this.repository.save(this.repository.create(ap));
      this.logger.log(
        `Created ${ap.transactionType} AP entry for ${ap.itemName} in tenant: ${tenant.name}`,
      );
    }
  }

  private getAccountsPayableConfigurations(
    tenant: TenantEntity,
    accounts: AccountEntity[],
    owners: UserEntity[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vendors: VendorEntity[],
  ): Partial<AccountsPayableEntity>[] {
    return [
      // Waste collection service
      {
        tenant,
        account: [accounts[0]],
        owner: owners,
        itemName: 'Waste Collection Service',
        itemDescription: 'Monthly waste collection service fee',
        quantity: 1,
        purchasePrice: 15000,
        salePrice: null,
        amount: 15000,
        transactionType: TransactionTypeEnum.SERVICE_FEE,
        accountType: AccountTypeEnum.liability,
      },

      // Bin purchase
      {
        tenant,
        account: [accounts[1]],
        owner: owners,
        itemName: '110L Wheelie Bins',
        itemDescription: 'Purchase of waste bins',
        quantity: 500,
        purchasePrice: 25,
        salePrice: null,
        amount: 12500,
        transactionType: TransactionTypeEnum.ASSET_PURCHASE,
        accountType: AccountTypeEnum.liability,
      },

      // Fuel purchase
      {
        tenant,
        account: [accounts[0]],
        owner: owners,
        itemName: 'Diesel Fuel',
        itemDescription: 'Fuel for collection vehicles',
        quantity: 5000,
        purchasePrice: 12,
        salePrice: null,
        amount: 6000,
        transactionType: TransactionTypeEnum.FUEL_PURCHASE,
        accountType: AccountTypeEnum.liability,
      },

      // Maintenance service
      {
        tenant,
        account: [accounts[1]],
        owner: owners,
        itemName: 'Truck Maintenance',
        itemDescription: 'Routine maintenance for collection vehicles',
        quantity: 1,
        purchasePrice: 8000,
        salePrice: null,
        amount: 8000,
        transactionType: TransactionTypeEnum.MAINTENANCE,
        accountType: AccountTypeEnum.liability,
      },

      // Office supplies
      {
        tenant,
        account: [accounts[0]],
        owner: owners,
        itemName: 'Office Supplies',
        itemDescription: 'Monthly office supplies',
        quantity: 1,
        purchasePrice: 1500,
        salePrice: null,
        amount: 1500,
        transactionType: TransactionTypeEnum.OFFICE_SUPPLIES,
        accountType: AccountTypeEnum.liability,
      },

      // Vendor payment
      {
        tenant,
        account: [accounts[1]],
        owner: owners,
        itemName: 'Vendor Payment - Waste Mgmt Inc',
        itemDescription: 'Payment to waste processing vendor',
        quantity: 1,
        purchasePrice: 20000,
        salePrice: null,
        amount: 20000,
        transactionType: TransactionTypeEnum.VENDOR_PAYMENT,
        accountType: AccountTypeEnum.liability,
      },
    ];
  }
}
