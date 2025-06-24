import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../../../../payments/infrastructure/persistence/relational/entities/payment.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { PaymentMethodEntity } from '../../../../payment-methods/infrastructure/persistence/relational/entities/payment-method.entity';
import { TransactionEntity } from '../../../../transactions/infrastructure/persistence/relational/entities/transaction.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { PaymentStatus } from '../../../../utils/enum/payment-notification.enums';

@Injectable()
export class PaymentSeedService {
  private readonly logger = new Logger(PaymentSeedService.name);

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly repository: Repository<PaymentEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping payment seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedPaymentsForTenant(tenant);
    }
  }

  private async seedPaymentsForTenant(tenant: TenantEntity) {
    const existingPaymentCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingPaymentCount > 0) {
      this.logger.log(`Payments already exist for tenant: ${tenant.name}`);
      return;
    }

    // Fetch related entities
    const customerRole = await this.roleRepository.findOne({
      where: { name: 'Customer', tenant: { id: tenant.id } },
    });

    const customers = customerRole
      ? await this.userRepository.find({
          where: { tenant: { id: tenant.id }, role: { id: customerRole.id } },
          take: 3,
        })
      : [];

    const invoices = await this.invoiceRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 3,
    });

    const paymentMethods = await this.paymentMethodRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 2,
    });

    if (!customers.length || !invoices.length || !paymentMethods.length) {
      this.logger.warn(
        `Skipping payment seeding for tenant ${tenant.name} - missing required entities`,
      );
      return;
    }

    const payments = this.getPaymentConfigurations(
      tenant,
      customers,
      invoices,
      paymentMethods,
    );

    for (const payment of payments) {
      await this.repository.save(this.repository.create(payment));
      this.logger.log(
        `Created ${payment.status} payment of KES ${payment.amount} for tenant: ${tenant.name}`,
      );
    }
  }

  private getPaymentConfigurations(
    tenant: TenantEntity,
    customers: UserEntity[],
    invoices: InvoiceEntity[],
    paymentMethods: PaymentMethodEntity[],
  ): Partial<PaymentEntity>[] {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    return [
      // Successful M-Pesa payment
      {
        tenant,
        customer: customers[0],
        invoice: invoices[0],
        paymentMethod: paymentMethods[0],
        amount: 1500,
        paymentDate: today,
        status: PaymentStatus.COMPLETED,
      },

      // Pending bank transfer
      {
        tenant,
        customer: customers[1],
        invoice: invoices[1],
        paymentMethod: paymentMethods[1],
        amount: 2500,
        paymentDate: today,
        status: PaymentStatus.PENDING,
      },

      // Failed card payment
      {
        tenant,
        customer: customers[2],
        invoice: invoices[2],
        paymentMethod: paymentMethods[0],
        amount: 1800,
        paymentDate: yesterday,
        status: PaymentStatus.FAILED,
      },

      // Partial payment
      {
        tenant,
        customer: customers[0],
        invoice: invoices[0],
        paymentMethod: paymentMethods[1],
        amount: 500,
        paymentDate: today,
        status: PaymentStatus.PARTIAL,
      },

      // Refunded payment
      {
        tenant,
        customer: customers[1],
        invoice: invoices[1],
        paymentMethod: paymentMethods[0],
        amount: 1200,
        paymentDate: lastWeek,
        status: PaymentStatus.REFUNDED,
      },

      // Cash payment
      {
        tenant,
        customer: customers[2],
        invoice: invoices[2],
        paymentMethod: null, // Cash payments may not have a payment method
        amount: 900,
        paymentDate: today,
        status: PaymentStatus.COMPLETED,
      },
    ];
  }
}
