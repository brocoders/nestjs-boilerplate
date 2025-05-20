import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    example: 'my-bucket',
    description: 'Name of the bucket to upload the file to',
  })
  @IsString()
  bucketName: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  file?: any;
}
