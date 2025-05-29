import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ReminderChannel,
  ReminderEntity,
  ReminderStatus,
} from '../../../../reminders/infrastructure/persistence/relational/entities/reminder.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';

@Injectable()
export class ReminderSeedService {
  private readonly logger = new Logger(ReminderSeedService.name);

  constructor(
    @InjectRepository(ReminderEntity)
    private readonly reminderRepository: Repository<ReminderEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();
    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping reminder seeding.');
      return;
    }

    for (const tenant of tenants) {
      const existingReminders = await this.reminderRepository.find({
        where: { tenant: { id: tenant.id } },
      });

      if (existingReminders.length > 0) {
        this.logger.log(
          `Reminders already exist for tenant: ${tenant.name}. Skipping.`,
        );
        continue;
      }

      // Get customer role for this tenant
      const customerRole = await this.roleRepository.findOne({
        where: { name: 'Customer', tenant: { id: tenant.id } },
      });

      if (!customerRole) {
        this.logger.warn(`No 'Customer' role found for tenant: ${tenant.name}`);
        continue;
      }

      // Get customers and invoices for this tenant
      const customers = await this.userRepository.find({
        where: { tenant: { id: tenant.id }, role: { id: customerRole.id } },
        take: 5, // Limit to 5 customers per tenant
      });

      const invoices = await this.invoiceRepository.find({
        where: { tenant: { id: tenant.id } },
        take: 3, // Limit to 3 invoices per tenant
      });

      if (!customers.length && !invoices.length) {
        this.logger.warn(
          `No customers or invoices found for tenant: ${tenant.name}`,
        );
        continue;
      }

      // Create different types of reminders
      const remindersToCreate: Partial<ReminderEntity>[] = [];

      // System reminders (no specific user/invoice)
      remindersToCreate.push({
        tenant,
        channel: ReminderChannel.EMAIL,
        status: ReminderStatus.SCHEDULED,
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        message: 'System maintenance scheduled next week',
      });

      // User-specific reminders
      customers.forEach((customer) => {
        remindersToCreate.push(
          {
            tenant,
            user: customer,
            channel: ReminderChannel.SMS,
            status: ReminderStatus.SCHEDULED,
            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            message: 'Your subscription renewal is due soon',
          },
          {
            tenant,
            user: customer,
            channel: ReminderChannel.PUSH,
            status: ReminderStatus.SENT,
            scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
            sentAt: new Date(),
            message: 'Thank you for your recent payment!',
          },
        );
      });

      // Invoice reminders
      invoices.forEach((invoice) => {
        const customer =
          customers[Math.floor(Math.random() * customers.length)];

        remindersToCreate.push(
          {
            tenant,
            invoice,
            channel: ReminderChannel.EMAIL,
            status: ReminderStatus.SCHEDULED,
            scheduledAt: invoice.dueDate
              ? new Date(invoice.dueDate.getTime() - 3 * 24 * 60 * 60 * 1000)
              : new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days before due date
            message: `Invoice #${invoice.invoiceNumber} due soon`,
          },
          {
            tenant,
            invoice,
            user: customer,
            channel: ReminderChannel.SMS,
            status: ReminderStatus.FAILED,
            scheduledAt: invoice.dueDate
              ? new Date(invoice.dueDate)
              : new Date(),
            message: `Payment for invoice #${invoice.invoiceNumber} is overdue`,
          },
        );
      });

      // Create and save all reminders
      await this.reminderRepository.save(
        this.reminderRepository.create(remindersToCreate),
      );

      this.logger.log(
        `Created ${remindersToCreate.length} reminders for tenant ${tenant.name}`,
      );
    }
  }
}
