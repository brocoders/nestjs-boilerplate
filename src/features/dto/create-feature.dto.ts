import { IsString, MaxLength } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  description: string;
}
