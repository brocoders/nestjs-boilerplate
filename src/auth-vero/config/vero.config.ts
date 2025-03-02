import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { VeroConfig } from './vero-config.type';
import {
  BASE_VALUE_JWKS_URL,
  DEFAULT_JWKS_CACHE_MAX_AGE,
} from '../types/vero-const.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  VERO_JWKS_URL: string;

  @IsInt()
  @Min(900000) // Minimum cache age of 5 minutes
  @Max(1800000) // Maximum cache age of 30 minutes
  @IsOptional()
  VERO_CACHE_MAX_AGE: number;

  @IsBoolean()
  @IsOptional()
  VERO_ENABLE_DYNAMIC_CACHE: boolean;
}

export default registerAs<VeroConfig>('vero', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  const jwksUri = process.env.VERO_JWKS_URL
    ? process.env.VERO_JWKS_URL
    : BASE_VALUE_JWKS_URL;

  const jwksUriCacheMaxAge = process.env.VERO_CACHE_MAX_AGE
    ? Number(process.env.VERO_CACHE_MAX_AGE)
    : DEFAULT_JWKS_CACHE_MAX_AGE;

  const enableDynamicCache = process.env.VERO_ENABLE_DYNAMIC_CACHE === 'true';

  return {
    jwksUri,
    jwksUriCacheMaxAge,
    enableDynamicCache,
  };
});
