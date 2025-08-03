import { ApiProperty } from '@nestjs/swagger';

export class FireblocksCwWallet {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  assets?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  metadata?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  vaultType?: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  autoFuel?: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  hiddenOnUI?: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  referenceId: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
