import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InvoiceEntity,
  InvoiceStatus,
} from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { DiscountEntity } from '../../../../discounts/infrastructure/persistence/relational/entities/discount.entity';
import { ExemptionEntity } from '../../../../exemptions/infrastructure/persistence/relational/entities/exemption.entity';
import { PaymentPlanEntity } from '../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class InvoiceSeedService {
  private readonly logger = new Logger(InvoiceSeedService.name);

  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly repository: Repository<InvoiceEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PaymentPlanEntity)
    private readonly paymentPlanRepository: Repository<PaymentPlanEntity>,
    @InjectRepository(ExemptionEntity)
    private readonly exemptionRepository: Repository<ExemptionEntity>,
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping invoice seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedInvoicesForTenant(tenant);
    }
  }

  private async seedInvoicesForTenant(tenant: TenantEntity) {
    const existingInvoiceCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingInvoiceCount > 0) {
      this.logger.log(`Invoices already exist for tenant: ${tenant.name}`);
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

    const paymentPlans = await this.paymentPlanRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 2,
    });

    const exemptions = await this.exemptionRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 1,
    });

    const discounts = await this.discountRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 1,
    });

    if (!customers.length || !paymentPlans.length) {
      this.logger.warn(
        `Skipping invoice seeding for tenant ${tenant.name} - missing required entities`,
      );
      return;
    }

    const invoices = this.getInvoiceConfigurations(
      tenant,
      customers,
      paymentPlans,
      exemptions,
      discounts,
    );

    for (const invoice of invoices) {
      await this.repository.save(this.repository.create(invoice));
      this.logger.log(
        `Created ${invoice.status} invoice for ${invoice?.customer?.firstName} in tenant: ${tenant.name}`,
      );
    }
  }

  private getInvoiceConfigurations(
    tenant: TenantEntity,
    customers: UserEntity[],
    paymentPlans: PaymentPlanEntity[],
    exemptions: ExemptionEntity[],
    discounts: DiscountEntity[],
  ): Partial<InvoiceEntity>[] {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    const overdueDate = new Date();
    overdueDate.setDate(today.getDate() - 15);

    return [
      // Standard pending invoice
      {
        invoiceNumber: 'INV-001',
        tenant,
        customer: customers[0],
        plan: [paymentPlans[0]],
        amount: 1500,
        amountDue: 1500,
        amountPaid: 0,
        status: InvoiceStatus.PENDING,
        dueDate: nextWeek,
        breakdown: {
          baseAmount: 1500,
          discounts: 0,
          tax: 0,
          adjustments: 0,
        },
      },

      // Paid invoice with discount
      {
        invoiceNumber: 'INV-002',
        tenant,
        customer: customers[1],
        plan: [paymentPlans[1]],
        amount: 2000,
        amountDue: 0,
        amountPaid: 1800,
        status: InvoiceStatus.PAID,
        dueDate: lastMonth,
        discount: discounts.length ? discounts[0] : null,
        breakdown: {
          baseAmount: 2000,
          discounts: 200,
          tax: 0,
          adjustments: 0,
        },
      },

      // Overdue invoice
      {
        invoiceNumber: 'INV-003',
        tenant,
        customer: customers[2],
        plan: [paymentPlans[0]],
        amount: 1200,
        amountDue: 1200,
        amountPaid: 0,
        status: InvoiceStatus.OVERDUE,
        dueDate: overdueDate,
        breakdown: {
          baseAmount: 1200,
          discounts: 0,
          tax: 0,
          adjustments: 0,
        },
      },

      // Invoice with exemption
      {
        invoiceNumber: 'INV-004',
        tenant,
        customer: customers[0],
        plan: [paymentPlans[1]],
        amount: 1800,
        amountDue: 0,
        amountPaid: 0,
        status: InvoiceStatus.PAID,
        dueDate: nextWeek,
        exemption: exemptions.length ? exemptions[0] : null,
        breakdown: {
          baseAmount: 1800,
          discounts: 0,
          tax: 0,
          adjustments: -1800,
        },
      },

      // Partially paid invoice
      {
        invoiceNumber: 'INV-005',
        tenant,
        customer: customers[1],
        plan: [paymentPlans[0], paymentPlans[1]],
        amount: 2500,
        amountDue: 1000,
        amountPaid: 1500,
        status: InvoiceStatus.PENDING,
        dueDate: nextWeek,
        breakdown: {
          baseAmount: 2500,
          discounts: 0,
          tax: 0,
          adjustments: 0,
        },
      },

      // Failed payment invoice
      {
        invoiceNumber: 'INV-006',
        tenant,
        customer: customers[2],
        plan: [paymentPlans[1]],
        amount: 900,
        amountDue: 900,
        amountPaid: 0,
        status: InvoiceStatus.FAILED,
        dueDate: lastMonth,
        breakdown: {
          baseAmount: 900,
          discounts: 0,
          tax: 0,
          adjustments: 0,
        },
      },

      // Cancelled invoice
      {
        invoiceNumber: 'INV-007',
        tenant,
        customer: customers[0],
        plan: [paymentPlans[0]],
        amount: 750,
        amountDue: 0,
        amountPaid: 0,
        status: InvoiceStatus.CANCELLED,
        dueDate: nextWeek,
        breakdown: {
          baseAmount: 750,
          discounts: 0,
          tax: 0,
          adjustments: -750,
        },
      },
    ];
  }
}
