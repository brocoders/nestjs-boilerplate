import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../domain/file';
import { IsString } from 'class-validator';

export class FileDto implements FileType {
  @ApiProperty()
  @IsString()
  id: string;

  path: string;
}
