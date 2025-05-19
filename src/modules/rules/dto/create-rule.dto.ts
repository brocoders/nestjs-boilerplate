import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Max, Min } from 'class-validator';
import { IsValidRegex } from '../validator.is-valid-regex';

export class CreateRuleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsValidRegex({
    message: 'pattern must be a valid and safe regular expression',
  })
  pattern?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  similarityThreshold?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  deviationAllowedPct?: number;

  constructor(partial: Partial<CreateRuleDto>) {
    Object.assign(this, partial);
  }

  @IsValidRegex({
    message: 'similarityThreshold and deviationAllowedPct cannot both be set',
    each: false,
  })
  areMutuallyExclusive() {
    return !(
      this.similarityThreshold !== undefined &&
      this.deviationAllowedPct !== undefined
    );
  }
}
