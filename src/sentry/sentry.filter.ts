import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
@Catch()
export class SentryFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Capture exception in Sentry with additional context
    Sentry.withScope((scope) => {
      scope.addEventProcessor((event) => {
        event.request = {
          url: request.url,
          method: request.method,
          headers: request.headers,
          data: request.body,
        };
        return event;
      });
      Sentry.captureException(exception);
    });

    // Determine status code
    const status =
      exception.getStatus?.() ||
      exception.status ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    // Handle different exception types
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception.response?.message ||
        exception.message ||
        'Internal Server Error',
      error: exception.name || 'Exception',
      errors: exception?.response?.errors,
    };

    // Special handling for common error types
    if (exception.response?.error) {
      errorResponse.error = exception.response.error;
    }

    response.status(status).json(errorResponse);
  }
}
