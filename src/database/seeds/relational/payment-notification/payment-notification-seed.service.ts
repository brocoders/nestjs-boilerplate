import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentNotificationEntity } from '../../../../payment-notifications/infrastructure/persistence/relational/entities/payment-notification.entity';
import {
  PaymentStatus,
  PaymentMethod,
  Currency,
  PaymentProvider,
} from '../../../../utils/enum/payment-notification.enums';

@Injectable()
export class PaymentNotificationSeedService {
  private readonly logger = new Logger(PaymentNotificationSeedService.name);

  constructor(
    @InjectRepository(PaymentNotificationEntity)
    private repository: Repository<PaymentNotificationEntity>,
  ) {}

  async run() {
    const notifications = this.createSampleNotifications(10); // Create 10 seed entries

    try {
      await this.repository.save(notifications);
      this.logger.log(
        `Successfully seeded ${notifications.length} payment notifications`,
      );
    } catch (error) {
      this.logger.error('Failed to seed payment notifications:', error.message);
    }
  }

  private createSampleNotifications(
    count: number,
  ): PaymentNotificationEntity[] {
    const now = new Date();
    const baseTxnId = 'TXN-';

    const samples: PaymentNotificationEntity[] = [];

    for (let i = 1; i <= count; i++) {
      const entity = this.repository.create({
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
