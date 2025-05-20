import { ServiceUnavailableException, Logger } from '@nestjs/common';

/**
 * Base class for services that can be toggled enabled/disabled.
 */
export abstract class BaseToggleableService {
  protected readonly logger: Logger;
  protected readonly isEnabled: boolean;

  constructor(serviceName: string, isEnabled: boolean) {
    this.logger = new Logger(serviceName);
    this.isEnabled = isEnabled;

    this.logEnabledStatus();
  }

  /**
   * Deprecated: Use checkIfEnabled() instead.
   */
  protected throwIfDisabled(): void {
    // Deprecated: Use checkIfEnabled() instead.
    if (!this.isEnabled) {
      throw new ServiceUnavailableException('Service is disabled internally.');
    }
  }

  /**
   * Checks if the service is enabled; if not, logs and throws an error.
   */
  protected checkIfEnabled(): void {
    if (!this.isEnabled) {
      this.logger.warn('Operation attempted but service is DISABLED.');
      throw new ServiceUnavailableException('Service is disabled.');
    }
  }

  /**
   * Logs whether the service is enabled or disabled.
   */
  protected logEnabledStatus(): void {
    if (this.isEnabled) {
      this.logger.log('Service is ENABLED.');
    } else {
      this.logger.warn('Service is DISABLED.');
    }
  }
}
