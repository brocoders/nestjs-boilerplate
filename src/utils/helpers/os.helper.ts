import os from 'os';

export function getHumanReadableOSName(): string {
  const platform = os.platform(); // 'darwin', 'win32', 'linux'
  const type = os.type(); // 'Darwin', 'Windows_NT', 'Linux'
  const release = os.release(); // e.g. "5.15.0-105-generic"

  switch (platform) {
    case 'darwin':
      return `macOS (${type} ${release})`;
    case 'win32':
      return `Windows (${type} ${release})`;
    case 'linux':
      return `Linux (${type} ${release})`;
    default:
      return `${type} (${release})`;
  }
}

// For more detailed OS information, consider using packages like 'systeminformation'.
