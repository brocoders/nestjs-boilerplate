import chalk from 'chalk';
import { pid } from 'process';
import { LoggerType, LogLevel } from '../types/logger-enum.type';
import { HttpException, HttpStatus } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { capitalize } from '../../../utils/helpers/string.helper';

function colorizeJsonString(jsonData: string): string {
  return jsonData
    .replace(/"([^"]+)":/g, (match) => chalk.yellow(match)) // Keys in yellow
    .replace(/:\s*"([^"]*)"/g, (match) => chalk.green(match)) // String values in green
    .replace(/:\s*(\d+(\.\d+)?)/g, (match) => chalk.cyan(match)) // Numbers (integers and floats) in cyan
    .replace(/:\s*(true|false)/g, (match) => chalk.magenta(match)) // Booleans in magenta
    .replace(/:\s*(null)/g, (match) => chalk.gray(match)) // Null values in gray
    .replace(/\[([^\]]*)]/g, (match) => chalk.blue(match)); // Arrays in blue (no redundant escape)
}

/**
 * Converts an object to a pretty JSON string with color.
 */
export function stringifyJson(data: any): string {
  if (typeof data !== 'object' || data === null) {
    return String(data);
  }

  return colorizeJsonString(JSON.stringify(data, null, 2));
}

export function formatTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => `${n}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function serializeContext(context: Record<string, any>): string {
  if (!context || typeof context !== 'object') return '';
  const allowedKeys = ['userId', 'ip', 'requestId'];
  const filtered = Object.entries(context)
    .filter(([key]) => allowedKeys.includes(key))
    .map(([key, val]) => `${key}=${val}`)
    .join(', ');
  return filtered ? `[${filtered}]` : '';
}

export function formatNestHeader(
  timestamp: string,
  level: string,
  context: string,
  type: LoggerType,
): string {
  return (
    chalk.gray('[Nest]') +
    ' ' +
    chalk.cyan(pid.toString().padEnd(7)) +
    chalk.gray('- ') +
    chalk.white(timestamp) +
    '   ' +
    (level === LogLevel.LOG
      ? chalk.green(level.padEnd(5))
      : level === LogLevel.DEBUG
        ? chalk.blue(level.padEnd(5))
        : level === LogLevel.ERROR
          ? chalk.red(level.padEnd(5))
          : level === LogLevel.WARN
            ? chalk.yellow(level.padEnd(5))
            : chalk.white(level.padEnd(5))) +
    ' ' +
    chalk.magenta(`[${context}]`).padEnd(33) + // adds spacing
    chalk.yellowBright(`[${type.toUpperCase()}]`)
  );
}

export function pickLevel(status: number): 'debug' | 'warn' | 'error' {
  if (!status || status <= 0 || status >= 600) return 'error';
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  return 'debug';
}

export function stringifyErrors(errors: any): string {
  if (!errors || typeof errors !== 'object') return '';
  const parts: string[] = [];
  for (const [key, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      parts.push(`${key}: ${value.join(', ')}`);
    } else if (value && typeof value === 'object') {
      const inner = Object.entries(value as Record<string, any>)
        .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(', ') : String(v)}`)
        .join(', ');
      parts.push(`${key}: { ${inner} }`);
    } else {
      parts.push(`${key}: ${String(value)}`);
    }
  }
  return parts.join(' | ');
}

export function getStatusFromException(exception: unknown): number {
  if (exception instanceof HttpException) return exception.getStatus();
  if (isAxiosError(exception))
    return exception.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
  const anyErr = exception as any;
  const cand = Number(anyErr?.status ?? anyErr?.statusCode ?? anyErr?.code);
  if (Number.isFinite(cand) && cand > 0) return cand;
  return HttpStatus.INTERNAL_SERVER_ERROR;
}

export function getShortMessage(exception: unknown): string {
  if (exception instanceof HttpException) {
    const resp = exception.getResponse();
    if (typeof resp === 'string') return resp;

    if (resp && typeof resp === 'object') {
      const r = resp as Record<string, any>;
      const m = r.message;
      if (Array.isArray(m) && m.length) return m.join('; ');
      if (typeof m === 'string' && m.trim()) return m;
      if (typeof r.error === 'string' && r.error.trim()) return r.error;
      if (r.errors && typeof r.errors === 'object') {
        const errStr = stringifyErrors(r.errors);
        if (errStr) return errStr;
      }
    }

    if (
      typeof (exception as any).message === 'string' &&
      (exception as any).message.trim()
    )
      return (exception as any).message;
    return 'Internal Server Error';
  }

  if (isAxiosError(exception)) {
    const data = exception.response?.data;
    if (data) {
      if (typeof data === 'string') return data;
      if (typeof data === 'object') {
        const d = data as Record<string, any>;
        if (typeof d.message === 'string' && d.message.trim()) return d.message;
        if (typeof d.error === 'string' && d.error.trim()) return d.error;
        if (d.errors && typeof d.errors === 'object') {
          const errStr = stringifyErrors(d.errors);
          if (errStr) return errStr;
        }
      }
    }
    return (exception.message as string) || 'Upstream request failed';
  }

  if (exception instanceof Error)
    return exception.message || 'Internal Server Error';
  return 'Internal Server Error';
}

/**
 * Builds a log message prefixed with the calling function name only.
 *
 * Example:
 *   mesageLog('debug', 'Starting process')
 *   // -> "[registerProvider] Starting process"
 */
export function mesageLog(level: LogLevel | string, message: string): string {
  const stack = new Error().stack;
  if (!stack) return `[unknown] ${message}`;

  const lines = stack.split('\n');
  const callerLine = lines[2] || '';
  const match = callerLine.match(/at\s+([^(]+)\s*\(/);
  const fnName = match
    ? capitalize(match[1].trim().split('.')[1])
    : 'anonymous';

  return `[${fnName}] ${message}`;
}
