import { LoggerService } from '../logger.service';
import { stringifyJson } from '../logger.helper';

export type LogLevel = 'log' | 'debug' | 'warn' | 'error' | 'verbose';

export interface AppSummaryLogOptions {
  /** Title printed before the payload */
  title?: string;
  /** Logger context (defaults to 'AppSummary') */
  context?: string;
  /** Logger level (defaults to 'log') */
  level?: LogLevel;
}

/**
 * Safely stringifies and colorizes the given summary object using your logger helper.
 * Falls back to JSON.stringify if stringifyJson throws for any reason.
 */
export function formatAppSummary(summary: unknown): string {
  try {
    return stringifyJson(summary);
  } catch {
    return JSON.stringify(summary, null, 2);
  }
}

/**
 * Logs an application summary object using your app LoggerService.
 * The payload will be colorized via stringifyJson and printed with the desired level/context.
 */
export function logAppSummary(
  logger: LoggerService,
  summary: unknown,
  options: AppSummaryLogOptions = {},
): void {
  const {
    title = 'Application Summary',
    context = 'AppSummary',
    level = 'log',
  } = options;
  const payload = formatAppSummary(summary);

  const line = `[${context}] ${title}`;

  switch (level) {
    case 'debug':
      logger.debug(line, context);
      logger.debug(payload, context);
      break;
    case 'warn':
      logger.warn(line, context);
      logger.warn(payload, context);
      break;
    case 'error':
      logger.error(line, undefined, context);
      logger.error(payload, undefined, context);
      break;
    case 'verbose':
      // if your LoggerService supports verbose
      (logger as any).verbose?.(line, context) ?? logger.log(line, context);
      (logger as any).verbose?.(payload, context) ??
        logger.log(payload, context);
      break;
    default:
      logger.log(line, context);
      logger.log(payload, context);
      break;
  }
}

/**
 * Class-style wrapper if you prefer importing as a plugin object.
 */
export class LoggerAppPlugin {
  static format(summary: unknown): string {
    return formatAppSummary(summary);
  }

  static log(
    logger: LoggerService,
    summary: unknown,
    options?: AppSummaryLogOptions,
  ): void {
    logAppSummary(logger, summary, options);
  }
}
