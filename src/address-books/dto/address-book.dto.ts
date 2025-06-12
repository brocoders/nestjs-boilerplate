import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddressBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
