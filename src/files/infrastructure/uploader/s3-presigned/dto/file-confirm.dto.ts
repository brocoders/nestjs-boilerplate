import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class FileConfirmUploadDto {
  @ApiProperty({ example: 'abc123.jpg' })
  @IsString()
  @IsNotEmpty()
  key!: string;
}
