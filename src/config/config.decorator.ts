import { Logger } from '@nestjs/common';

const logger = new Logger('ConfigService');

/**
 * Converts camelCase keys to SNAKE_CASE.
 * Example: apiKeyAdmin -> API_KEY_ADMIN
 */
function camelToSnakeCase(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

/**
 * Decorator to fetch and validate configuration values using ConfigService.
 * Logs errors for missing configurations and exits the application on failure.
 *
 * @param key - Configuration key to fetch.
 * @param options - Additional options for the decorator.
 * @param options.inferEnvVar - If true, infers the environment variable name by converting the key to SNAKE_CASE.
 * @param options.envVarName - Explicit environment variable name to use.
 * @returns PropertyDecorator
 */
export function ConfigGetOrThrow(
  key: string,
  options?: { inferEnvVar?: boolean; envVarName?: string },
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Object.defineProperty(target, propertyKey, {
      get() {
        // Ensure the `configService` is available on the class instance
        const configService = (this as any).configService;

        if (!configService) {
          const errorMessage = `ConfigService is not initialized. Ensure the service is properly injected and extends ConfigurableService.`;
          logger.error(errorMessage);
          process.exit(1); // Stop the app with an error code
        }

        // Determine the environment variable name
        const envVarName =
          options?.envVarName ??
          (options?.inferEnvVar ? camelToSnakeCase(key) : key);

        // Fetch the configuration value
        const value = configService.get(key, { infer: true });

        if (value === undefined || value === null) {
          const errorMessage = `Configuration key "${key}" is missing or misconfigured. Expected environment variable: "${envVarName}". Ensure it is defined in the ".env" file.`;
          logger.error(errorMessage); // Log the error
          process.exit(1); // Stop the app with an error code
        }

        // Cache the fetched value for future use
        Object.defineProperty(this, propertyKey, { value, writable: false });
        return value;
      },
      configurable: true,
      enumerable: true,
    });
  };
}

/**
 * Decorator to fetch a configuration value using ConfigService.
 * Provides default values if the key is missing or logs an error for misconfiguration.
 *
 * @param key - Configuration key to fetch.
 * @param options - Additional options for the decorator.
 * @param options.inferEnvVar - If true, infers the environment variable name by converting the key to SNAKE_CASE.
 * @param options.envVarName - Explicit environment variable name to use.
 * @param options.defaultValue - Default value to return if the configuration key is missing.
 * @returns PropertyDecorator
 */
export function ConfigGet(
  key: string,
  options?: { inferEnvVar?: boolean; envVarName?: string; defaultValue?: any },
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Object.defineProperty(target, propertyKey, {
      get() {
        // Ensure the `configService` is available on the class instance
        const configService = (this as any).configService;

        if (!configService) {
          const errorMessage = `ConfigService is not initialized. Ensure the service is properly injected and extends ConfigurableService.`;
          logger.error(errorMessage);
          process.exit(1); // Stop the app with an error code
          return options?.defaultValue; // Return default value to avoid crashing
        }

        // Determine the environment variable name
        const envVarName =
          options?.envVarName ??
          (options?.inferEnvVar ? camelToSnakeCase(key) : key);

        // Fetch the configuration value
        const value = configService.get(key, { infer: true });

        if (value === undefined || value === null) {
          logger.warn(
            `Configuration key "${key}" is missing or misconfigured. Expected environment variable: "${envVarName}". Using default value: ${options?.defaultValue}`,
          );
          return options?.defaultValue; // Return the default value
        }

        // Cache the fetched value for future use
        Object.defineProperty(this, propertyKey, { value, writable: false });
        return value;
      },
      configurable: true,
      enumerable: true,
    });
  };
}
