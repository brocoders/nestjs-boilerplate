// src/providers/cmc/config/cmc-config.ts
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { CmcConfig } from './cmc-config.type';
import { createToggleableConfig } from '../../../config/config.helper';
import {
  CMC_DEFAULT_FIAT_CURRENCY,
  CMC_DEFAULT_SYMBOLS,
  CMC_ENABLE,
  CMC_MAX_RETRIES,
  CMC_REQUEST_TIMEOUT_MS,
  CMC_TTL_MS,
} from '../types/cmc-const.type';

class CmcEnvValidator {
  @IsString()
  CMC_API_KEY: string;

  @IsString()
  CMC_BASE_URL: string;

  @IsNumber()
  @IsOptional()
  CMC_TIMEOUT?: number;

  @IsBoolean()
  @IsOptional()
  CMC_ENABLE?: boolean;

  @IsNumber()
  @IsOptional()
  CMC_TTL_MS?: number;

  @IsNumber()
  @IsOptional()
  CMC_REQUEST_TIMEOUT_MS?: number;

  @IsNumber()
  @IsOptional()
  CMC_MAX_RETRIES?: number;

  @IsString()
  @IsOptional()
  CMC_DEFAULT_FIAT_CURRENCY?: string;

  @IsArray()
  @IsOptional()
  CMC_DEFAULT_SYMBOLS?: string[];
}

export default createToggleableConfig<CmcConfig>(
  'cmc',
  CmcEnvValidator,
  {
    apiKey: '',
    baseUrl: '',
    enable: CMC_ENABLE,
    ttlMs: typeof CMC_TTL_MS !== 'undefined' ? CMC_TTL_MS : 60000,
    requestTimeoutMs:
      typeof CMC_REQUEST_TIMEOUT_MS !== 'undefined'
        ? CMC_REQUEST_TIMEOUT_MS
        : 10000,
    maxRetries: typeof CMC_MAX_RETRIES !== 'undefined' ? CMC_MAX_RETRIES : 3,
    defaultFiatCurrency:
      typeof CMC_DEFAULT_FIAT_CURRENCY !== 'undefined'
        ? CMC_DEFAULT_FIAT_CURRENCY
        : 'USD',
    defaultSymbols:
      typeof CMC_DEFAULT_SYMBOLS !== 'undefined' ? CMC_DEFAULT_SYMBOLS : '',
  },
  'enable',
  'CMC_ENABLE',
);
