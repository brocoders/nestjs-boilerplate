import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ example: 'image.jpg' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 138723 })
  @IsNumber()
  fileSize: number;
}
