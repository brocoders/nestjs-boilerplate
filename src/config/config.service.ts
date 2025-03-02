import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Base class for services requiring ConfigService with type support.
 */
@Injectable()
export abstract class ConfigurableService<T = Record<string, unknown>> {
  protected readonly configService: ConfigService<T>;

  protected constructor(configService?: ConfigService<T>) {
    if (configService) this.configService = configService;
  }
}
