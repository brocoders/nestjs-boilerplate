import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { AddressDto } from './address.dto';

export class QuoteDto {
  @ApiProperty({ type: () => AddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
}
