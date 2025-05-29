import { Tenant } from '../../tenants/domain/tenant';
import { Region } from '../../regions/domain/region';
import { User } from '../../users/domain/user';
import { PaymentPlan } from '../../payment-plans/domain/payment-plan';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountTypeEnum } from '../../utils/enum/account-type.enum';

export class Discount {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  minVolume?: number | null;

  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => Region,
    nullable: true,
  })
  region?: Region | null;

  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  customer?: User | null;

  @ApiProperty({
    type: () => PaymentPlan,
    nullable: true,
  })
  plan?: PaymentPlan | null;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  isActive: boolean;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  validTo: Date;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  validFrom: Date;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  value: number;

  @ApiProperty({
    enum: DiscountTypeEnum,
    enumName: 'DiscountType',
    nullable: false,
  })
  type: DiscountTypeEnum;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
