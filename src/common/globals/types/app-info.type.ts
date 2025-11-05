// Reuse existing types; do NOT duplicate.
// AppInfo is just an alias of your AppConfig, so all consumers stay consistent.

export type { AppConfig as AppInfo } from '../../../config/app-config.type';

declare global {
  var APP: Readonly<import('../../../config/app-config.type').AppConfig>;
}

export {}; // keep ambient globals in module scope
