import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';

export class BaseCreateWalletDto {
  @ApiPropertyOptional({
    description: 'Whether the wallet is active',
    type: Boolean,
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean = false;

  @ApiPropertyOptional({
    description: 'Label for the wallet',
    type: String,
    example: 'Fireblocks Vault A',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  label?: string | null;

  @ApiProperty({
    description: 'Wallet provider name',
    type: String,
    example: 'fireblocks',
  })
  @IsString()
  @MaxLength(100)
  provider: string;

  @ApiProperty({
    description: 'Lockup ID associated with this wallet',
    type: String,
    format: 'uuid',
    example: 'f7c3bc1d-404f-4b7a-9c34-b517e35ad9d5',
  })
  @IsUUID()
  lockupId: string;
}

export class CreateWalletUserDto extends BaseCreateWalletDto {}

export class CreateWalletDto extends BaseCreateWalletDto {
  @ApiProperty({
    description: 'User who owns this wallet',
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;
}
