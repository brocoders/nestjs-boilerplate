import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector, ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  ConfigMode,
  META_CONFIG_MODE,
  META_ENABLED_CONFIG_PATHS,
  META_SERVICE_TOKENS,
} from 'src/utils/decorators/service-toggleable.decorators';

@Injectable()
export class EnableGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Prefer method metadata, fall back to controller metadata
    const handler = context.getHandler();
    const cls = context.getClass();

    const configPaths: string[] =
      this.reflector.get(META_ENABLED_CONFIG_PATHS, handler) ??
      this.reflector.get(META_ENABLED_CONFIG_PATHS, cls) ??
      [];

    const configMode: ConfigMode =
      this.reflector.get(META_CONFIG_MODE, handler) ??
      this.reflector.get(META_CONFIG_MODE, cls) ??
      'all';

    const serviceTokens: any[] =
      this.reflector.get(META_SERVICE_TOKENS, handler) ??
      this.reflector.get(META_SERVICE_TOKENS, cls) ??
      [];

    // 1) If config paths are declared, verify them first
    if (configPaths.length > 0) {
      const flags = configPaths.map((p) =>
        Boolean(this.configService.get<boolean>(p as any, { infer: true })),
      );
      const ok =
        configMode === 'all' ? flags.every(Boolean) : flags.some(Boolean);

      if (!ok) {
        throw new ServiceUnavailableException(
          'Service is disabled by configuration.',
        );
      }
    }

    // 2) If service tokens are declared, resolve & ensure readiness
    for (const token of serviceTokens) {
      const svc = this.moduleRef.get(token, { strict: false });
      if (!svc) {
        throw new ServiceUnavailableException(
          'Required service is not available.',
        );
      }

      // Prefer ensureReady(), else checkIfEnabled(), else assume enabled
      if (typeof svc.ensureReady === 'function') {
        svc.ensureReady(); // should throw HTTP exception if not ready
      } else if (typeof svc.checkIfEnabled === 'function') {
        svc.checkIfEnabled(); // may throw
      }
    }

    // If nothing was declared, allow by default (no toggle requirement)
    return true;
  }
}
