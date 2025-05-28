import { Tenant } from '../../tenants/domain/tenant';
import { ApiProperty } from '@nestjs/swagger';
import {
  PlanType,
  RateStructure,
} from '../infrastructure/persistence/relational/entities/payment-plan.entity';

export class PaymentPlan {
  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  isActive: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  unit: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  minimumCharge: number;

  @ApiProperty({
    type: Object,
    oneOf: [
      { properties: { type: { enum: ['FLAT'] }, amount: { type: 'number' } } },
      {
        properties: { type: { enum: ['PER_UNIT'] }, rate: { type: 'number' } },
      },
      {
        properties: {
          type: { enum: ['CREDIT_RATE'] },
          rate: { type: 'number' },
        },
      },
      {
        properties: {
          type: { enum: ['TIERED'] },
          tiers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                from: { type: 'number' },
                to: { type: 'number' },
                rate: { type: 'number' },
              },
              required: ['from', 'to', 'rate'],
            },
          },
        },
      },
      {
        properties: {
          type: { enum: ['PREPAID'] },
          creditRate: { type: 'number' },
        },
      },
    ],
    nullable: true,
  })
  rateStructure?: RateStructure | null;

  @ApiProperty({
    enum: PlanType,
    nullable: false,
  })
  type: PlanType;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
