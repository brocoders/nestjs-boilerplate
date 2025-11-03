import { IsString, IsArray, MaxLength } from 'class-validator';

export class CreatePricingDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(255)
  price: string;

  @IsArray()
  @IsString({ each: true })
  features: string[];
}
