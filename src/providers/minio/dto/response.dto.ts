import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({ example: 'File uploaded successfully' })
  message: string;

  @ApiProperty({ example: 'example.txt' })
  fileName: string;
}

export class DeleteFileResponseDto {
  @ApiProperty({ example: 'File deleted successfully' })
  message: string;
}

export class ListFilesResponseDto {
  @ApiProperty({
    example: ['file1.txt', 'file2.txt'],
    type: [String],
  })
  files: string[];
}

export class ListBucketsResponseDto {
  @ApiProperty({
    example: ['bucket1', 'bucket2'],
    type: [String],
  })
  buckets: string[];
}
