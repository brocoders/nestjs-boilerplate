import * as os from 'os';
import { formatDistanceToNow } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../common/logger/logger.service';
import nestPkg from '@nestjs/core/package.json';
import appPkg from '../../package.json';
import { AllConfigType } from '../config/config.type';
import { getHumanReadableOSName } from '../utils/helpers/os.helper';
import { LoggerAppPlugin } from '../common/logger/plugins/logger-appinfo.plugin';

type OsSnapshot = ReturnType<HomeService['computeOsSnapshot']>;
type HardwareSnapshot = ReturnType<HomeService['computeHardwareSnapshot']>;

@Injectable()
export class HomeService {
  private readonly _name: string;
  private readonly _version: string;
  private readonly _nodeEnv: string;
  private readonly _databaseType: string;
  private readonly _nodeVersion: string;
  private readonly _frameworkVersion: string;

  private readonly _sampleMs: number;
  private _osSnapshot: OsSnapshot | null = null;
  private _hwSnapshot: HardwareSnapshot | null = null;
  private _sampler: NodeJS.Timeout | null = null;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private loggerService: LoggerService,
  ) {
    this._databaseType = this.configService.get('database.type', 'postgres', {
      infer: true,
    });
    this._nodeVersion = process.version;
    this._frameworkVersion = nestPkg.version;

    const configMs = this.configService.get('app.monitorSampleMs', {
      infer: true,
    });
    const ms = Number(configMs);
    this._sampleMs = Number.isFinite(ms) && ms > 0 ? ms : 5000; // default 5s
  }

  onModuleInit() {
    LoggerAppPlugin.log(this.loggerService, this.appSummary(), {
      context: 'AppInfo',
      level: 'log',
    });

    // Prime snapshots immediately
    this._osSnapshot = this.computeOsSnapshot();
    this._hwSnapshot = this.computeHardwareSnapshot();

    // Start background sampler
    this._sampler = setInterval(() => {
      try {
        this._osSnapshot = this.computeOsSnapshot();
        this._hwSnapshot = this.computeHardwareSnapshot();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        this.loggerService.warn(
          'HomeService sampler tick failed',
          HomeService.name,
        );
      }
    }, this._sampleMs);

    this.loggerService.debug(
      `HomeService sampler started: interval=${this._sampleMs}ms`,
      HomeService.name,
    );
  }

  onModuleDestroy() {
    if (this._sampler) {
      clearInterval(this._sampler);
      this._sampler = null;
      this.loggerService.debug('HomeService sampler stopped', HomeService.name);
    }
  }

  private computeOsSnapshot() {
    return {
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      loadavg: os.loadavg()[0],
    };
  }

  private computeHardwareSnapshot() {
    const cpus = os.cpus();
    const cpuUsage = cpus.map((core) => ({
      model: core.model,
      speed: core.speed,
      times: {
        user: core.times.user,
        sys: core.times.sys,
        idle: core.times.idle,
        irq: core.times.irq,
        nice: core.times.nice,
      },
    }));

    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const usagePercent = total === 0 ? 0 : (used / total) * 100;

    return {
      cpuUsage,
      memory: { total, free, used, usagePercent },
      loadavg: os.loadavg(),
    };
  }

  versionInfo() {
    return {
      app: this._version,
      node: this._nodeVersion,
      framework: this._frameworkVersion,
      os: os.release(),
      osName: getHumanReadableOSName(),
    };
  }

  uptimeInfo() {
    const uptimeSeconds = process.uptime();
    const startTime = Date.now() - uptimeSeconds * 1000;
    return {
      uptime: uptimeSeconds,
      since: formatDistanceToNow(new Date(startTime), { addSuffix: true }),
    };
  }

  healthInfo() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  appSummary() {
    return {
      name: APP.name,
      version: APP.version,
      env: APP.nodeEnv,
      databaseType: this._databaseType,
      nodeVersion: this._nodeVersion,
      frameworkVersion: this._frameworkVersion,
      //TODO: get version and other info from services
      // redisVersion: this.configService.get('redis.version', { infer: true }),
      // dbVersion: this.configService.get('database.version', { infer: true }),
    };
  }

  osInfo(): OsSnapshot {
    if (!this._osSnapshot) {
      this._osSnapshot = this.computeOsSnapshot();
    }
    return this._osSnapshot;
  }

  hardwareUsage(): HardwareSnapshot {
    if (!this._hwSnapshot) {
      this._hwSnapshot = this.computeHardwareSnapshot();
    }
    return this._hwSnapshot;
  }
}
