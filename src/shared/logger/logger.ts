// src/shared/logger/logger.ts
import pino, { LoggerOptions } from 'pino';
import { getCurrentTrace } from './get-trace-context';
import { join } from 'path';
import fs from 'fs';

const logDir = join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const loggerOptions: LoggerOptions = {
  level: 'info',
  formatters: {
    log(object) {
      const trace = getCurrentTrace();
      const level = String(object.level || 'info');
      return {
        timestamp: new Date().toISOString(),
        severity_number: getSeverityNumber(level),
        severity_text: level.toUpperCase(),
        trace_id: trace.trace_id,
        span_id: trace.span_id,
        trace_flags: trace.trace_flags,
        body: object.msg,
        attributes: {
          ...object,
          context: object.context,
          responseTime: object.responseTime,
        },
      };
    },
  },
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: true,
        },
        level: 'info',
      },
      {
        target: 'pino/file',
        options: {
          destination: join(logDir, 'app.log'),
        },
        level: 'info',
      },
    ],
  },
};

function getSeverityNumber(level: string): number {
  switch (level) {
    case 'trace': return 1;
    case 'debug': return 5;
    case 'info': return 9;
    case 'warn': return 13;
    case 'error': return 17;
    case 'fatal': return 21;
    default: return 9;
  }
}

export const logger = pino(loggerOptions);
