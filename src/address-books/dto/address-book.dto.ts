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
export class AddressBookDto {
  @ApiProperty({
    description: 'Unique identifier of the address book entry',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Blockchain address',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @IsString()
  @Expose()
  address: string;

  @ApiProperty({
    description: 'Label for the address book entry',
    example: 'My Main Wallet',
  })
  @IsString()
  @Expose()
  label: string;

  @ApiProperty({
    description: 'Blockchain type (e.g., Ethereum)',
    example: 'Ethereum',
  })
  @IsString()
  @Expose()
  blockchain: string;

  @ApiProperty({
    description: 'Asset type (e.g., token, NFT)',
    example: 'token',
  })
  @IsString()
  @Expose()
  assetType: string;

  @ApiPropertyOptional({
    description: 'Optional tag associated with the address',
    example: 'withdrawal',
  })
  @IsOptional()
  @IsString()
  @Expose(RoleGroups([RoleEnum.user, RoleEnum.admin]))
  tag?: string | null;

  @ApiPropertyOptional({
    description: 'Optional memo used in certain chains (e.g., XRP)',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  @Expose(RoleGroups([RoleEnum.user, RoleEnum.admin]))
  memo?: string | null;

  @ApiPropertyOptional({
    description: 'Optional user notes',
    example: 'This is my main hot wallet',
  })
  @IsOptional()
  @IsString()
  @Expose(RoleGroups([RoleEnum.user, RoleEnum.admin]))
  notes?: string | null;

  @ApiPropertyOptional({
    description: 'Whether this address is marked as a favorite',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose(RoleGroups([RoleEnum.user, RoleEnum.admin]))
  isFavorite?: boolean | null;

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
