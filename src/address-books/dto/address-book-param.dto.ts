import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumberString } from 'class-validator';

export class IdParamDto {
  @ApiProperty({ description: 'AddressBook ID (UUID)' })
  @IsUUID()
  id: string;
}

export class BaseUserIdParamDto {
  @ApiProperty({ description: 'User ID (numeric)' })
  @IsNumberString()
  userId: number;
}

export class UserIdParamDto extends BaseUserIdParamDto {}

export class UserIdLabelParamDto extends BaseUserIdParamDto {
  @ApiProperty({ description: 'Label of the address entry' })
  @IsString()
  label: string;
}

export class UserIdAssetTypeParamDto extends BaseUserIdParamDto {
  @ApiProperty({ description: 'Type of asset (e.g., token, NFT)' })
  @IsString()
  assetType: string;
}
