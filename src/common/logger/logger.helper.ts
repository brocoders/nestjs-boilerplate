import chalk from 'chalk';
import { pid } from 'process';
import { LoggerType } from './types/logger-enum.type';

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
    chalk.gray(' - ') +
    chalk.white(timestamp) +
    '   ' +
    (level === 'LOG'
      ? chalk.green(level.padEnd(5))
      : level === 'DEBUG'
        ? chalk.blue(level.padEnd(5))
        : level === 'ERROR'
          ? chalk.red(level.padEnd(5))
          : level === 'WARN'
            ? chalk.yellow(level.padEnd(5))
            : chalk.white(level.padEnd(5))) +
    ' ' +
    chalk.magenta(`[${context}]`).padEnd(33) + // adds spacing
    chalk.yellowBright(`[${type.toUpperCase()}]`)
  );
}
