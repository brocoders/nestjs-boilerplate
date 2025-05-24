import { registerAs } from '@nestjs/config';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsIn,
} from 'class-validator';
import validateConfig from '../utils/validate-config';
import { VoyageConfig } from './voyage-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  VOYAGE_API_KEY: string;

  @IsString()
  @IsOptional()
  VOYAGE_MODEL: string;

  @IsString()
  @IsOptional()
  @IsIn(['query', 'document'])
  VOYAGE_INPUT_TYPE: 'query' | 'document';

  @IsBoolean()
  @IsOptional()
  VOYAGE_TRUNCATION: boolean;

  @IsNumber()
  @IsOptional()
  VOYAGE_OUTPUT_DIMENSION: number;

  @IsString()
  @IsOptional()
  VOYAGE_OUTPUT_DTYPE: 'float' | 'int8';

  @IsString()
  @IsOptional()
  VOYAGE_ENCODING_FORMAT: 'base64' | 'ubinary';
}

export default registerAs<VoyageConfig>('voyage', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.VOYAGE_API_KEY,
    model: process.env.VOYAGE_MODEL,
    inputType: process.env.VOYAGE_INPUT_TYPE as
      | 'query'
      | 'document'
      | undefined,
    truncation: process.env.VOYAGE_TRUNCATION
      ? process.env.VOYAGE_TRUNCATION === 'true'
      : undefined,
    outputDimension: process.env.VOYAGE_OUTPUT_DIMENSION
      ? (() => {
          const parsed = parseInt(process.env.VOYAGE_OUTPUT_DIMENSION!, 10);
          return isNaN(parsed) ? undefined : parsed;
        })()
      : undefined,
    outputDtype: process.env.VOYAGE_OUTPUT_DTYPE as 'float' | 'int8',
    encodingFormat: process.env.VOYAGE_ENCODING_FORMAT as 'base64' | 'ubinary',
  };
});
