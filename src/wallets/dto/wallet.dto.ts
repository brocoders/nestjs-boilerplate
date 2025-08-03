import { Expose, Exclude, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum } from '../../roles/roles.enum';
import { UserDto } from '../../users/dto/user.dto';
import { RoleGroups } from '../../utils/transformers/enum.transformer';

@Exclude()
export class WalletDto {
  @ApiProperty({
    description: 'Unique identifier of the wallet',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Wallet provider',
    example: 'fireblocks',
  })
  @IsString()
  @Expose()
  provider: string;

  @ApiProperty({
    description: 'Lockup ID associated with the wallet',
    example: 'lockup-123456',
  })
  @IsString()
  @Expose()
  lockupId: string;

  @ApiPropertyOptional({
    description: 'Label for the wallet',
    example: 'Main cold wallet',
  })
  @IsOptional()
  @IsString()
  @Expose(RoleGroups([RoleEnum.user, RoleEnum.admin]))
  label?: string | null;

  @ApiPropertyOptional({
    description: 'Whether the wallet is currently active',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose(RoleGroups([RoleEnum.user, RoleEnum.admin]))
  active?: boolean | false;

  @ApiProperty({
    description: 'User object (visible to admin only)',
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @Expose(RoleGroups([RoleEnum.admin]))
  user: UserDto;

  @ApiProperty({
    description: 'Creation timestamp',
    format: 'date-time',
    example: '2025-07-14T18:20:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last updated timestamp',
    format: 'date-time',
    example: '2025-07-15T12:45:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @Expose()
  updatedAt: Date;
}
