import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

/**
 * A guard to protect controllers or routes based on service enable status.
 */
@Injectable()
export class ServiceEnabledGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const configPath = this.reflector.get<string>(
      'configPath',
      context.getHandler(),
    );

    if (!configPath) {
      throw new ServiceUnavailableException(
        'This service is currently unavailable.',
      );
    }

    const isEnabled = this.configService.get<boolean>(configPath, {
      infer: true,
    });

    if (!isEnabled) {
      throw new ServiceUnavailableException(
        'This service is currently disabled.',
      );
    }

    return true;
  }
}
