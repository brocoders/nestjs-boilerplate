import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../../../domain/file';

export class FileResponseDto {
  @ApiProperty({
    type: () => FileType,
  })
  file: FileType;

  @ApiProperty({
    type: String,
  })
  uploadSignedUrl: string;
}
