import { execSync } from 'child_process';

export function run(cmd: string): void {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

export function capture(cmd: string): string {
  return execSync(cmd, { encoding: 'utf8' });
}
