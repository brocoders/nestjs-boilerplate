import { VendorBill } from '../../vendor-bills/domain/vendor-bill';
import { ApiProperty } from '@nestjs/swagger';

export class Vendor {
  @ApiProperty({
    type: () => [VendorBill],
    nullable: true,
  })
  bills?: VendorBill[] | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  paymentTerms?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  contactEmail?: string | null;

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
