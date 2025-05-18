import { ConfigService } from '@nestjs/config/dist/config.service';
import { AllConfigType } from '../config/config.type';

import Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const configService = new ConfigService<AllConfigType>();
// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: configService.get('sentry.dsn', { infer: true }),
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],
  environment: configService.get('sentry.environment', { infer: true }),
  //   integrations: [
  //     new Sentry.Integrations.Http({ tracing: true }),
  //     new ProfilingIntegration(),
  //   ],
  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: configService.get('sentry.tracesSampleRate', {
    infer: true,
  }),
  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: configService.get('sentry.profilesSampleRate', {
    infer: true,
  }),
});
