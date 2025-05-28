import { AccountsPayable } from '../../accounts-payables/domain/accounts-payable';
import { Vendor } from '../../vendors/domain/vendor';
import { ApiProperty } from '@nestjs/swagger';

export class VendorBill {
  @ApiProperty({
    type: () => AccountsPayable,
    nullable: true,
  })
  accountsPayable?: AccountsPayable | null;

  @ApiProperty({
    type: () => Vendor,
    nullable: false,
  })
  vendor: Vendor;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
