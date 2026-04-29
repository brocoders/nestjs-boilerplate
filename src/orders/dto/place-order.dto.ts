import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsObject, ValidateNested } from 'class-validator';
import { OrderPaymentMethod } from '../domain/order-enums';
import { AddressDto } from './address.dto';

export class PlaceOrderDto {
  @ApiProperty({ type: () => AddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @ApiProperty({ enum: OrderPaymentMethod, example: OrderPaymentMethod.COD })
  @IsEnum(OrderPaymentMethod)
  paymentMethod!: OrderPaymentMethod;
}
