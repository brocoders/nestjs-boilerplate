import { SetMetadata } from '@nestjs/common';

/**
 * ResponseModel Decorator
 * -------------------------------------------------------------
 * Attaches metadata identifying which external provider or API
 * response model a controller (or specific route handler) belongs to.
 * This allows global interceptors such as StandardResponseInterceptor
 * to automatically apply the correct ProviderResponseAdapter for
 * normalization and formatting.
 *
 * @param key The unique provider or response model name
 *             (e.g., 'CMC', 'BINANCE', 'GORUSH', etc.)
 *
 * Usage:
 *   // Apply at the controller level (default for all routes)
 *   @ResponseModel('CMC')
 *   @Controller('api/v1/cmc')
 *   export class CmcController {}
 *
 *   // Apply per-route (overrides controller-level setting)
 *   @ResponseModel('BINANCE')
 *   @Get('ticker')
 *   getTicker() { ... }
 *
 * The metadata key used internally is 'response:providerName'.
 */
export const PROVIDER_NAME = 'response:providerName';
export const ResponseModel = (key: string) => SetMetadata(PROVIDER_NAME, key);
