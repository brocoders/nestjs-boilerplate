import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateQnADto {
  @ApiProperty({ description: 'User question' })
  @IsString()
  question: string;

  @ApiProperty({ description: 'AI answer' })
  @IsString()
  answer: string;

  @ApiProperty({ description: 'Whether the answer was accepted by the user', required: false })
  @IsBoolean()
  @IsOptional()
  isAccepted?: boolean;

  @ApiProperty({ description: 'Whether the answer was flagged as incorrect', required: false })
  @IsBoolean()
  @IsOptional()
  isFlagged?: boolean;

  @ApiProperty({ description: 'User feedback on the answer', required: false })
  @IsString()
  @IsOptional()
  feedback?: string;
} 