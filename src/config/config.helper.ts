// src/config/helpers/create-toggleable-config.ts
import validateConfig from 'src/utils/validate-config';
import { registerAs, ConfigObject } from '@nestjs/config';
import { ClassConstructor } from 'class-transformer';

export function createToggleableConfig<T extends ConfigObject>(
  namespace: string,
  validator: ClassConstructor<any>,
  defaults: T,
  enableKey: keyof T,
  enableEnvKey: string,
) {
  return registerAs<T>(namespace, () => {
    const enableEnvValue = (process.env[enableEnvKey] ?? '').toLowerCase();
    const isEnabled = enableEnvValue === 'true';

    if (!isEnabled) {
      return {
        ...defaults,
        [enableKey]: false,
      };
    }

    validateConfig(process.env, validator);

    return {
      ...defaults,
      ...loadEnvOverrides(defaults),
      [enableKey]: true,
    };
  });
}

// Optional: helper to load overrides dynamically
function loadEnvOverrides<T>(defaults: T): Partial<T> {
  const overrides: Partial<T> = {};
  for (const key of Object.keys(defaults as object)) {
    const envKey = key.toUpperCase();
    if (process.env[envKey] !== undefined) {
      const value = process.env[envKey];
      overrides[key as keyof T] = parseEnvValue(
        defaults[key as keyof T],
        value,
      ) as unknown as T[keyof T];
    }
  }
  return overrides;
}

// Small type converter
function parseEnvValue(originalValue: any, envValue: string) {
  if (typeof originalValue === 'boolean') {
    return envValue.toLowerCase() === 'true';
  }
  if (typeof originalValue === 'number') {
    return parseInt(envValue, 10);
  }
  return envValue;
}

// Helper: parse a string into a boolean
export function parseBool(
  value: string | undefined,
  defaultValue = false,
): boolean {
  if (!value) return defaultValue;
  switch (value.toLowerCase().trim()) {
    case 'true':
    case '1':
    case 'yes':
    case 'y':
      return true;
    case 'false':
    case '0':
    case 'no':
    case 'n':
      return false;
    default:
      return defaultValue;
  }
}
