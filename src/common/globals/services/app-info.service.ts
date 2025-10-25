import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config/app-config.type';
import { NodeEnv } from '../../../utils/types/gobal.type';

@Injectable()
export class AppInfoService {
  constructor(private readonly config: ConfigService) {}

  /** Preferred in Nest land: typed read via ConfigService; falls back to global APP. */
  getAll(): AppConfig {
    const cfg = this.config.get<AppConfig>('app');
    return cfg ?? APP;
  }

  get name(): string {
    return this.getAll().name;
  }
  get version(): string {
    return this.getAll().version;
  }
  get env(): string {
    return this.getAll().nodeEnv;
  }
  get port(): number {
    return this.getAll().port;
  }
  get apiPrefix(): string {
    return this.getAll().apiPrefix;
  }
  get isProduction(): boolean {
    return this.getAll().nodeEnv === NodeEnv.PRODUCTION;
  }
  // Add more getters only if you want sugar accessors; otherwise use getAll().
}
