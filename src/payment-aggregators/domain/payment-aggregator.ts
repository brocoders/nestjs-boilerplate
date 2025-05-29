import { Tenant } from '../../tenants/domain/tenant';
import { PaymentNotification } from '../../payment-notifications/domain/payment-notification';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentConfig } from '../infrastructure/persistence/relational/entities/payment-aggregator.entity';

export class PaymentAggregator {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  logo?: string | null;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  isActive: boolean;

  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    required: false,
    type: Object,
    description: 'Payment configuration object',
    example: {
      webhookUrl: 'https://api.example.com/webhook',
      authToken: 'secure_token_123',
      reconciliationWindow: 30,
    },
  })
  config?: PaymentConfig | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  name?: string | null;

  @ApiProperty({
    type: () => [PaymentNotification],
    nullable: true,
  })
  notifications?: PaymentNotification[] | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
