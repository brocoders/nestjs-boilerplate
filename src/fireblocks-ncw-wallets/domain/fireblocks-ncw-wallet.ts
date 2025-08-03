import { ApiProperty } from '@nestjs/swagger';

export class FireblocksNcwWallet {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
