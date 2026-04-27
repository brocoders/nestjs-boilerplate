import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { RequestContextService } from './request-context.service';
import { RegionsService } from '../regions/regions.service';
import { SettingsService } from '../settings/settings.service';
import { LocalesService } from '../locales/locales.service';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(
    private readonly ctx: RequestContextService,
    private readonly regions: RegionsService,
    private readonly settings: SettingsService,
    private readonly locales: LocalesService,
  ) {}

  async intercept(
    execCtx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const req = execCtx.switchToHttp().getRequest<Request>();

    const settings = await this.settings.get();
    const multiRegion = settings.multi_region_enabled;

    // Region resolution
    let regionCode = (req.header('X-Region') ?? '').toUpperCase();
    if (!multiRegion || !regionCode) {
      regionCode = settings.default_region_code;
    } else {
      // Validate region exists & is enabled; otherwise fall back to default
      const region = await this.regions.findByCode(regionCode);
      if (!region || !region.isEnabled) {
        regionCode = settings.default_region_code;
      }
    }

    // Locale resolution — independent of multi_region flag
    const acceptLang = (req.header('Accept-Language') ?? '')
      .split(',')[0]
      .trim()
      .slice(0, 8)
      .toLowerCase();
    let localeCode = settings.default_locale_code;
    if (acceptLang) {
      const locale = await this.locales.findByCode(acceptLang);
      if (locale && locale.isEnabled) localeCode = locale.code;
    }

    return new Observable((subscriber) => {
      this.ctx.run({ regionCode, localeCode }, () => {
        next.handle().subscribe({
          next: (v) => subscriber.next(v),
          error: (e) => subscriber.error(e),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
