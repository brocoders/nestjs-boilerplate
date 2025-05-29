import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsReceivableEntity } from '../../../../accounts-receivables/infrastructure/persistence/relational/entities/accounts-receivable.entity';
import { AccountEntity } from '../../../../accounts/infrastructure/persistence/relational/entities/account.entity';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import {
  AccountTypeEnum,
  TransactionTypeEnum,
} from '../../../../utils/enum/account-type.enum';

@Injectable()
export class AccountsReceivableSeedService {
  private readonly logger = new Logger(AccountsReceivableSeedService.name);

  constructor(
    @InjectRepository(AccountsReceivableEntity)
    private readonly repository: Repository<AccountsReceivableEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn(
        'No tenants found. Skipping accounts receivable seeding.',
      );
      return;
    }

    for (const tenant of tenants) {
      await this.seedAccountsReceivableForTenant(tenant);
    }
  }

  private async seedAccountsReceivableForTenant(tenant: TenantEntity) {
    const existingARCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingARCount > 0) {
      this.logger.log(
        `Accounts receivable already exist for tenant: ${tenant.name}`,
      );
      return;
    }

    // Fetch related entities
    const accounts = await this.accountRepository.find({
      where: { tenant: { id: tenant.id }, type: AccountTypeEnum.asset },
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

    const invoices = await this.invoiceRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 2,
    });

    if (!accounts.length || !owners.length) {
      this.logger.warn(
        `Skipping AR seeding for tenant ${tenant.name} - missing required entities`,
      );
      return;
    }

    const accountsReceivable = this.getAccountsReceivableConfigurations(
      tenant,
      accounts,
      owners,
      invoices,
    );

    for (const ar of accountsReceivable) {
      await this.repository.save(this.repository.create(ar));
      this.logger.log(
        `Created ${ar.transactionType} AR entry for tenant: ${tenant.name}`,
      );
    }
  }

  private getAccountsReceivableConfigurations(
    tenant: TenantEntity,
    accounts: AccountEntity[],
    owners: UserEntity[],
    invoices: InvoiceEntity[],
  ): Partial<AccountsReceivableEntity>[] {
    console.log('invoices', invoices.length);
    return [
      // Standard invoice payment
      {
        tenant,
        account: [accounts[0]],
        owner: owners,
        amount: 1500,
        transactionType: TransactionTypeEnum.INVOICE_PAYMENT,
        accountType: AccountTypeEnum.asset,
      },

      // Credit memo
      {
        tenant,
        account: [accounts[1]],
        owner: owners,
        amount: -500,
        transactionType: TransactionTypeEnum.CREDIT_MEMO,
        accountType: AccountTypeEnum.asset,
      },

      // Invoice adjustment
      {
        tenant,
        account: [accounts[0]],
        owner: owners,
        amount: 200,
        transactionType: TransactionTypeEnum.ADJUSTMENT,
        accountType: AccountTypeEnum.asset,
      },

      // Late fee
      {
        tenant,
        account: [accounts[1]],
        owner: owners,
        amount: 100,
        transactionType: TransactionTypeEnum.LATE_FEE,
        accountType: AccountTypeEnum.asset,
      },

      // Invoice write-off
      {
        tenant,
        account: [accounts[0]],
        owner: owners,
        amount: -750,
        transactionType: TransactionTypeEnum.WRITE_OFF,
        accountType: AccountTypeEnum.asset,
      },
    ];
  }
}
