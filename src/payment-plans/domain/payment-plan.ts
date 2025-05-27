import { ApiProperty } from '@nestjs/swagger';

export class PaymentPlan {
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
    type: () => String,
    nullable: true,
  })
  rateStructure?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  type?: string | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
