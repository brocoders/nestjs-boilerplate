import { ApiResponseProperty } from '@nestjs/swagger';
import { FileType } from '../../../../domain/file';

export class FileResponseDto {
  @ApiResponseProperty({
    type: () => FileType,
  })
  file: FileType;

  @ApiResponseProperty({
    type: String,
  })
  uploadSignedUrl: string;
}
