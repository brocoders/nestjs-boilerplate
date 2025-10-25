import { BaseToggleableService } from './base-toggleable.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

/**
 * BaseGatewayService
 * ------------------
 * Single-inheritance friendly base that *combines*:
 *  - Toggleable behavior (extends BaseToggleableService)
 *  - Typed access to Nest ConfigService (via `configService` property)
 *
 * NOTE: TypeScript/JavaScript do not support extending two classes at once.
 * This base class extends `BaseToggleableService` and *composes* a typed
 * `ConfigService` so callers still have both capabilities in one class.
 */
@Injectable()
export abstract class BaseGatewayService<
  T = AllConfigType,
> extends BaseToggleableService {
  protected readonly configService: ConfigService<T>;

  constructor(
    serviceName: string,
    isEnabled: boolean,
    configService: ConfigService<T>,
  ) {
    super(serviceName, isEnabled);
    if (configService) this.configService = configService;
  }
}
