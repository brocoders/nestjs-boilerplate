import { ApiProperty } from '@nestjs/swagger';

export class Locale {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: 'ar' })
  code!: string;

  @ApiProperty({ example: 'العربية' })
  nativeName!: string;

  @ApiProperty({ example: true })
  isRtl!: boolean;

  @ApiProperty({ example: true })
  isEnabled!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
