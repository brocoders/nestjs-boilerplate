import chalk from 'chalk';

function colorizeJson(jsonData: string): string {
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

  return colorizeJson(JSON.stringify(data, null, 2));
}
