import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DownloadFileDto {
  @ApiProperty({
    example: 'my-bucket',
    description: 'Name of the bucket containing the file',
  })
  @IsString()
  bucketName: string;

  @ApiProperty({
    example: 'example.txt',
    description: 'Name of the file to download',
  })
  @IsString()
  filename: string;
}
