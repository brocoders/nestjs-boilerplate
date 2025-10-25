import { Injectable, Logger } from '@nestjs/common';
import { ProviderResponseAdapter } from '../interfaces/provider-response.interface';
import { mesageLog } from '../../../logger/utils/logger.helper';
import { LogLevel } from '../../../logger/types/logger-enum.type';

/**
 * Global registry of provider adapters.
 * The interceptor uses this to delegate normalization per provider.
 */
@Injectable()
export class ProviderResponseRegistry {
  private readonly map = new Map<string, ProviderResponseAdapter<any, any>>();
  private readonly logger = new Logger(ProviderResponseRegistry.name);

  /** Register/override an adapter for a provider key. */
  register(adapter: ProviderResponseAdapter<any, any>): void {
    this.map.set(adapter.provider, adapter);
    this.logger.debug(
      mesageLog(
        LogLevel.DEBUG,
        `Registered response adapter for provider: ${adapter.provider}`,
      ),
      this.constructor.name,
    );
  }

  /** Retrieve an adapter by provider key. */
  get(provider: string): ProviderResponseAdapter<any, any> | undefined {
    const adapter = this.map.get(provider);
    this.logger.debug(
      mesageLog(LogLevel.DEBUG, `Retrieved adapter for provider: ${provider}`),
      this.constructor.name,
    );
    return adapter;
  }

  /** Whether an adapter exists for the provider key. */
  has(provider: string): boolean {
    this.logger.debug(
      mesageLog(LogLevel.DEBUG, `Checked existence for provider: ${provider}`),
      this.constructor.name,
    );
    return this.map.has(provider);
  }

  /** Remove an adapter (useful for dynamic modules/tests). */
  unregister(provider: string): boolean {
    this.logger.debug(
      mesageLog(
        LogLevel.DEBUG,
        `Unregistered response adapter for provider: ${provider}`,
      ),
      this.constructor.name,
    );
    return this.map.delete(provider);
  }

  /** List registered provider keys (for diagnostics). */
  list(): string[] {
    this.logger.debug(
      mesageLog(
        LogLevel.DEBUG,
        `Listing all registered providers: ${Array.from(this.map.keys()).join(', ') || 'none'}`,
      ),
      this.constructor.name,
    );
    return Array.from(this.map.keys()).sort();
  }
}
