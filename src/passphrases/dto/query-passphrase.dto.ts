import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Passphrase } from '../domain/passphrase';
import { getEnumErrorMessage } from '../../utils/helpers/enum.helper';
import { PassphraseLocation } from '../types/passphrases.enum';
import { OrderType } from '../../utils/types/order-type';

export class FilterPassphraseDto {
  @ApiPropertyOptional({
    type: String,
    required: true,
    enum: PassphraseLocation,
    description: 'The location of the passphrase',
  })
  @IsEnum(PassphraseLocation, {
    message: getEnumErrorMessage(PassphraseLocation, 'Location'),
  })
  @IsOptional()
  location?: PassphraseLocation;
}

export class SortPassphraseDto {
  @ApiPropertyOptional({
    description: 'The field to sort by. Example: "location", "createdAt", etc.',
    enum: Object.keys(new Passphrase()),
  })
  @IsOptional()
  @IsString()
  orderBy: keyof Passphrase;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: OrderType,
    example: OrderType.ASC,
  })
  @IsOptional()
  @IsEnum(OrderType, {
    message: 'order must be either ASC or DESC',
  })
  order: string;
}

export class QueryPassphraseDto {
  @ApiPropertyOptional({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    type: String,
    description:
      'JSON string for filter options. Example: {"location": "iCloud"}',
    example: '{"location": "iCloud"}',
  })
  @Transform(({ value }) => (value ? JSON.parse(value) : undefined))
  @ValidateNested()
  @Type(() => FilterPassphraseDto)
  filters?: FilterPassphraseDto;

  @ApiPropertyOptional({
    type: String,
    description:
      'JSON string array for sort options. Example: [{"orderBy": "location", "order": "ASC"}]',
    example: '[{"orderBy": "location", "order": "ASC"}]',
  })
  @Transform(({ value }) => (value ? JSON.parse(value) : undefined))
  @ValidateNested({ each: true })
  @Type(() => SortPassphraseDto)
  sort?: SortPassphraseDto[];
}
