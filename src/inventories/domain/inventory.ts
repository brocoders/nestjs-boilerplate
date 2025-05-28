import { Tenant } from '../../tenants/domain/tenant';
import { ApiProperty } from '@nestjs/swagger';

export class Inventory {
  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  unitOfMeasure?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  materialType?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  accountType: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  salePrice?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  purchasePrice: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  quantity: number;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  itemDescription?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  itemName?: string | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
