import { Tenant } from '../../tenants/domain/tenant';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodConfig } from '../infrastructure/persistence/relational/entities/payment-method.entity';
import { IsOptional } from 'class-validator';

export class PaymentMethod {
  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    required: false,
    type: () => Object,
    nullable: true,
  })
  @IsOptional()
  config?: PaymentMethodConfig | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  processorType: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
