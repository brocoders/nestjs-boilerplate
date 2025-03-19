import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { LanguageEnum } from '../../i18n/language.enum';

export class AuthForgotPasswordDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Preferred language for email',
    enum: LanguageEnum,
    example: LanguageEnum.English,
  })
  @IsOptional()
  @IsEnum(LanguageEnum)
  language?: LanguageEnum;
}
