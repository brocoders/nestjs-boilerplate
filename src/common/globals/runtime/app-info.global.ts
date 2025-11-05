// Always import this first in each entry point (e.g., src/main.ts):
// import '@/common/base/globals/runtime/app-info.global';

import { Logger } from '@nestjs/common';
import { AppConfig } from '../../../config/app-config.type';
import appConfig from '../../../config/app.config';
import { NodeEnv } from '../../../utils/types/gobal.type';

// Initialize logger early
const logger = new Logger('AppGlobals');

// The existing app.config.ts uses `registerAs('app', () => ({ ... }))`,
// so we can call it to resolve the current configuration.
// No direct `process.env` reads happen here.
const resolved = (appConfig as unknown as () => AppConfig)();

// Optional: freeze and wrap with Proxy for helpful dev warnings
const frozen = Object.freeze(
  new Proxy(resolved, {
    get(target, prop: string) {
      if (!(prop in target) && target?.nodeEnv !== NodeEnv.PRODUCTION) {
        logger.warn(
          `Attempted to access unknown APP property: ${String(prop)}`,
        );
      }
      return target[prop];
    },
  }),
);

// Declare a global variable once
declare global {
  var APP: Readonly<AppConfig>;
}

globalThis.APP = frozen;

logger.log(
  `Initialized global variables: ${APP.name}@${APP.version}:${APP.nodeEnv}`,
);

export {}; // ensure this file is treated as a module
