import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  PaymentStatus,
  PaymentMethod,
  Currency,
  PaymentProvider,
} from '../../../../utils/enum/payment-notification.enums';
import { PaymentAggregatorEntity } from '../../../../payment-aggregators/infrastructure/persistence/relational/entities/payment-aggregator.entity';
import { PaymentNotificationEntity } from '../../../../payment-notifications/infrastructure/persistence/relational/entities/payment-notification.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Injectable()
export class PaymentNotificationSeedService {
  private readonly logger = new Logger(PaymentNotificationSeedService.name);

  constructor(
    @InjectRepository(PaymentNotificationEntity)
    private readonly notificationRepo: Repository<PaymentNotificationEntity>,

    @InjectRepository(TenantEntity)
    private readonly tenantRepo: Repository<TenantEntity>,

    @InjectRepository(PaymentAggregatorEntity)
    private readonly aggregatorRepo: Repository<PaymentAggregatorEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepo.find();
    const aggregators = await this.aggregatorRepo.find();

    if (!tenants.length) {
      this.logger.error('No tenants found. Aborting seeding.');
      return;
    }

    if (!aggregators.length) {
      this.logger.warn(
        'No aggregators found. Notifications will not be linked to aggregators.',
      );
    }

    const notifications = this.createSampleNotifications(
      tenants,
      aggregators,
      10,
    );

    try {
      await this.notificationRepo.save(notifications);
      this.logger.log(
        `Successfully seeded ${notifications.length} payment notifications`,
      );
    } catch (error) {
      this.logger.error('Failed to seed payment notifications:', error.message);
    }
  }

  private createSampleNotifications(
    tenants: TenantEntity[],
    aggregators: PaymentAggregatorEntity[],
    count: number,
  ): PaymentNotificationEntity[] {
    const now = new Date();
    const baseTxnId = 'TXN-';

    const samples: PaymentNotificationEntity[] = [];

    for (let i = 1; i <= count; i++) {
      const tenant = tenants[i % tenants.length]; // Distribute across tenants
      const aggregator = aggregators.length
        ? aggregators[i % aggregators.length]
        : null;

      const entity = this.notificationRepo.create({
        tenant: tenant,
        ...(aggregator ? { aggregator } : {}),
        processed: i % 2 === 0,
        processed_at:
          i % 2 === 0 ? new Date(now.getTime() - 1000 * 60 * 30) : null,
        raw_payload: {
          event: 'payment_received',
          metadata: {
            ref: `${baseTxnId}${i}`,
            user: `user_${i}`,
          },
        },
        status: i % 3 === 0 ? PaymentStatus.FAILED : PaymentStatus.COMPLETED,
        received_at: new Date(now.getTime() - 1000 * 60 * i),
        payment_method: PaymentMethod.MOBILE_MONEY,
        currency: Currency.KES,
        amount: 1000 + i * 50,
        external_txn_id: `${baseTxnId}${i}`,
        provider: PaymentProvider.MPESA,
      });

      samples.push(entity);
    }

    return samples;
  }
}
