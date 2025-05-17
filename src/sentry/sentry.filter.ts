import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';

@Catch()
export class SentryFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    // Capture exception in Sentry
    // this.sentry.instance().captureException(exception, {
    //   extra: {
    //     path: request.url,
    //     method: request.method,
    //     headers: request.headers,
    //     body: request.body,
    //   },
    // });

    // Optional: Preserve default error handling
    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
