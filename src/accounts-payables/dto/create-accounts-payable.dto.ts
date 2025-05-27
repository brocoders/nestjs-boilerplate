import { AccountDto } from '../../accounts/dto/account.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';

export class CreateAccountsPayableDto {
  @ApiProperty({
    required: false,
    type: () => [AccountDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccountDto)
  @IsArray()
  account?: AccountDto[] | null;

  @ApiProperty({
    required: false,
    type: () => [UserDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsArray()
  owner?: UserDto[] | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  accountType?: string | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  salePrice?: number | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  purchasePrice?: number | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  itemDescription?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  itemName: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  transactionType: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
