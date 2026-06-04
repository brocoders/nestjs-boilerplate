import {
  // decorators here
  Transform,
} from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  // decorators here
  IsEmail,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { RoleEnum } from '../../auth/roles.enum';
import { lowerCaseTransformer } from '../../common/utils/transformers/lower-case.transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John', type: String })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe', type: String })
  @IsNotEmpty()
  lastName: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum | null;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;
}
