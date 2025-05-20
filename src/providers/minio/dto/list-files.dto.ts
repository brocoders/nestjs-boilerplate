import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ListFilesDto {
  @ApiProperty({
    example: 'my-bucket',
    description: 'Name of the bucket to list files from',
  })
  @IsString()
  bucketName: string;
}
