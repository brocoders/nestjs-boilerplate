import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteFileDto {
  @ApiProperty({
    example: 'my-bucket',
    description: 'Name of the bucket containing the file',
  })
  @IsString()
  bucketName: string;

  @ApiProperty({
    example: 'my-file.txt',
    description: 'Name of the file to delete',
  })
  @IsString()
  filename: string;
}
