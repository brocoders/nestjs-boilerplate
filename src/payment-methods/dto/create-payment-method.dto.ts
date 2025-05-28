import {
  // decorators here

  IsString,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { PaymentMethodConfig } from '../infrastructure/persistence/relational/entities/payment-method.entity';

export class CreatePaymentMethodDto {
  @ApiProperty({
    required: false,
    type: () => Object,
    nullable: true,
  })
  @IsOptional()
  config?: PaymentMethodConfig | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  processorType: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
