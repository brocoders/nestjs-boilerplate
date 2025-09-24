// src/providers/cmc/config/cmc-config.ts
import { registerAs } from '@nestjs/config';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import validateConfig from '../../../utils/validate-config';
import { CmcConfig } from './cmc-config.type';
import {
  CMC_DEFAULT_FIAT_CURRENCY,
  CMC_DEFAULT_SYMBOLS,
  CMC_ENABLE,
  CMC_ENV_TYPE,
  CMC_MAX_RETRIES,
  CMC_REQUEST_TIMEOUT_MS,
  CMC_TTL_MS,
} from '../types/cmc-const.type';
import { CmcEnvironmenType } from '../types/cmc-enum.type';
import { parseBool } from '../../../config/config.helper';
import { mapEnvType } from '../../../utils/helpers/env.helper';

class EnvironmentVariablesValidator {
  @IsString()
  CMC_API_KEY: string;

  @IsString()
  @IsOptional()
  CMC_ENV_TYPE?: string;

  @IsBoolean()
  @IsOptional()
  CMC_ENABLE?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  CMC_TTL_MS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  CMC_REQUEST_TIMEOUT_MS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  CMC_MAX_RETRIES?: number;

  @IsString()
  @IsOptional()
  CMC_DEFAULT_FIAT_CURRENCY?: string;

  /** Comma-separated list of default symbols (e.g., "BTC,ETH,SOL") */
  @IsString()
  @IsOptional()
  CMC_DEFAULT_SYMBOLS?: string;
}

export default registerAs<CmcConfig>('cmc', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  const apiKey = process.env.CMC_API_KEY as string; // validated as non-empty

  // Normalize enable flag from string envs ("true"/"false", "1"/"0", etc.) with const fallback
  const enable = parseBool(process.env.CMC_ENABLE, CMC_ENABLE);

  // Normalize numeric values with safe fallbacks
  const ttlMs = process.env.CMC_TTL_MS
    ? parseInt(process.env.CMC_TTL_MS, 10)
    : CMC_TTL_MS;
  const requestTimeoutMs = process.env.CMC_REQUEST_TIMEOUT_MS
    ? parseInt(process.env.CMC_REQUEST_TIMEOUT_MS, 10)
    : CMC_REQUEST_TIMEOUT_MS;
  const maxRetries = process.env.CMC_MAX_RETRIES
    ? parseInt(process.env.CMC_MAX_RETRIES, 10)
    : CMC_MAX_RETRIES;

  // Map env type to enum

  const envType = mapEnvType<CmcEnvironmenType>(
    process.env.CMC_ENV_TYPE,
    {
      prod: CmcEnvironmenType.PRODUCTION,
      production: CmcEnvironmenType.PRODUCTION,
      sandbox: CmcEnvironmenType.SANDBOX,
      dev: CmcEnvironmenType.SANDBOX,
      development: CmcEnvironmenType.SANDBOX,
    },
    CMC_ENV_TYPE,
  );

  // Normalize symbols: split, trim, uppercase, remove empties, join back
  const defaultSymbols = (() => {
    const raw = process.env.CMC_DEFAULT_SYMBOLS;
    if (raw && raw.length > 0) {
      return raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.toUpperCase())
        .join(',');
    }
    // Fallback to constant (string or string[])
    return Array.isArray(CMC_DEFAULT_SYMBOLS)
      ? CMC_DEFAULT_SYMBOLS.map((s) => String(s).toUpperCase()).join(',')
      : String(CMC_DEFAULT_SYMBOLS).toUpperCase();
  })();

  return {
    apiKey,
    envType,
    enable,
    ttlMs,
    requestTimeoutMs,
    maxRetries,
    defaultFiatCurrency:
      process.env.CMC_DEFAULT_FIAT_CURRENCY || CMC_DEFAULT_FIAT_CURRENCY,
    defaultSymbols,
  };
});
