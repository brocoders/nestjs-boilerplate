import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { HomeService } from './home.service';

@ApiTags('Info')
@Controller()
export class HomeController {
  constructor(private service: HomeService) {}

  @Get()
  @ApiOperation({
    summary: 'Ping the service',
    description:
      'Returns a simple status object indicating the service is alive',
  })
  @ApiOkResponse({
    schema: {
      example: { ok: true, service: 'home', timestamp: '2024-06-01T12:00:00Z' },
    },
  })
  ping() {
    return this.service.healthInfo();
  }

  @Get('version')
  @ApiOperation({
    summary: 'Get versions',
    description:
      'Returns versions of the app, Node.js, NestJS framework, and operating system',
  })
  @ApiOkResponse({
    schema: {
      example: {
        app: '1.2.0',
        node: 'v22.17.0',
        framework: '11.1.2',
        os: '25.0.0',
        osName: 'macOS Monterey',
      },
    },
  })
  versionInfo() {
    return this.service.versionInfo();
  }

  @Get('uptime')
  @ApiOperation({
    summary: 'Get uptime information',
    description:
      'Returns process uptime in seconds and a human-readable format',
  })
  @ApiOkResponse({
    schema: {
      example: {
        uptimeSec: 3600,
        uptimeHuman: '1h 0m 0s',
        processId: 12345,
        startTime: '2024-06-01T11:00:00Z',
      },
    },
  })
  uptimeInfo() {
    return this.service.uptimeInfo();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Get health status',
    description: 'Returns current health status and timestamp of the service',
  })
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-06-01T12:00:00Z',
      },
    },
  })
  healthInfo() {
    return this.service.healthInfo();
  }

  @Get('config')
  @ApiOperation({
    summary: 'Get application summary',
    description:
      'Returns a high-level summary of application configuration including name, version, environment, Node.js and framework versions',
  })
  @ApiOkResponse({
    schema: {
      example: {
        name: 'next-block',
        version: '1.0.0',
        env: 'production',
        databaseType: 'PostgreSQL',
        nodeVersion: 'v18.0.0',
        frameworkVersion: 'NestJS 9.0.0',
        sampleMs: 123,
      },
    },
  })
  appSummary() {
    return this.service.appSummary();
  }

  @Get('os')
  @ApiOperation({
    summary: 'Get OS information',
    description:
      'Returns a snapshot of operating system details including platform, release, uptime, load averages, memory, and CPU info',
  })
  @ApiOkResponse({
    schema: {
      example: {
        platform: 'linux',
        type: 'Linux',
        release: '5.4.0-66-generic',
        uptime: 123456,
        loadavg: [0.1, 0.5, 0.15],
        totalmem: 17179869184,
        freemem: 8589934592,
        cpus: [
          {
            model: 'Intel(R) Xeon(R) CPU @ 2.30GHz',
            speed: 2300,
            times: { user: 123456, nice: 0, sys: 12345, idle: 1234567, irq: 0 },
          },
        ],
      },
    },
  })
  osInfo() {
    return this.service.osInfo();
  }

  @Get('hardware')
  @ApiOperation({
    summary: 'Get hardware usage',
    description:
      'Returns runtime resource usage statistics including CPU percentage and memory usage',
  })
  @ApiOkResponse({
    schema: {
      example: {
        cpus: [
          {
            model: 'Intel(R) Xeon(R) CPU @ 2.30GHz',
            speed: 2300,
            usagePercent: 12.5,
          },
        ],
        memory: {
          total: 17179869184,
          used: 8589934592,
          free: 8589934592,
          usagePercent: 50,
        },
      },
    },
  })
  hardwareUsage() {
    return this.service.hardwareUsage();
  }
}
